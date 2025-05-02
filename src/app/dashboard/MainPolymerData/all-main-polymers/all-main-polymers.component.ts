import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MainPolymer } from '../../../models/contacts';
import { MainpolymerserviceService } from '../../../services/mainpolymerservice.service';
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator'; 
// import { MatSort, MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-all-main-polymers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './all-main-polymers.component.html',
  styleUrls: ['./all-main-polymers.component.css']
})
export class AllMainPolymersComponent implements OnInit {

  mainPolymers: MainPolymer[] = [];
  dataSource!: MatTableDataSource<MainPolymer>; // Set your data source
  displayedColumns: string[] = ['polymerName'];  // Columns to show

  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mainPolymerService: MainpolymerserviceService) {}

  ngOnInit(): void {
    this.getAllMainPolymers();
  }

  getAllMainPolymers() {
    this.mainPolymerService.getAllPolymers().subscribe((data) => {
      this.mainPolymers = data;
      this.dataSource = new MatTableDataSource(this.mainPolymers);
     
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
