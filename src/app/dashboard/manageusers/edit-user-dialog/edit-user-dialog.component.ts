import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent {
  user: any;

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {
    this.user = { ...data }; // cloning data to avoid direct mutation
  }

  onSubmit() {
    this.userService.updateUser(this.user.userId, this.user).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.dialogRef.close(true);
      },
      error: err => {
        console.error(err);
        alert('Failed to update user!');
      }
    });
  }

  onCancel() {
    alert('User updation cancelled!!')
    this.dialogRef.close(false);
  }
}
