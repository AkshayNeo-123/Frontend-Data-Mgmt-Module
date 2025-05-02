  import { Component } from '@angular/core';
  import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
  import { UserService } from '../../../services/user.service';
  import { FormsModule, NgForm } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { CommonModule } from '@angular/common';
  import { MatIconModule } from '@angular/material/icon';
  import { MatOptionModule } from '@angular/material/core';
  import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';

  @Component({
    selector: 'app-add-user-dialog',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      MatIconModule
    ],
    templateUrl: './add-user-dialog.component.html',
    styleUrl: './add-user-dialog.component.css'
  })
  export class AddUserDialogComponent {
    newUser = {
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      passwordHash: '',
      confirmPasswordHash: '',
      phone: '',
      roleId: '',
      status: ''
    };
    get passwordsMatch(): boolean {

      var data =  this.newUser.passwordHash === this.newUser.confirmPasswordHash;
      console.log(this.newUser.passwordHash)
      console.log(this.newUser.confirmPasswordHash)
      console.log(data)
      return data;
    }
    roles: any[] = [];
    constructor(
      private dialogRef: MatDialogRef<AddUserDialogComponent>,
      private userService: UserService,
      private toastr: ToastrService
    ) {
      this.newUser.userId = '';
      this.loadRoles();
      this.loadNextUserId();
    }

    showPassword = false;
    showConfirmPassword = false;

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }

    loadRoles() {
      this.userService.getRoles().subscribe({
        next: (res) => {
          console.log('Roles from API:', res);
          this.roles = res;
        },
        error: (err) => {
          console.error('Failed to load roles:', err);
        }
      });
    }

    loadNextUserId() {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          const maxId = users.reduce((max, user) => {
            const id = Number(user.userId);
            return id > max ? id : max;
          }, 0);
    
          this.newUser.userId = maxId + 1;
          
        },
        error: (err) => {
          console.error('Failed to fetch users for ID:', err);
        }
      });
    }
    
    allowOnlyNumbers(event: KeyboardEvent) {
      const charCode = event.key.charCodeAt(0);
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    }  

    onSubmit(form: NgForm) {
      if (form.invalid) {
        alert('Please fill all fields correctly.');
        return;
      }
    
      if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email || !this.newUser.passwordHash || !this.newUser.confirmPasswordHash || !this.newUser.phone || !this.newUser.roleId) {
        alert('All fields are required.');
        return;
      }
    
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.newUser.email)) {
        alert('Invalid email format.');
        return;
      }
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
      
      // if (this.newUser.passwordHash.length < 6) {
      //   alert('Password must be at least 6 characters long.');
      //   return;
      // }
      if (!passwordPattern.test(this.newUser.passwordHash)) {
        alert('Password must have at least 1 uppercase, 1 lowercase, 1 special character, and be 6+ characters long.');
        return;
      }
    
      if (this.newUser.passwordHash !== this.newUser.confirmPasswordHash) {
        alert('Passwords do not match.');
        return;
      }
    
      if (!/^\d{10}$/.test(this.newUser.phone)) {
        alert('Phone number must be 10 digits.');
        return;
      }
    
      if (!this.newUser.roleId) {
        alert('Please select a role.');
        return;
      }
    
      this.userService.addUser(this.newUser).subscribe({
        next: (res) => {
          alert('Saved successfully!');
          // this.toastr.success(
          //   'Saved successfully!' ,
          //   'Success'
          // );
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to add user.');
        }
      });
    }

    onCancel() {
      this.dialogRef.close();
    }
  }
