
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../auth/change-password/change-password.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-topbar',
  standalone:true,
  imports:[ CommonModule,
  
    MatIconModule,
    MatDialogModule,MatTooltipModule,
    RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
  imports: [
    MatTooltipModule
  ]
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();  
  userName: string = 'User'; 
  isDropdownOpen: boolean = false;  

  constructor(private authService: AuthService, private router: Router,private dialog:MatDialog) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    this.userName = user && user.name ? user.name : 'User'; 
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit(); 
  }

  toggleDropdown(event: MouseEvent): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdownMenu = (event.target as HTMLElement).nextElementSibling;
    if (this.isDropdownOpen) {
      dropdownMenu?.classList.add('show');  
    } else {
      dropdownMenu?.classList.remove('show');  
    }
  }

  logout(): void {
    this.authService.performLogout();  
    this.router.navigate(['/login']);  
  }

   showDropdown=false;
      editPasswordDia(){
          this.showDropdown = false;

        // console.log("the password data is",user);

          const user = this.authService.getLoggedInUser();
        console.log("the password data is",user);

        const dialogRef=this.dialog.open(ChangePasswordComponent,{
          
   width: '80%',
        maxWidth: '600px',
        
        disableClose: true,  
          data: { userId: user?.userid }      
      }   ); 
  }
}
