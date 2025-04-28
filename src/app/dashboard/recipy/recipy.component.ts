import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recipy',
  templateUrl: './recipy.component.html',
  styleUrls: ['./recipy.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class RecipyComponent implements OnInit {
  recipyList: Recipe[] = [];
  displayedColumns: string[] = ['productName', 'comments', 'projectId']; 
  dataSource: MatTableDataSource<Recipe> = new MatTableDataSource<Recipe>();

  @ViewChild(MatSort) sort: MatSort | null = null; 
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null; 

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipyList = data;
        this.dataSource.data = data; 
        this.dataSource.sort = this.sort; 
        this.dataSource.paginator = this.paginator; 
      },
      error: (err: any) => console.error('Error fetching recipes', err)
    });
  }

  // Function for filtering the data
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset pagination to the first page when filtering
    }
  }
}
