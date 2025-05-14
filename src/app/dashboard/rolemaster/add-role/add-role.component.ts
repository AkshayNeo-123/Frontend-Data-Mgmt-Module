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
import { MenuService } from '../../../services/menu.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
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
    MatRadioModule,
    MatCheckboxModule,
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
  selectAllChecked = false;
  roleForm!: FormGroup;
  permissionsFormGroup!: FormGroup;
  isEditMode = false;
  modulePermissions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private menuService: MenuService,
    private dialogRef: MatDialogRef<AddRoleComponent>,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any = null
  ) {

    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissions: this.fb.group({})
    });
    
    

  }

  ngOnInit(): void {
    this.initForms();
    this.getMenus();
  }

  getMenus(): void {
    this.menuService.getMenu().subscribe({
      next: (menus) => {
        this.modulePermissions = menus;
        this.modulePermissions.forEach(permission => {
          const group = this.fb.group({
            view: [false],
            // create: [{ value: false, disabled: true }],
            // update: [{ value: false, disabled: true }],
            // delete: [{ value: false, disabled: true }]
            create: [false],
            update: [false],
            delete: [false]
          });
          // console.log(permission.menuName);
          const id = String(permission.id);
          (this.roleForm.get('permissions') as FormGroup).addControl(id, group);
        });
      },
      error: () => {
        this.snackBar.open('Failed to load menu permissions.', 'Close', { duration: 3000 });
      }
    });
  }

  toggleAllPermissions(event: MatCheckboxChange): void {
  const isChecked = event.checked;
  this.selectAllChecked = isChecked;
  const permissionsGroup = this.roleForm.get('permissions') as FormGroup;

  Object.keys(permissionsGroup.controls).forEach(menuId => {
    const permission = permissionsGroup.get(menuId) as FormGroup;
    permission.patchValue({
      view: isChecked,
      create: isChecked,
      update: isChecked,
      delete: isChecked
    });
  });
}

onAnyPermissionChange(): void {
  const permissionsGroup = this.roleForm.get('permissions') as FormGroup;

  let allChecked = true;

  Object.keys(permissionsGroup.controls).forEach(menuId => {
    const permission = permissionsGroup.get(menuId) as FormGroup;
    const values = permission.value;

    // If any box is unchecked, allChecked = false
    if (!values.view || !values.create || !values.update || !values.delete) {
      allChecked = false;
    }
  });

  this.selectAllChecked = allChecked;
}

onViewChange(menuId: string): void {
  const permissionsGroup = (this.roleForm.get('permissions') as FormGroup).get(menuId) as FormGroup;
  const viewControl = permissionsGroup.get('view');
  const isViewChecked = viewControl?.value;

  ['create', 'update', 'delete'].forEach(permission => {
    const control = permissionsGroup.get(permission);
    if (control) {
      if (isViewChecked) {
        control.enable();
      } else {
        control.disable();
        control.setValue(false);  // uncheck when disabling
      }
    }
    console.log(menuId, 'view:', isViewChecked);
  });
}

  initForms(): void {
    // this.roleForm = this.fb.group({
    
    const permissionControls: { [key: string]: FormControl<boolean> } = {};
    this.modulePermissions.forEach(p => {
      permissionControls[p.key] = this.fb.control(false, { nonNullable: true });
    });
    this.permissionsFormGroup = this.fb.group(permissionControls);
  }

  // getRoleById(id: number): void {
  //   this.roleService.getRoleById(id).subscribe({
  //     next: (role) => {
  //       this.roleForm.patchValue({
  //         roleName: role.roleName
  //         // description: role.description
  //       });

  //       if (role.permissions) {
  //         Object.entries(role.permissions).forEach(([key, value]) => {
  //           if (this.permissionsFormGroup.contains(key)) {
  //             this.permissionsFormGroup.get(key)?.setValue(value);
  //           }
  //         });
  //       }
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to fetch role details.', 'Close', { duration: 3000 });
  //     }
  //   });
  // }

  onSubmit(): void {
    console.log(this.roleForm.value)
    if (this.roleForm.invalid) return;

    // const formData = {
    //   ...this.roleForm.value,
    //   permissions: this.permissionsFormGroup.value
    // };

    
      this.roleService.addRole(this.roleForm.value).subscribe({
        next: () => {
          this.snackBar.open('Role added successfully.', 'Close', { duration: 3000 });
          // this.toastr.success('Role added successfully.');
          // this.toastr.success(
          //   'Saved successfully!' ,
          //   'Success',{
          //     timeOut:5000
          //   }
          // );
          this.roleForm.reset();
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to add role.', 'Close', { duration: 3000 });
          // this.toastr.error(
          //   'Failed to add role.' ,
          //   'Error',{
          //     timeOut:5000
          //   }
          // );
        }
      });
  }
  onCancel() {
    this.dialogRef.close();
  }
}
