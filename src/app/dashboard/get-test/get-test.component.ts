import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router'; // ✅ added RouterModule + Router

import { AddTestComponent } from '../add-test/add-test.component';

@Component({
  selector: 'app-get-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    RouterModule, // ✅ added RouterModule for routerLink
  ],
  templateUrl: './get-test.component.html',
  styleUrls: ['./get-test.component.css'],
})
export class GetTestComponent implements OnInit {
  constructor(private dialog: MatDialog, private router: Router) {} // ✅ injected Router

  canAddMaterial = true;

  displayedColumns: string[] = [
    'productName',
    'recipeNumber',
    'mainPolymer',
    'mechanical',
    'general',
    'temperature',
    'flammability',
    'electrical',
    'properties',
    'actions',
  ];

  dataSource = new MatTableDataSource([
    {
      productName: 'PRO0132',
      recipeNumber: '001',
      mainPolymer: 'PP-H',
      mechanical: false,
      general: false,
      temperature: false,
      flammability: false,
      electrical: false,
      properties: false,
    },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }


  
  goToAddPage() {
    this.router.navigate(['/add-test']);
  }

  editTest(row: any) {
    console.log('Edit:', row);
  }

  deleteTest(name: string) {
    console.log('Delete:', name);
  }

  toggleCheckbox(row: any, property: string) {
    row[property] = !row[property];
    console.log(`Updated ${property} for ${row.productName}:`, row[property]);
  }
}
