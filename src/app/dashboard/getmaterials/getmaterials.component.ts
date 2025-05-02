import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Material } from '../../models/material.model';
import { MaterialService } from '../../services/material.service';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { saveAs } from 'file-saver'; 
import { HttpClient } from '@angular/common/http';


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
    ConfirmDialogComponent,

  ],
  
})
export class GetmaterialsComponent implements AfterViewInit, OnInit {
  downloadBaseUrl: string = 'https://localhost:7030/api/File/FileDownload?url=';


  displayedColumns: string[] = [
   'materialId','AdditiveId', 'MainPolymerId', 'materialName','manufacturerId', 'quantity',  'storageLocationId',
   'density','mvrMfrId',"testMethod",'tdsFilePath','msdsFilePath',"actions"
  ];
  dataSource = new MatTableDataSource<Material>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  
 downloadFile(filePath: string): void {
    const apiUrl = `${this.downloadBaseUrl}${encodeURIComponent(filePath)}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        // Extract the file name from the URL, you can adjust this logic based on your file name structure
        const filename = filePath.split('/').pop() || 'downloaded-file';
        saveAs(blob, filename);  // Trigger the download
      },
      error: (error: any) => {
        console.error('Error downloading file:', error);
        alert('There was an error downloading the file.');
      },
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
