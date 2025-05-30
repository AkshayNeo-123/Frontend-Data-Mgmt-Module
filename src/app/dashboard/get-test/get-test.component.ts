import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router'; // ✅ added RouterModule + Router

import { AddTestComponent } from '../add-test/add-test.component';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-get-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    RouterModule, // ✅ added RouterModule for routerLink
  ],
  templateUrl: './get-test.component.html',
  styleUrls: ['./get-test.component.css'],
})
export class GetTestComponent implements OnInit {
  constructor(private toastr: ToastrService, private router: Router,private testService:TestService,private dialog:MatDialog) {} // ✅ injected Router
    
  testList: Test[] = [];
  

  displayedColumns: string[] = [
    'productName',
    'recipeNumber',
    'mainPolymer',
    'mechanical',
    'general',
    'temperature',
    'flammability',
    'electrical',
    'properties',
    'actions',
  ];

  dataSource = new MatTableDataSource([
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getdata();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }
  getdata(){
    this.testService.getAllTest().subscribe({
      next:(data:Test[])=>{
        this.testList=data;
        console.log(this.testList);
        

      },
      error: (err) => {
      console.error('Error fetching test data:', err);
    }
    })

  }



  
  goToAddPage() {
    this.router.navigate(['/add-test']);
  }

  editTest(row: any) {
    console.log('Edit:', row);
  }

  // deleteTest(name: string) {
  //   console.log('Delete:', name);
  // }

 deleteTest(id: any) {
  console.log('testId='+id);
  
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this Project?'
    }
  });
  
  const deletedBY = Number(localStorage.getItem('UserId'));
  
  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.testService.deleteTest(id, deletedBY).subscribe({
        next: (data: any) => {
          this.toastr.success('Deleted successfully', 'Success', {
            timeOut: 5000
          });
          // You might want to refresh the list here or remove the deleted item from data source
        },
        error: (err: any) => {
          console.error('Error:', err);
          this.toastr.error('Something went wrong!', 'Error', {
            timeOut: 5000
          });
        }
      });
    } else {
      this.toastr.info('Deletion cancelled','',{
        timeOut: 5000
      });
    }
  });
}


  
}
