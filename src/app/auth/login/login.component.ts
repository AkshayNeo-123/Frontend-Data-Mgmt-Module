import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  // providers: [MatDialogRef],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage='';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
    // private cdRef: ChangeDetectorRef
  ) {}

  // ngAfterViewInit(): void {
  //   // Wait a moment to allow autofill to happen
  //   setTimeout(() => {
  //     this.loginForm.updateValueAndValidity();
  //     this.cdRef.detectChanges(); // Make Angular aware of changes
  //   }, 500);
  // }
  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid)
    {
      this.loginForm.markAllAsTouched(); // force show error messages
      return;
    }
  
    this.isLoading = true;
    const { email, password } = this.loginForm.value; // ✨ Only email and password
  
    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('UserId',response.userId);
        localStorage.setItem('RoleId',response.roleId);
  
        this.authService.setLoggedInUser({
          name: response.email,
          email: response.email,
          userid: response.userId
        });
  
        // Show Swal message on successful login
        // Swal.fire({
        //   title: 'Login Successful!',
        //   text: 'You have logged in successfully.',
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // });

        this.router.navigate(['/dashboard']);
      },
      
      error:(error)=>{

        console.error('loginFailed',error);
        this.errorMessage=JSON.stringify(error.error.message)

        Swal.fire({
              title: 'Login Failed',
              text: this.errorMessage,
              icon: 'error',
              confirmButtonText: 'Try Again'
            });
        
      }
    });
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
