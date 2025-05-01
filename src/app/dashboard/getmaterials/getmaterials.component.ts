import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Material, MaterialTypeEnum, MvrMfrType,StorageLocation } from '../../models/material.model';
import { MaterialService } from '../../services/material.service';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { nextTick } from 'process';


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideAnimations(), 
//     provideToastr(), 
//   ]
// });
@Component({
  selector: 'app-getmaterials',
  templateUrl: './getmaterials.component.html',
  styleUrls: ['./getmaterials.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    ConfirmDialogComponent
  ],
  
})
export class GetmaterialsComponent implements AfterViewInit, OnInit {

  getMaterialTypeName(type: MaterialTypeEnum): string {
    return MaterialTypeEnum[type];
  }


  getMvrMfrTypeName(type: MvrMfrType): string {
    return MvrMfrType[type];
  }

  getStorageLocationName(type:StorageLocation):string{
    return StorageLocation[type];
  }

  displayedColumns: string[] = [
    'materialId','AdditiveId', 'MainPolymerId', 'materialName','manufacturerId', 'quantity', 'storageLocation',  'density',
   'mvR_MFR',"testMethod","actions"
  ];
  dataSource = new MatTableDataSource<Material>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private materialService: MaterialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadMaterials();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMaterials() {
    this.materialService.getMaterials()
      .subscribe((data: Material[]) => {
        console.log('Loaded materials:', data);
        this.dataSource.data = data;
      }, error => {
        console.error('Error fetching materials:', error);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log("Filtering with value:", filterValue); 
  
    // Apply the filter to the dataSource
    this.dataSource.filter = filterValue;
  }
  
  

  openAddMaterialDialog(material?: Material) {
    const dialogRef = this.dialog.open(AddMaterialComponent, {
      width: '80%',
      maxWidth: '800px',
      disableClose: true,
      data: material 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMaterials();
      }
    });
  }

  deleteMaterial(materialId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Do you really want to delete this record?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.materialService.deleteMaterial(materialId).subscribe({
          next: (res: any) => {
            this.dataSource.data = this.dataSource.data.filter(material => material.materialId !== materialId);
            this.toastr.success('Deleted successfully.');
          },
          error: (err: any) => {
            console.error('Error:', err);
            this.toastr.error('Something went wrong!');
          }
        });
        
      } else {
        this.toastr.info('Deletion cancelled');
      }
    });
  }

}
