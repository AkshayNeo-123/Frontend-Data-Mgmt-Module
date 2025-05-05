import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { inject } from '@angular/core';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-rolemaster',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule
  ],
  templateUrl: './rolemaster.component.html',
  styleUrl: './rolemaster.component.css'
})
export class RolemasterComponent implements OnInit {
  private roleService = inject(RoleService);
  displayedColumns: string[] = ['roleName', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddRoleDialog() {
    console.log('Add Role clicked');
    //will update later
  }

  editRole(role: any) {
    console.log('Edit Role:', role);
  }

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(r => r.roleId !== id);
          alert('Role deleted successfully!');
        },
        error: err => {
          console.error('Error deleting role:', err);
          alert('Failed to delete role!');
        }
      });
    }
  }
}
