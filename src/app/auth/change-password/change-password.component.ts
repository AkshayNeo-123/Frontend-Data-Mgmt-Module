import { Component, Inject, NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordDto } from '../../models/role-permission';

@Component({
  selector: 'app-change-password',
  standalone:true,
  imports: [CommonModule,MatIconModule,FormsModule,MatInputModule,
  MatFormFieldModule,MatDialogModule,MatButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  newPass={
    userId:0,
    oldPassword:'',
    confirmPasswordHash:'',
    newPassword:''
  }

  
  constructor(private userPassService:UserService,  
        private toastr: ToastrService
    ,    private dialogRef: MatDialogRef<ChangePasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any


  ) {
        this.newPass.userId=data.userId;
  }

  get passwordsMatch(): boolean {

      var data =  this.newPass.oldPassword === this.newPass.confirmPasswordHash;
      console.log(this.newPass.oldPassword)
      console.log(this.newPass.confirmPasswordHash)
      console.log(data)
      return data;
    }

     showPassword = false;
    showConfirmPassword = false;

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }


errorMessage='';
 onSubmit(form: NgForm) {
  const { oldPassword, newPassword, confirmPasswordHash } = this.newPass;

  if (!oldPassword || !newPassword || !confirmPasswordHash) {
    this.toastr.error('Please fill all required fields.', 'Error', { timeOut: 5000 });
    return;
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,20}$/;
  if (!passwordPattern.test(newPassword)) {
    this.toastr.error(
      'Password must have at least 1 uppercase, 1 lowercase, 1 special character, and be 6–20 characters long.',
      'Invalid Password',
      { timeOut: 5000 }
    );
    return;
  }

  if (oldPassword === newPassword) {
    this.toastr.error('New password must be different from current password.', 'Error', {
      timeOut: 5000,
    });
    return;
  }

  if (newPassword !== confirmPasswordHash) {
    this.toastr.error('New password and confirm password do not match.', 'Error', {
      timeOut: 5000,
    });
    return;
  }

  const payload = {
    userId: this.newPass.userId,
    oldPassword,
    newPassword,
  };

  this.userPassService.changePassword(this.newPass.userId, payload).subscribe({
    next: () => {
      this.toastr.success('Password updated successfully!', 'Success', { timeOut: 5000 });
      this.dialogRef.close(true);
    },
    error: (err) => {
      if (err.status === 400 && err.error?.title?.includes('incorrect')) {
        this.toastr.error('Current password is incorrect.', 'Error', { timeOut: 5000 });
      } else {
        this.toastr.error('Current password is incorrect.', 'Error', {
          timeOut: 5000,
        });
      }
    },
  });
}


  onCancel(): void {
    this.dialogRef.close(false);
  }
  
}