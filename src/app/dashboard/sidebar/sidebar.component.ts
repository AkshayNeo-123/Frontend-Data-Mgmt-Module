import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { CommonModule } from '@angular/common';
import { MastertableComponent } from '../mastertable/mastertable.component';
import { Menu } from '../../models/menu.model';
import { PermissionServiceService } from '../../services/permission-service.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  roleId: number = 0;
  allMenus: Menu[] = [];
  allowedMenus: Menu[] = [];
  @Input() isOpen: boolean = true;
  @Output() sectionChange = new EventEmitter<string>();  // Output to notify parent
  permissions: any[] = [];
  constructor(
    private roleService: RoleService,
    private permissionService: PermissionServiceService
  ) {}

  // Method to emit the section change event
  emitSection(section: string) {
    ///console.log(section,"lalal")
    this.sectionChange.emit(section);  // Emit the selected section
  }

  canView(menuName: string): boolean {
  return this.permissions.some(p => p.menuName === menuName && p.canView);
}

  ngOnInit() {
    const roleId = Number(localStorage.getItem('RoleId'));
    this.roleService.getRoleById(roleId).subscribe({
      next: (res) => {
        const permissions = res.rolePermissions;

        this.permissionService.setPermissions(permissions);

        const allowedMenuIds = permissions
          .filter((p: any) => p.canView)
          .map((p: any) => p.menuId);

        // Now get all menus and filter them
        this.roleService.getAllMenus().subscribe({
          next: (menus) => {
            this.allMenus = menus;
            console.log(this.allMenus)
            this.allowedMenus = this.allMenus.filter(menu =>
              allowedMenuIds.includes(menu.id)
            );
          }
        });
      }
      // next: (res) => {
      //   this.permissions = res.rolePermissions;
      //   // Optionally filter/show sidebar items based on this.permissions
      // },
      // error: () => {
      //   console.error('Failed to fetch role permissions');
      // }
    });
    // this.roleId = Number(localStorage.getItem('RoleId'));
  }

  // Method to toggle the sidebar's open/close state
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
