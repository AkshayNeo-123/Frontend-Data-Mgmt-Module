import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { TopbarComponent } from './dashboard/topbar/topbar.component';
import { SidebarComponent } from "./dashboard/sidebar/sidebar.component";
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule,RouterOutlet, MatTableModule,TopbarComponent, SidebarComponent,FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone:true
})
export class AppComponent {
  title = 'data-management-ui';
  currentRoute: string = '';

    constructor(private router: Router,private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

    get isStartPage(): boolean {
    return this.currentRoute === '/';
  }
 
  isCurrentRoute(routes: string[]): boolean {
    return routes.includes(this.currentRoute);
  }
 
  get needSideBar(): boolean {
    return this.isCurrentRoute([ '/login','/']);
  }
  
 
 
  get showSidebar(): boolean {
    return !this.isStartPage && !this.needSideBar;
  }
 
  get showHeaderAndFooter(): boolean {
    return !this.isStartPage
  }
  get showBackButton(): boolean {
    return !this.isCurrentRoute(['/login','/']);
  }
 
}
