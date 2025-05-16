import { Injectable } from '@angular/core';
import { RolePermission } from '../models/role-permission';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionServiceService {
  private permissions: RolePermission[] = [];

  constructor(private http: HttpClient) {}

  fetchPermissions(roleId: number): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`/api/RolePermissions/${roleId}`);
  }

  setPermissions(perms: RolePermission[]) {
    this.permissions = perms;
    localStorage.setItem('permissions', JSON.stringify(perms));
  }

  getPermissions(): RolePermission[] {
    if (this.permissions.length === 0) {
      const perms = localStorage.getItem('permissions');
      if (perms) this.permissions = JSON.parse(perms);
    }
    return this.permissions;
  }

  hasPermission(module: string, permission: 'canView' | 'canCreate' | 'canEdit' | 'canDelete'): boolean {
    const mod = this.getPermissions().find(p => p.module === module);
    return mod ? mod[permission] : false;
  }
}
