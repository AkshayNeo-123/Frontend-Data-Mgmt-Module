import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { error } from 'console';

@Component({
  selector: 'app-manageusers',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule
  ],
  templateUrl: './manageusers.component.html',
  styleUrl: './manageusers.component.css'
})
export class ManageusersComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'roleId', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) =>{
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  ngAfterViewInit() {
    
  }

  openAddUserDialog() {
    console.log("Add User dialog clicked");
  }

  editUser(user: any) {
    console.log('Edit user:', user);
  }

  deleteUser(id: number) {
    if(confirm('Are you sure you want to delete this user?')){
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(user => user.userId !== id);
          alert('User deleted successfully!!');
        },
        error: err =>{
          console.error('Error deleting user:', err);
          alert('Failed to delete the user!!')
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
