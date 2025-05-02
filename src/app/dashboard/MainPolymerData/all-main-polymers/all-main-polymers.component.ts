import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MainPolymer } from '../../../models/contacts';
import { MainpolymerserviceService } from '../../../services/mainpolymerservice.service';
import { MatTableModule } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; 
// import { MatSort, MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { OnInit, ViewChild } from '@angular/core';
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-all-main-polymers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],  templateUrl: './all-main-polymers.component.html',
  styleUrls: ['./all-main-polymers.component.css']
})
export class AllMainPolymersComponent implements OnInit {

  // mainPolymers: MainPolymer[] = [];
  displayedColumns: string[] = ['polymerName','actions'];  
  dataSource=new MatTableDataSource<MainPolymer>([]); 

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mainPolymerService: MainpolymerserviceService) {}

  ngOnInit(): void {
    this.getAllMainPolymers();
  }

  getAllMainPolymers() {
    this.mainPolymerService.getAllPolymers().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
