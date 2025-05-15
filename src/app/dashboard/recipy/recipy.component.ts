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
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  private readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

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

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private recipeService: RecipeService,  private dialog: MatDialog,
    private router: Router,
    private toastr:ToastrService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipyList = data.map((recipe) => ({
          ...recipe,
          composition: 'Polymer A: 60%, Additive B: 30%, Color C: 10%', // placeholder
        }));
        this.dataSource = new MatTableDataSource(this.recipyList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error fetching recipes', err),
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadRecipes();
      }
    });
  }

  editRecipe(recipe: Recipe): void {
    const dialogRef = this.dialog.open(AddRecipyComponent, {
      width: '90%',
      maxWidth: '1000px',
      disableClose: true,
      data: { recipe }, // pass recipe for edit
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadRecipes();
      }
    });
  }

    
     
  

  
  deleteContactsDetails(recipeId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
               width: '350px',
               data: {
                 title: 'Confirm Deletion',
                 message: 'Do you really want to delete this record?'
               }
             });
         
         dialogRef.afterClosed().subscribe(result => {
           if (result === true) {
       this.dataSource.data = this.dataSource.data.filter(recipe => recipe.receipeId !== recipeId);
 
       console.log('Deleting Contact with ID:', recipeId);
       const userId=Number(localStorage.getItem('UserId'))
       this.recipeService.deleteRecipes(recipeId,userId).subscribe(
         (response) => {
           console.log('Contact deleted successfully:', response);
           this.toastr.success('deleted successfully');
         },
         (error) => {
           console.error('Error deleting contact:', error);
           this.toastr.error('Failed to delete contact');
         }
       );
     }
   });
 }


                          




  downloadCompoundingData(recipe: Recipe): void {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        ProductName: recipe.productName,
        RecipeNumber: recipe.receipeId,
        Additive: recipe.additiveName,
        Polymer: recipe.polymerName,
        Composition: recipe.composition,
      },
    ]);

    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, `${recipe.productName}_Compounding.xlsx`);
  }
}
