import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css'
})
export class AddUserDialogComponent {
  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    phone: '',
    roleId: 0,
    status: 'Active'
  };
  constructor(
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private userService: UserService
  ) {}
  onSubmit() {
    this.userService.addUser(this.newUser).subscribe({
      next: (res) => {
        alert('User added successfully!');
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
