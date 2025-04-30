import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mastertable',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './mastertable.component.html',
  styleUrls: ['./mastertable.component.css']
})
export class MastertableComponent implements AfterViewInit {

  displayedColumns: string[] = ['table', 'action'];

  masterTableData = new MatTableDataSource([
    {
      name: 'Contacts',
      action: () => this.gotoContacts()
    },
    {
      name: 'Additives',
      action: () => this.gotoAdditives()
    },
    {
      name: 'Main Polymers',
      action: () => this.gotoMainPolymers()
    }
  ]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.masterTableData.sort = this.sort;
    this.masterTableData.paginator = this.paginator;
  }

  gotoContacts() {
    this.router.navigate(['/dashboard/contacts']);
  }

  gotoAdditives() {
    this.router.navigate(['/dashboard/get-all-additives']);
  }

  gotoMainPolymers() {
    this.router.navigate(['/dashboard/MainPolymer/all-main-polymers']);
  }
}
