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
import * as XLSX from 'xlsx';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermissionServiceService } from '../../services/permission-service.service';


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
    MatTooltipModule

  ],
  
})
export class GetmaterialsComponent implements AfterViewInit, OnInit {
  downloadBaseUrl: string = 'https://localhost:7030/api/File/FileDownload?url=';
  displayedColumns: string[] = [
  'materialName', 'AdditiveId', 'MainPolymerId','manufacturerId', 'quantity',  'storageLocationId',
   'density','mvrMfrId',"testMethod",'tdsFilePath','msdsFilePath'
  ];
  canAddMaterial = false;
  canEditMaterial = false;
  canDeleteMaterial = false;
  dataSource = new MatTableDataSource<Material>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private materialService: MaterialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private permissionService: PermissionServiceService
  ) { }

  ngOnInit(): void {
    this.canAddMaterial = this.permissionService.hasPermission('Materials', 'canCreate');
    this.canEditMaterial = this.permissionService.hasPermission('Materials', 'canEdit');
    this.canDeleteMaterial = this.permissionService.hasPermission('Materials', 'canDelete');
    if (this.canEditMaterial || this.canDeleteMaterial) {
    this.displayedColumns.push('actions');
  }
    this.loadMaterials();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'AdditiveId':
          return item.additive?.additiveName?.toLowerCase() || '';
        case 'MainPolymerId':
            return item.mainPolymer?.polymerName?.toLowerCase() || '';
        default:
          return (item as any)[property];
      }
    };
    
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
     this.dataSource.filterPredicate = (data, filter: string) => {
      return data.materialName.toLowerCase().includes(filter); 
    };
   
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

  exportToExcel() {
    const worksheetData = this.dataSource.data.map((material: any) => ({
      // 'Material No.': material.materialId || '-',
      'Additive': material.additive?.additiveName || '-',
      'Main Polymer': material.mainPolymer?.polymerName || '-',
      'Name': material.materialName || '-',
      'Manufacturer': material.manufacturer?.contactName || '-',
      'Quantity [kg]': material.quantity || '-',
      'Storage Location': material.storageLocation?.name || '-',
      'Density [g/cm3]': material.density || '-',
      'MVR/MFR': material.mvrMfr?.name || '-',
      'Test Method': material.testMethod || '-',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Materials');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Materials.xlsx');
    this.toastr.success('Downloaded successfully.');
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
