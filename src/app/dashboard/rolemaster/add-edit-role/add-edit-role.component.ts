// import { Component, Inject } from '@angular/core';
// import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { RoleService } from '../../../services/role.service';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   standalone: true,
//   selector: 'app-add-edit-role',
//   templateUrl: './add-edit-role.component.html',
//   styleUrl: './add-edit-role.component.css',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDialogModule,
//     MatCheckboxModule,
//     MatButtonModule
//   ],
// })
// export class AddEditRoleComponent {
//   roleForm!: FormGroup;
//   permissionsFormGroup!: FormGroup;
//   isEditMode = false;

//   modulePermissions = [
//     { key: 'roleManagement', label: 'Role Management' },
//     { key: 'userManagement', label: 'User Management' },
//     { key: 'materials', label: 'Materials' },
//     { key: 'project', label: 'Project' },
//     { key: 'recipe', label: 'Recipe' },
//     { key: 'testing', label: 'Testing' },
//     { key: 'dashboard', label: 'Dashboard' },
//     { key: 'masterTables', label: 'Master Tables' }
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private roleService: RoleService,
//     private dialogRef: MatDialogRef<AddEditRoleComponent>,
//     private snackBar: MatSnackBar,
//     @Inject(MAT_DIALOG_DATA) public editData: any = null
//   ) {}

//   ngOnInit(): void {
//     this.initForms();

//     if (this.editData?.roleId) {
//       this.isEditMode = true;
//       this.getRoleById(this.editData.roleId);
//     }
//   }

//   initForms(): void {
//     this.roleForm = this.fb.group({
//       roleName: ['', Validators.required],
//       description: ['']
//     });

//     const permissionControls: { [key: string]: FormControl<boolean> } = {};
//     this.modulePermissions.forEach(p => {
//       permissionControls[p.key] = this.fb.control(false, { nonNullable: true });
//     });
//     this.permissionsFormGroup = this.fb.group(permissionControls);
//   }

//   getRoleById(id: number): void {
//     this.roleService.getRoleById(id).subscribe({
//       next: (role) => {
//         this.roleForm.patchValue({
//           roleName: role.roleName,
//           description: role.description
//         });

//         if (role.permissions) {
//           Object.entries(role.permissions).forEach(([key, value]) => {
//             if (this.permissionsFormGroup.contains(key)) {
//               this.permissionsFormGroup.get(key)?.setValue(value);
//             }
//           });
//         }
//       },
//       error: () => {
//         this.snackBar.open('Failed to fetch role details.', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   onSubmit(): void {
//     if (this.roleForm.invalid) return;

//     const formData = {
//       ...this.roleForm.value,
//       permissions: this.permissionsFormGroup.value
//     };

//     if (this.isEditMode) {
//       this.roleService.updateRole(this.editData.roleId, formData).subscribe({
//         next: () => {
//           this.snackBar.open('Role updated successfully.', 'Close', { duration: 3000 });
//           this.dialogRef.close(true);
//         },
//         error: () => {
//           this.snackBar.open('Failed to update role.', 'Close', { duration: 3000 });
//         }
//       });
//     } else {
//       this.roleService.addRole(formData).subscribe({
//         next: () => {
//           this.snackBar.open('Role added successfully.', 'Close', { duration: 3000 });
//           this.dialogRef.close(true);
//         },
//         error: () => {
//           this.snackBar.open('Failed to add role.', 'Close', { duration: 3000 });
//         }
//       });
//     }
//   }
// }
