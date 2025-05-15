import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    MatRadioModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements OnInit{
  user: any;
  roles: any[] = [];
  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.user = { ...data }; // cloning data to avoid direct mutation
  }
  ngOnInit(): void {
    this.loadRoles();
    this.user.roleId = Number(this.user.roleId);
  }

  compareRoles(r1: any, r2: any): boolean {
    // comparing by value if numbers, or convert both to same type
    return r1 == r2; // looses equality handles string/number mismatch
  }

  showPassword=false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // onSubmit(form: NgForm) {
    
  //   if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.passwordHash || !this.user.confirmPasswordHash || !this.user.phone || !this.user.roleId) {
  //     // alert('All fields are required.');
  //     this.toastr.error(
  //       'All fields are required.' ,
  //       'Error',{
  //         timeOut:5000
  //       }
  //     );
  //     return;
  //   }
  
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(this.user.email)) {
  //     // alert('Invalid email format.');
  //     this.toastr.error(
  //       'Invalid email format!' ,
  //       'Error',{
  //         timeOut:5000
  //       }
  //     );
  //     return;
  //   }

  //   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
    
  //   // if (this.newUser.passwordHash.length < 6) {
  //   //   alert('Password must be at least 6 characters long.');
  //   //   return;
  //   // }
  //   if (!passwordPattern.test(this.user.passwordHash)) {
  //     alert('Password must have at least 1 uppercase, 1 lowercase, 1 special character, and be 6+ characters long.');
  //     return;
  //   }
  
  //   if (!/^\d{10}$/.test(this.user.phone)) {
  //     // alert('Phone number must be 10 digits.');
  //     this.toastr.error(
  //       'Phone number must be 10 digits.' ,
  //       'Error',{
  //         timeOut:5000
  //       }
  //     );
  //     return;
  //   }
  
  //   if (!this.user.roleId) {
  //     alert('Please select a role.');
  //     return;
  //   }
  
  //   this.userService.addUser(this.user).subscribe({
  //     next: (res) => {
  //       // alert('Saved successfully!');
  //       this.toastr.success(
  //         'Updated successfully!' ,
  //         'Success',{
  //           timeOut:5000
  //         }
  //       );
  //       this.dialogRef.close(true);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       // alert('Failed to add user.');
  //       this.toastr.error(
  //         'Something went wrong' ,
  //         'Error',{
  //           timeOut:5000
  //         }
  //       );
  //     }
  //   });

  //   // if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.passwordHash || !this.user.confirmPasswordHash || !this.user.phone || !this.user.roleId) {
  //   //   // alert('All fields are required.');
  //   //   this.toastr.error(
  //   //     'All fields are required.' ,
  //   //     'Error',{
  //   //       timeOut:5000
  //   //     }
  //   //   );
  //   //   return;
  //   // }

  //   // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   //   if (!emailPattern.test(this.user.email)) {
  //   //     // alert('Invalid email format.');
  //   //     this.toastr.error(
  //   //       'Invalid email format!' ,
  //   //       'Error',{
  //   //         timeOut:5000
  //   //       }
  //   //     );
  //   //     return;
  //   //   }

  //   // if(form.invalid){
  //   //   this.toastr.warning(
  //   //     'Enter a valid password',
  //   //     'Warning', {
  //   //       timeOut:5000
  //   //     }
  //   //   )
  //   //   return;
  //   // }
  //   // this.userService.updateUser(this.user.userId, this.user).subscribe({
  //   //   next: () => {
  //   //     // alert('Updated successfully!');
  //   //     this.toastr.success(
  //   //       'Updated successfully!',
  //   //       'Success',{
  //   //         timeOut:5000
  //   //       }
  //   //     );
  //   //     this.dialogRef.close(true);
  //   //   },
  //   //   error: err => {
  //   //     console.error(err);
  //   //     // alert('Failed to update user!');
  //   //     this.toastr.error(
  //   //       'Something went wrong!' ,
  //   //       'Error',{
  //   //         timeOut:5000
  //   //       }
  //   //     );
  //   //   }
  //   // });
  // }

  onSubmit(form: NgForm) {
    
    if (form.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Warning', { timeOut: 5000 });
      return;
    }
  
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.user.email)) {
      this.toastr.error('Invalid email format!', 'Error', { timeOut: 5000 });
      return;
    }
  
    
    if (this.user.passwordHash) {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
      if (!passwordPattern.test(this.user.passwordHash)) {
        this.toastr.error(
          'Password must have at least 1 uppercase, 1 lowercase, 1 special character, and be 6+ characters long.',
          'Error',
          { timeOut: 5000 }
        );
        return;
      }
    }
  
    if (!/^\d{10}$/.test(this.user.phone)) {
      this.toastr.error('Phone number must be 10 digits.', 'Error', { timeOut: 5000 });
      return;
    }
  
    const uId=Number(localStorage.getItem('UserId'));
    this.user.modifiedBy  =uId;

    this.userService.updateUser(this.user.userId, this.user).subscribe({
      next: () => {
        this.toastr.success('Updated successfully!', 'Success', { timeOut: 5000 });
        this.dialogRef.close(true);
      },
      error: err => {
        console.error(err);
        this.toastr.error('Failed to update user!', 'Error', { timeOut: 5000 });
      }
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (res) => {
        console.log('Roles from API:', res);
        this.roles = res.map(role => ({ ...role, roleId: Number(role.roleId) }));
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
      }
    });
  }

  onCancel() {
    // alert('User updation cancelled!!')
    this.dialogRef.close(false);
  }
}



