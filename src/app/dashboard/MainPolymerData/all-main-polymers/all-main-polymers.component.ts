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
import { PermissionServiceService } from '../../../services/permission-service.service';
import { MatTooltipModule } from '@angular/material/tooltip';


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
    MatButtonModule,MatTooltipModule
  ],  templateUrl: './all-main-polymers.component.html',
  styleUrls: ['./all-main-polymers.component.css']
})
export class AllMainPolymersComponent implements OnInit {

  // mainPolymers: MainPolymer[] = [];
  displayedColumns: string[] = ['polymerName'];  
  dataSource=new MatTableDataSource<MainPolymer>([]); 

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mainPolymerService: MainpolymerserviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toaster: ToastrService,
    private permissionService: PermissionServiceService
  ) {}

  canAddMainPolymer = false;
  canEditMainPolymer = false;
  canDeleteMainPolymer = false;


  ngOnInit(): void {
    this.getAllMainPolymers();
      this.canAddMainPolymer = this.permissionService.hasPermission('Main Polymer', 'canCreate');
    this.canEditMainPolymer = this.permissionService.hasPermission('Main Polymer', 'canEdit');
    this.canDeleteMainPolymer = this.permissionService.hasPermission('Main Polymer', 'canDelete');
    if (this.canEditMainPolymer || this.canDeleteMainPolymer) {
    this.displayedColumns.push('actions');
  }
  }

  getAllMainPolymers() {
    this.mainPolymerService.getAllPolymers().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
     this.dataSource.filterPredicate = (data, filter: string) => {
      return data.polymerName.toLowerCase().includes(filter);
    };
  this.dataSource.filter=filterValue
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
            this.toaster.success(' Added successfully','Success');
  
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
            this.toaster.success('Updated successfully','Success');
  
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
              const userId=Number(localStorage.getItem('UserId'))
              this.mainPolymerService.deletePolymer(polymerId,userId).subscribe(
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
