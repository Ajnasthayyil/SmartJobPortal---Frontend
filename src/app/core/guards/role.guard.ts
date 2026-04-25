import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth           = inject(AuthService);
  const router         = inject(Router);
  const allowedRoles   = route.data['roles'] as string[];
  const currentRole    = auth.getRole();

  if (currentRole && allowedRoles.includes(currentRole)) return true;

  router.navigate(['/login']);
  return false;
};