// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-role',
//   imports: [],
//   templateUrl: './edit-role.component.html',
//   styleUrl: './edit-role.component.css'
// })
// export class EditRoleComponent {

// }


import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../../services/role.service';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class EditRoleComponent implements OnInit {
  roleForm!: FormGroup;
  modulePermissions: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditRoleComponent>,
    private snackBar: MatSnackBar,
    private roleService: RoleService,
    private menuService: MenuService,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
    
  //   this.roleForm = this.fb.group({
  //     roleName: ['', Validators.required],
  //     description: ['']
  //     // permissions: this.fb.group(
  //     //   this.modulePermissions.reduce((acc, perm) => {
  //     //     acc[perm.key] = [false];
  //     //     return acc;
  //     //   }, {} as any)
  //     // )
  //   });

  //   if (this.editData) {
  //     this.loadData();
  //   }
  }

  ngOnInit(): void {
    // console.log('Form Structure:', this.roleForm.value);
    // console.log('role.permissions from API:', role.permissions);
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissions: this.fb.group({})
    });

    this.menuService.getMenu().subscribe({
      next: (menus) => {
        this.modulePermissions = menus;

        const permissionsGroup = this.roleForm.get('permissions') as FormGroup;
        this.modulePermissions.forEach(menu => {
          permissionsGroup.addControl(
            menu.id,
            this.fb.group({
              view: [false],
              create: [false],
              update: [false],
              delete: [false]
            })
          );
        });
          // this.loadData();

        // if (this.editData) {
        // }
      },
      error: () => {
        this.snackBar.open('Failed to load menu list.', 'Close', { duration: 3000 });
      }
    });
    this.loadData();
  }

  // loadData(): void {
  //   this.roleService.getRoleById(this.editData.roleId).subscribe({
  //     next: (role) => {
  //       this.roleForm.patchValue({
  //         roleName: role.roleName,
  //       });



  //       if (role.permissions) {
  //         Object.entries(role.permissions).forEach(([key, value]) => {
  //           const control = (this.roleForm.get('permissions') as FormGroup).get(key);
  //           if (control) control.setValue(value);
  //         });
  //       }
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to fetch role details.', 'Close', { duration: 3000 });
  //     }
  //   });
  // }

  loadData(): void {
    this.roleService.getRoleById(this.editData.roleId).subscribe({
      next: (role) => {
        console.log(role);
        this.roleForm.patchValue({
          roleName: role.roleName,
        });
        // Patch permission checkboxes
        if (role.rolePermissions && Array.isArray(role.rolePermissions)) {
          const permissionsGroup = this.roleForm.get('permissions') as FormGroup;
          role.rolePermissions.forEach((perm: any) => {
            const group = permissionsGroup.get(perm.menuId.toString()) as FormGroup;
            if (group) {
              group.patchValue({
                view: perm.canView,
                create: perm.canCreate,
                update: perm.canEdit,
                delete: perm.canDelete
              });
            }
          });
          console.log(permissionsGroup, role.rolePermissions);
        }
      },
      error: () => {
        this.snackBar.open('Failed to fetch role details.', 'Close', { duration: 3000 });
      }
    });
  }

  // onSubmit(): void {
  //   if (this.roleForm.invalid) return;

  //   this.roleService.updateRole(this.editData.roleId, this.roleForm.value).subscribe({
  //     next: () => {
  //       this.snackBar.open('Role updated successfully.', 'Close', { duration: 3000 });
  //       this.dialogRef.close(true);
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to update role.', 'Close', { duration: 3000 });
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const updatedRole = {
      ...this.roleForm.value,
      roleId: this.editData.roleId
    };

    console.log(updatedRole);

    this.roleService.updateRole(this.editData.roleId, updatedRole).subscribe({
      next: () => {
        this.snackBar.open('Role updated successfully.', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open('Failed to update role.', 'Close', { duration: 3000 });
        console.log(error.error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
