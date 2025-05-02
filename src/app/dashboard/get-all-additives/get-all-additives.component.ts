import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Additives } from '../../models/contacts';
import { AdditiveservicesService } from '../../services/additiveservices.service';
import { AddAdditiveComponent } from '../additiveData/addadditives/addadditives.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';

@Component({
  selector: 'app-get-all-additives',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './get-all-additives.component.html',
  styleUrls: ['./get-all-additives.component.css']})
export class GetAllAdditivesComponent implements OnInit {
  displayedColumns: string[] = [
    'additiveName',
    'actions'
  ];
  dataSource = new MatTableDataSource<Additives>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private getAllAdditivesService: AdditiveservicesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toaster: ToastrService
    // private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllAdditivesData();
  }

  getAllAdditivesData() {
    this.getAllAdditivesService.getAllAdditives().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }





  openAddAdditiveDialog(additive?:Additives) {
    console.log('Data passed to dialog:', additive);
      const dialogRef = this.dialog.open(AddAdditiveComponent, {
        width: '80%',  
        maxWidth: '600px',
        disableClose: true,
        data: additive
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.toaster.success(' Added successfully');

          this.getAllAdditivesData();  
        }
      });
      
    }

    editAdditiveData(additive: any) {
      const dialogRef = this.dialog.open(AddAdditiveComponent, {
        width: '80%',
        maxWidth: '600px',
        disableClose: true,
        data: additive
      });
      console.log('Editing additives:', additive);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.toaster.success('Updated successfully');

          this.getAllAdditivesData(); 
        }
      });
    }


    deleteAdditivesData(additiveId: number) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
              title: 'Confirm Deletion',
              message: 'Do you really want to delete this record?'
            }
          });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
            this.dataSource.data = this.dataSource.data.filter(additive => additive.id !== additiveId);
    
          this.getAllAdditivesService.deleteAdditives(additiveId).subscribe(
            (response) => {
              console.log('Additive deleted successfully:', response);
              this.toaster.success(' deleted successfully');
            },
            (error) => {
              console.error('Error deleting additive:', error);
              this.toaster.error('Deletion cancelled');
            }
          );
        }
      });
    }
    
    
  // navigateToUpdateAdditives(id: number) {
  //   this.getAllAdditivesService.getAdditiveId(id);
  //   this.router.navigate(['update-additives', id]);
  // }
}
