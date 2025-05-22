import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  errorMessage='';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // Wait a moment to allow autofill to happen
    setTimeout(() => {
      this.loginForm.updateValueAndValidity();
      this.cdRef.detectChanges(); // Make Angular aware of changes
    }, 500);
  }
  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  

  login(): void {
    if (this.loginForm.invalid) return;
  
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
          userid: response.userId,
          rolePermissions: response.rolePermissions
        });
  
        // Show Swal message on successful login
        // Swal.fire({
        //   title: 'Login Successful!',
        //   text: 'You have logged in successfully.',
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // });

        this.router.navigate(['/dashboard'],{ replaceUrl: true });
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
