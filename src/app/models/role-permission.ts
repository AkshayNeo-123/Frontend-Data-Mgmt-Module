export interface RolePermission {
  roleId: number;
  menuId: number;
  menuName: string;
  // module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
