import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  isSidebarOpen = true;
  activeMenu: string = '';

  constructor(private router: Router) {
    // Listen to navigation changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        if (
          url.includes('/recipe') ||
          url.includes('/comp-inject') ||
          url.includes('/compounding') ||
          url.includes('/injectionMolding') ||
          url.includes('/updatecompounding') ||
          url.includes('/updaetInjection')
        ) {
          this.activeMenu = 'recipe';
        } else {
          this.activeMenu = '';
        }
      });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
