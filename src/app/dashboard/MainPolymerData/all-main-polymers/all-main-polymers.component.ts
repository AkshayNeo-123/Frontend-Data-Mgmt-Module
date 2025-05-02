import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MainPolymer } from '../../../models/contacts';
import { MainpolymerserviceService } from '../../../services/mainpolymerservice.service';
import { MatTableModule } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; 
// import { MatSort, MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { OnInit, ViewChild } from '@angular/core';
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../CommonTs/confirm-dialog.component';
import { AddAdditiveComponent } from '../../additiveData/addadditives/addadditives.component';
import { AddmainpolymerComponent } from '../addmainpolymer/addmainpolymer.component';


@Component({
  selector: 'app-all-main-polymers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],  templateUrl: './all-main-polymers.component.html',
  styles: './all-main-polymers.component.css'
})
export class AllMainPolymersComponent implements OnInit {

  // mainPolymers: MainPolymer[] = [];
  displayedColumns: string[] = ['polymerName','actions'];  
  dataSource=new MatTableDataSource<MainPolymer>([]); 

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mainPolymerService: MainpolymerserviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMainPolymers();
  }

  getAllMainPolymers() {
    this.mainPolymerService.getAllPolymers().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openMainPolymerDialog(mainPolymer?:MainPolymer) {
      console.log('Data passed to dialog:', mainPolymer);
        const dialogRef = this.dialog.open(AddmainpolymerComponent, {
          width: '80%',  
          maxWidth: '600px',
          disableClose: true,
          data: mainPolymer
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.toaster.success(' Added successfully');
  
            this.getAllMainPolymers();  
          }
        });
        
      }
  
      editMainPolymerData(mainPolymer: any) {
        const dialogRef = this.dialog.open(AddmainpolymerComponent, {
          width: '80%',
          maxWidth: '600px',
          disableClose: true,
          data: mainPolymer
        });
        console.log('Editing mainPolymer:', mainPolymer);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.toaster.success('Updated successfully');
  
            this.getAllMainPolymers(); 
          }
        });
      }
  
  
      deleteAdditivesData(polymerId: number) {
  
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '350px',
              data: {
                title: 'Confirm Deletion',
                message: 'Do you really want to delete this record?'
              }
            });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
              this.dataSource.data = this.dataSource.data.filter(polymer => polymer.id !== polymerId);
      
            this.mainPolymerService.deletePolymer(polymerId).subscribe(
              (response) => {
                console.log('polymer deleted successfully:', response);
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
      
}
