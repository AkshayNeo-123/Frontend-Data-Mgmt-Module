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
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

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
  roleList: any[] = [];
  private roleService = inject(RoleService);
  displayedColumns: string[] = ['roleName', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      return data.roleName.toLowerCase().includes(filter);
    };
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

  // openAddRoleDialog() {
  //   const dialogRef = this.dialog.open(AddRoleDialogComponent, {
  //     width: '400px',
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.fetchRoles(); // Refresh roles list
  //     }
  //   });
  //   // console.log('Add Role clicked');
  //   //will update later
  // }

  

  openAddRoleDialog() {
    // this.dialog.open(AddRoleComponent);
    const dialogRef = this.dialog.open(AddRoleComponent, {
      height: '70%',
      width: '80%',
      maxWidth: '800px'
      });
    
      dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchRoles(); 
        }
      });
  }

  openEditRoleDialog(role: any): void {
    const dialogRef = this.dialog.open(EditRoleComponent, {
      height: '70%',
      width: '80%',
      maxWidth: '800px',
      data: role
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchRoles();
      }
    });
  }

  // getRoles(): void {
  //   this.roleService.getRoles().subscribe((roles) => {
  //     this.roleList = roles;
  //   });
  // }

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
