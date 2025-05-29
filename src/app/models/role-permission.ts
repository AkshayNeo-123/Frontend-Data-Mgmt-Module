export interface RolePermission {
  roleId: number;
  menuId: number;
  menuName: string;
  // module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  parentId?: number;
  children?:RolePermission[];

}

export interface ChangePasswordDto{
   userId:number;
   oldPassword:string;
   newPassword:string;
   confirmPasswordHash:string
}
