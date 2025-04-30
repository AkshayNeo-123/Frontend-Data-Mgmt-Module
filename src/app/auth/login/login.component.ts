import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;
  
    this.isLoading = true;
    const { email, password } = this.loginForm.value; // ✨ Only email and password
  
    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
  
        this.authService.setLoggedInUser({
          name: response.email,
          email: response.email,
          userid: response.userId
        });
  
        // Show Swal message on successful login
        Swal.fire({
          title: 'Login Successful!',
          text: 'You have logged in successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;

        // Show Swal error message
        Swal.fire({
          title: 'Login Failed',
          text: 'Please check your credentials.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
        console.error(err);
      }
    });
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
