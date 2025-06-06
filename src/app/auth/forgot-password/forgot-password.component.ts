import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
  
})
export class ForgotPasswordComponent {
    forgotForm!: FormGroup;
    isSendingOtp: boolean = false;  
    otpSent:boolean = false;
    otpVerified = false;
    errorMessage='';
    showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, @Inject(Router) private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }
  sendOtp() {
    const email = this.forgotForm.value.email;
    // console.log("email="+email);
    this.isSendingOtp = true;
    this.authService.sendOtp(email).subscribe({
      next: () => {
        // console.log("2");
        this.otpSent = true;
        // console.log("OTPSENT: "+this.otpSent)
        this.isSendingOtp = false;
        Swal.fire('OTP Sent', 'Please check your email', 'info');
      },
      error: (error) => {
        this.isSendingOtp = false;
          this.errorMessage=JSON.stringify(error.error.message);
          Swal.fire({
                        title: 'Failed to send OTP',
                        text: this.errorMessage,
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                      });
        // Swal.fire('Error', 'Failed to send OTP', 'error')
      }
    });
    // this.forgotForm.get('email')?.disable();
  }

  verifyOtp() {
    const { email, otp } = this.forgotForm.value;
    this.authService.verifyOtp(email, otp).subscribe({
      next: () => {
        this.otpVerified = true;
        Swal.fire('OTP Verified', 'You may now reset your password', 'success');
      },
      error: () => Swal.fire('Invalid OTP', 'Please try again', 'error')
    });
  }

  resetPassword() {
    const { email, newPassword, confirmPassword } = this.forgotForm.value;

    if (newPassword !== confirmPassword) {
      Swal.fire('Mismatch', 'Passwords do not match', 'warning');
      return;
    }

    this.authService.resetPassword(email, newPassword).subscribe({
      next: () => {
        Swal.fire('Success', 'Password reset successfully, You may now login with your new password', 'success').then(()=>{
          this.router.navigate(['/login']);
        })

      },
      error: (error) =>{
        this.errorMessage=JSON.stringify(error.error.message);
          Swal.fire({
                        title: 'Failed to reset password',
                        text: this.errorMessage,
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                      });
      } 
        // Swal.fire('Error', 'Failed to reset password', 'error')

    });
  }

  
toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}


}
