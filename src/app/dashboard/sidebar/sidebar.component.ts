import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastertableComponent } from '../mastertable/mastertable.component';
import { Menu } from '../../models/menu.model';
import { PermissionServiceService } from '../../services/permission-service.service';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  roleId: number = 0;
  allMenus: Menu[] = [];
  allowedMenus: Menu[] = [];
  @Input() isOpen: boolean = true;
  isSidebarOpen = true;
  activeMenu: string = '';
  permissions: any[] = [];
  constructor(
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionServiceService
  ) {
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
  canView(menuName: string): boolean {
  return this.permissions.some(p => p.menuName === menuName && p.canView);
}
ngOnInit() {
    const roleId = Number(localStorage.getItem('RoleId'));
    this.roleService.getRoleById(roleId).subscribe({
      next: (res) => {
        console.log(res)
        const permissions = res.rolePermissions;

        this.permissionService.setPermissions(permissions);

        const allowedMenuIds = permissions
          .filter((p: any) => p.canView)
          .map((p: any) => p.menuId);

        this.roleService.getAllMenus().subscribe({
          next: (menus) => {
            this.allMenus = menus;
            
            console.log(this.allMenus)
            this.allowedMenus = this.allMenus.filter(menu =>
              allowedMenuIds.includes(menu.id)
              
            );
            console.log('hi',this.allowedMenus);
            
          
          }
        });
      }
    });
  }
}
