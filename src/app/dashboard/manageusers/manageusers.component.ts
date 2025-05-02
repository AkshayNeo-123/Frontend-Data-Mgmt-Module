import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { Location } from '@angular/common';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';

@Component({
  selector: 'app-manageusers',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    ConfirmDialogComponent
  ],
  templateUrl: './manageusers.component.html',
  styleUrl: './manageusers.component.css'
})
export class ManageusersComponent implements OnInit {
  // displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'email', 'roleId', 'status', 'actions'];
  displayedColumns: string[] = ['userId', 'firstName', 'status', 'roleId', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private location: Location
    // private router: Router
    ) {}

  goToBack() {
    this.location.back();
    // this.router.navigate(['/dashboard']);
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '80%',
      maxWidth: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers(); // refreshing user list
      }
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
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

  editUser(user: any) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '80%',
      maxWidth: '800px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });    
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Do you really want to delete this user?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(user => user.userId !== id);
            alert('Deleted successfully!');
          },
          error: err => {
            console.error('Error deleting user:', err);
            alert('Failed to delete the user!');
          }
        });
      }
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getFormattedUserId(id: number): string {
    return 'PRO' + id.toString().padStart(3, '0');
  }

}
