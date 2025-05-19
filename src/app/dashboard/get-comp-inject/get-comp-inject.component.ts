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
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-comp-inject',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatTableModule,
    MatPaginator
  ],
  templateUrl: './get-comp-inject.component.html',
  styleUrls: ['./get-comp-inject.component.css']
})
export class GetCompInjectComponent implements OnInit {
  idOfRecipe!: number;
  displayedColumns: string[] = ['compoundingId', 'date', 'notes', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumnsData: string[] = ['id', 'parameterSet', 'dryingTime', 'actions'];

  dataSourceInjection = new MatTableDataSource<any>([])

  @ViewChild('paginatorCompounding') paginatorCompounding!: MatPaginator;
  @ViewChild('paginatorInjection') paginatorInjection!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private compoundingService: AddCompoundingService, private injectionService: InjectionMoldingService, private router: Router) { }

  ngOnInit(): void {
    this.idOfRecipe = history.state.id;
    // this.recipeId = history.state.id;

    console.log("Received recipeId:", this.idOfRecipe);
    this.fetchInjectionDataByRecipe();

    this.fetchCompoundingData();
  }

  //  ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginatorCompounding;
  //   this.dataSource.sort = this.sort;

  //   this.dataSourceInjection.paginator = this.paginatorInjection;
  //   this.dataSourceInjection.sort = this.sort;
  // }

  get hasCompoundingData(): boolean {
    return Array.isArray(this.dataSource.data) && this.dataSource.data.length > 0;
  }


  get hasInjectionData(): boolean {
    return Array.isArray(this.dataSourceInjection.data) && this.dataSourceInjection.data.length > 0;
  }
  fetchCompoundingData(): void {
    this.compoundingService.getCompoundingDataByRecipeId(this.idOfRecipe).subscribe({
      next: (data) => {
        console.log(this.idOfRecipe);
        this.dataSource.data = data;
        this.dataSource = new MatTableDataSource<any>(data);

        setTimeout(() => {
          this.dataSource.paginator = this.paginatorCompounding;
          this.dataSource.sort = this.sort;
        });
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
        console.log("Received data from Injection API:", JSON.stringify(data, null, 2));

        this.dataSourceInjection.data = data;
        this.dataSourceInjection.paginator = this.paginatorInjection;
        setTimeout(() => {
          this.dataSourceInjection.paginator = this.paginatorInjection;
          this.dataSourceInjection.sort = this.sort;
        });
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

  navigateToAddCompounding(): void {
    this.router.navigate(['/compounding'], {
      state: { id: this.idOfRecipe }
    });
  }


  navigateToUpdateCompounding(compoundingId: number | undefined): void {
    console.log('Clicked compoundingId:', compoundingId);
    if (compoundingId != null) {
      this.router.navigate(['/updatecompounding'], {
        state: {
          compoundingId: compoundingId,
          recipeId: this.idOfRecipe
        }
      });
    } else {
      console.error('compoundingId is undefined or null!');
    }
  }


}
