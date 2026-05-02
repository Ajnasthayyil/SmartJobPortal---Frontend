import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const token  = auth.getToken();

  // Attach token and withCredentials (required to send cookies to the backend)
  let authReq = req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // Prevent infinite loops if the refresh or login endpoints fail
        if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
          auth.logout();
          return throwError(() => err);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return auth.refreshToken().pipe(
            switchMap((res) => {
              isRefreshing = false;
              if (res.success && res.data && res.data.token) {
                refreshTokenSubject.next(res.data.token);
                // Retry the original request with the new token
                return next(req.clone({
                  withCredentials: true,
                  setHeaders: { Authorization: `Bearer ${res.data.token}` }
                }));
              } else {
                auth.logout();
                return throwError(() => new Error('Refresh failed'));
              }
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              auth.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          // Wait until the refresh token is acquired, then retry the request
          return refreshTokenSubject.pipe(
            filter(t => t !== null),
            take(1),
            switchMap((newToken) => {
              return next(req.clone({
                withCredentials: true,
                setHeaders: { Authorization: `Bearer ${newToken}` }
              }));
            })
          );
        }
      }
      return throwError(() => err);
    })
  );
};