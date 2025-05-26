import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionServiceService } from './services/permission-service.service';


export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(PermissionServiceService);
  const router = inject(Router);

  const resource = route.data?.['resource'];
  const action = route.data?.['action'];

  const hasPermission = permissionService.hasPermission(resource, action);

  if (!hasPermission) {
    router.navigate(['/login']); // Or any fallback page
    return false;
  }

  return true;
};
