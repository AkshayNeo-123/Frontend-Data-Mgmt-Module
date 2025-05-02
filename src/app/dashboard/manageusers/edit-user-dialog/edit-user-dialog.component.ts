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
    MatOptionModule
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
    this.loadRoles()
  }

  showPassword=false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
     
    if(form.invalid){
      this.toastr.warning(
        'Enter a valid password',
        'Warning', {
          timeOut:5000
        }
      )
      return;
    }
    this.userService.updateUser(this.user.userId, this.user).subscribe({
      next: () => {
        // alert('Updated successfully!');
        this.toastr.success(
          'Updated successfully!',
          'Success',{
            timeOut:5000
          }
        );
        this.dialogRef.close(true);
      },
      error: err => {
        console.error(err);
        // alert('Failed to update user!');
        this.toastr.error(
          'Something went wrong!' ,
          'Error',{
            timeOut:5000
          }
        );
      }
    });
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

  onCancel() {
    // alert('User updation cancelled!!')
    this.dialogRef.close(false);
  }
}



