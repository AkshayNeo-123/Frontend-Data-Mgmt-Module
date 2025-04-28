import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  @Output() toggle = new EventEmitter<void>();  
  userName: string = 'User'; 
  isDropdownOpen: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    this.userName = user && user.name ? user.name : 'User'; 
  }

  onToggleSidebar(): void {
    this.toggle.emit();
  }

  toggleDropdown(event: MouseEvent): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdownMenu = (event.target as HTMLElement).nextElementSibling;
    if (this.isDropdownOpen) {
      dropdownMenu?.classList.add('show');  // Show dropdown
    } else {
      dropdownMenu?.classList.remove('show');  // Hide dropdown
    }
  }

  // Perform logout, clear session data, and redirect to login page
  logout(): void {
    this.authService.performLogout();  // Handle logout logic in AuthService
    this.router.navigate(['/login']);  // Navigate to login page
  }
}
