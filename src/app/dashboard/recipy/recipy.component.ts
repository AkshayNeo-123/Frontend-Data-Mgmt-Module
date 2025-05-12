import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddRecipyComponent } from './add-recipy/add-recipy.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-recipy',
  templateUrl: './recipy.component.html',
  styleUrls: ['./recipy.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class RecipyComponent implements OnInit {
  private readonly EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  recipyList: Recipe[] = [];

  displayedColumns: string[] = [
    'productName',
    'recipeNumber',
    'projectName',
    'additiveName',
    'polymerName',
    'composition',
    'compounding',
    'actions',
  ];

  dataSource: MatTableDataSource<Recipe> = new MatTableDataSource<Recipe>();

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        const enrichedData: Recipe[] = data.map((recipe) => ({
          ...recipe,
          // recipeNumber: recipe.receipeId,
          composition: 'Polymer A: 60%, Additive B: 30%, Color C: 10%',
        }));

        this.recipyList = data;
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => console.error('Error fetching recipes', err),
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddRecipyComponent, {
      width: '90%',
      maxWidth: '1000px',
      disableClose: true,
    });

    // dialogRef.afterClosed().subscribe(result => {
    // if (result) {
    //   this.ngOnInit();
    // }
    // });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.recipeService.getAllRecipes().subscribe((recipes) => {
          this.recipyList = recipes;
         
          this.recipyList.sort((a, b) => b.receipeId - a.receipeId);
          this.dataSource = new MatTableDataSource(this.recipyList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  editRecipe(recipe: Recipe): void {
    console.log('Edit recipe:', recipe);
  }

  // downloadCompoundingData(recipe: Recipe): void {
  //   if (!recipe) {
  //     console.error('No recipe provided for download.');
  //     return;
  //   }

  //   const compoundingData = [
  //     {
  //       'Product Name': recipe.productName || 'N/A',
  //       'Project Name': recipe.projectId || 'N/A',
  //       'Additive': recipe.additiveId || 'N/A',
  //       'Main Polymer': recipe.polymerName || 'N/A'
  //     }
  //   ];

  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(compoundingData);
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Compounding Data': worksheet },
  //     SheetNames: ['Compounding Data']
  //   };

  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
  //   FileSaver.saveAs(data, `Compounding_${recipe.productName || 'data'}.xlsx`);
  // }

  downloadCompoundingData(recipe: Recipe): void {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        ProductName: recipe.productName,
        RecipeNumber: recipe.receipeId,
        Additive: recipe.additiveId,
        Polymer: recipe.polymerName,
        Composition: recipe.composition,
      },
    ]);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, `${recipe.productName}_Compounding.xlsx`);
  }
}
