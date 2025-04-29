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

@Component({
  selector: 'app-getmaterials',
  standalone: true,
  templateUrl: './getmaterials.component.html',
  styleUrls: ['./getmaterials.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ]
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
  'materialsType', 'designation', 'manufacturerId', 'quantity', 'density', 'testMethod', 'AdditiveId', 'MainPolymerId',
    'tdsFilePath', 'msdsFilePath', 'storageLocation', 'description', 'mvR_MFR', 'createdBy',
    'createdDate', "actions"
  ];
  dataSource = new MatTableDataSource<Material>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private materialService: MaterialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
    this.dataSource.filter = filterValue;
  }

  openAddMaterialDialog() {
    const dialogRef = this.dialog.open(AddMaterialComponent, {
      width: '80%',
      maxWidth: '800px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMaterials();
      }
    });
  }


  deleteMaterial(materialId: number) {
    if (materialId == null || materialId === undefined) {
      console.error('Invalid ID:', materialId);
      return;
    }
    this.dataSource.data = this.dataSource.data.filter(material => material.materialId !== materialId);

    console.log('Deleting Material with ID:', materialId);
    this.materialService.deleteMaterial(materialId).subscribe(
      (response) => {
        // this.loadMaterials();
        console.log('Material deleted successfully:', response);

      },
      (error) => {
        console.error('Error deleting material:', error);
      }
    );
  }



}
