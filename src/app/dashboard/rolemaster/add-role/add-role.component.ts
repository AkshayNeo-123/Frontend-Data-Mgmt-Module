// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-role',
//   imports: [],
//   templateUrl: './add-role.component.html',
//   styleUrl: './add-role.component.css'
// })
// export class AddRoleComponent {

// }


import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../../services/role.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-add-role',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      MatIconModule,
      MatRadioModule
  ],
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css'],
})
export class AddRoleComponent {
  // roleForm!: FormGroup;
  // modulePermissions = [
  //   { key: 'roleManagement', label: 'Role Management' },
  //   { key: 'userManagement', label: 'User Management' },
  //   { key: 'materials', label: 'Materials' },
  //   { key: 'project', label: 'Project' },
  //   { key: 'recipe', label: 'Recipe' },
  //   { key: 'testing', label: 'Testing' },
  //   { key: 'dashboard', label: 'Dashboard' },
  //   { key: 'masterTables', label: 'Master Tables' }
  // ];

  // constructor(
  //   private fb: FormBuilder,
  //   private dialogRef: MatDialogRef<AddRoleComponent>,
  //   private snackBar: MatSnackBar,
  //   private roleService: RoleService
  // ) {
  //   this.roleForm = this.fb.group({
  //     roleName: ['', Validators.required],
  //     description: [''],
  //     permissions: this.fb.group(
  //       this.modulePermissions.reduce((acc, perm) => {
  //         acc[perm.key] = [false];
  //         return acc;
  //       }, {} as any)
  //     )
  //   });
  // }

  // onSubmit(): void {
  //   if (this.roleForm.invalid) return;

  //   this.roleService.addRole(this.roleForm.value).subscribe({
  //     next: () => {
  //       this.snackBar.open('Role added successfully.', 'Close', { duration: 3000 });
  //       this.dialogRef.close(true);
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to add role.', 'Close', { duration: 3000 });
  //     }
  //   });
  // }
  roleForm!: FormGroup;
  permissionsFormGroup!: FormGroup;
  isEditMode = false;

  modulePermissions = [
    { key: 'roleManagement', label: 'Role Management' },
    { key: 'userManagement', label: 'User Management' },
    { key: 'materials', label: 'Materials' },
    { key: 'project', label: 'Project' },
    { key: 'recipe', label: 'Recipe' },
    { key: 'testing', label: 'Testing' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'masterTables', label: 'Master Tables' }
  ];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private dialogRef: MatDialogRef<AddRoleComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any = null
  ) {}

  ngOnInit(): void {
    this.initForms();

    if (this.editData?.roleId) {
      this.isEditMode = true;
      this.getRoleById(this.editData.roleId);
    }
  }

  initForms(): void {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      description: ['']
    });

    const permissionControls: { [key: string]: FormControl<boolean> } = {};
    this.modulePermissions.forEach(p => {
      permissionControls[p.key] = this.fb.control(false, { nonNullable: true });
    });
    this.permissionsFormGroup = this.fb.group(permissionControls);
  }

  getRoleById(id: number): void {
    this.roleService.getRoleById(id).subscribe({
      next: (role) => {
        this.roleForm.patchValue({
          roleName: role.roleName,
          description: role.description
        });

        if (role.permissions) {
          Object.entries(role.permissions).forEach(([key, value]) => {
            if (this.permissionsFormGroup.contains(key)) {
              this.permissionsFormGroup.get(key)?.setValue(value);
            }
          });
        }
      },
      error: () => {
        this.snackBar.open('Failed to fetch role details.', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const formData = {
      ...this.roleForm.value,
      permissions: this.permissionsFormGroup.value
    };

    if (this.isEditMode) {
      this.roleService.updateRole(this.editData.roleId, formData).subscribe({
        next: () => {
          this.snackBar.open('Role updated successfully.', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to update role.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.roleService.addRole(formData).subscribe({
        next: () => {
          this.snackBar.open('Role added successfully.', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to add role.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
