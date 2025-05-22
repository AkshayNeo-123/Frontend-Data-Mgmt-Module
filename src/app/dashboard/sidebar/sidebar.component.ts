import { MenuService } from './../../services/menu.service';
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
  navigation(route: string) {
    this.router.navigate([route]);
  }
  roleId: number = 0;
  allMenus: Menu[] = [];
  allowedMenus: Menu[] = [];
  @Input() isOpen: boolean = true;
  expandedMenus: Set<number> = new Set();
  isSidebarOpen = true;
  activeMenu: string = '';
  permissions: any[] = [];
  constructor(
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionServiceService,
    private menuService: MenuService
  ) {
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

  toggleExpand(id: number): void {
    if (this.expandedMenus.has(id)) {
      this.expandedMenus.delete(id);
    } else {
      this.expandedMenus.add(id);
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  canView(menuName: string): boolean {
    return this.permissions.some((p) => p.menuName === menuName && p.canView);
  }
  // ngOnInit() {
  //     const roleId = Number(localStorage.getItem('RoleId'));
  //     this.roleService.getRoleById(roleId).subscribe({
  //       next: (res) => {
  //         console.log(res)
  //         const permissions = res.rolePermissions;

  //         this.permissionService.setPermissions(permissions);

  //         const allowedMenuIds = permissions
  //           .filter((p: any) => p.canView)
  //           .map((p: any) => p.menuId);
  //           console.log('new',allowedMenuIds);

  //         this.menuService.getMenuForSideBar().subscribe({
  //           next: (menus) => {
  //             this.allMenus = menus;

  //             console.log('menus',this.allMenus)
  //             this.allowedMenus = this.allMenus.filter(menu =>
  //               allowedMenuIds.includes(menu.id),
  //               // allowedMenuIdschilds.includes(menus.children.)

  //             );
  //             console.log('hi',this.allowedMenus);

  //           }
  //         });
  //       }
  //     });
  //   }

  ngOnInit() {
    const roleId = Number(localStorage.getItem('RoleId'));
    this.roleService.getRoleById(roleId).subscribe({
      next: (res) => {
        console.log(res);
        const permissions = res.rolePermissions;

        this.permissionService.setPermissions(permissions);

        // Filter to get the allowed menu IDs
        const allowedMenuIds = permissions
          .filter((p: any) => p.canView)
          .map((p: any) => p.menuId);
        console.log('Allowed Menu IDs:', allowedMenuIds);

        // Get all menus for the sidebar
        this.menuService.getMenuForSideBar().subscribe({
          next: (menus) => {
            this.allMenus = menus;
            console.log('All Menus:', this.allMenus);

            // Filter the allowed menus based on the permissions
            this.allowedMenus = this.filterAllowedMenus(
              this.allMenus,
              allowedMenuIds
            );
            console.log('Filtered Allowed Menus:', this.allowedMenus);
          },
          error: (err) => {
            console.error('Error fetching menus:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching role permissions:', err);
      },
    });
  }

  /**
   * Recursive function to filter allowed menus and their children
   * @param menus - List of menus to filter
   * @param allowedMenuIds - List of allowed menu IDs
   * @returns Filtered list of menus with allowed child menus
   */
  filterAllowedMenus(menus: any[], allowedMenuIds: number[]): any[] {
    return menus
      .filter((menu) => {
        // Check if the current menu can be viewed based on the permissions
        const canView = allowedMenuIds.includes(menu.id);

        // Recursively filter children if they exist
        if (menu.children && menu.children.length > 0) {
          menu.children = this.filterAllowedMenus(
            menu.children,
            allowedMenuIds
          );
        }

        // Return the menu if it can be viewed or it has viewable children
        return canView || (menu.children && menu.children.length > 0);
      })
      .map((menu) => {
        // Return the menu with children (if any)
        return {
          ...menu,
          children: menu.children || [],
        };
      });
  }

  isActive(menu: Menu): boolean {
    const currentUrl = this.router.url;
    if (menu.route && currentUrl.includes(menu.route)) {
      return true;
    }

    if (menu.children) {
      return menu.children.some((child) => currentUrl.includes(child.route));
    }

    return false;
  }
}
