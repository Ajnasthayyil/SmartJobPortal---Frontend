import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401s are handled by jwtInterceptor
      if (err.status !== 401) {
        let msg = '';
        if (err.status === 0) {
          msg = 'Unable to connect to the server. Please check your connection or ensure the API is running.';
        } else if (err.error && typeof err.error === 'string') {
          msg = err.error.substring(0, 150);
        } else if (err.error?.message) {
          msg = err.error.message;
        } else if (err.error?.title) {
          msg = err.error.title;
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = 'An unexpected error occurred.';
        }
        
        // Show the extracted error globally
        toast.error(`Error: ${msg}`);
      }
      return throwError(() => err);
    })
  );
};
