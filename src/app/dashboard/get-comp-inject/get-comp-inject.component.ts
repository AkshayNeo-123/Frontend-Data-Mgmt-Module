import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AddCompoundingService } from '../../services/add-compounding.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InjectionMoldingService } from '../../services/injection-molding.service';

@Component({
  selector: 'app-get-comp-inject',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatTableModule
  ],
  templateUrl: './get-comp-inject.component.html',
  styleUrls: ['./get-comp-inject.component.css']
})
export class GetCompInjectComponent implements OnInit, AfterViewInit {
  idOfRecipe!: number;
  displayedColumns: string[] = [ 'date', 'notes', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
    displayedColumnsData: string[] = [ 'parameterSet', 'dryingTime', 'actions'];

  dataSourceInjection=new MatTableDataSource<any>([])

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private compoundingService: AddCompoundingService,private injectionService:InjectionMoldingService) {}

  ngOnInit(): void {
    this.idOfRecipe = history.state.id;
        // this.recipeId = history.state.id;

    console.log("Received recipeId:", this.idOfRecipe);
    this.fetchCompoundingData();
    this.fetchInjectionDataByRecipe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchCompoundingData(): void {
    this.compoundingService.getCompoundingDataByRecipeId(this.idOfRecipe).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Compounding Data:', this.dataSource.data);
      },
      error: (err) => {
        console.error('Failed to fetch compounding data', err);
      }
    });
  }

    fetchInjectionDataByRecipe(): void {
    this.injectionService.GetInjectionByRecipeId(this.idOfRecipe).subscribe({
      next: (data) => {
              console.log(this.idOfRecipe)

        this.dataSourceInjection.data = data;
        console.log('Compounding Data:', this.dataSourceInjection.data);
      },
      error: (err) => {
        console.error('Failed to fetch compounding data', err);
      }
    });
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
