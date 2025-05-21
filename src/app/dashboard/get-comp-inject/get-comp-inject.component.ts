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
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-comp-inject',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatTableModule,
    MatPaginator,
    MatIcon,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './get-comp-inject.component.html',
  styleUrls: ['./get-comp-inject.component.css']
})
export class GetCompInjectComponent implements OnInit {
searchByDate($event: MatDatepickerInputEvent<any,any>) {
  console.log($event)
throw new Error('Method not implemented.');
}
goBack() {
this.router.navigate(['/recipe']);
}
  idOfRecipe!: number;
  displayedColumns: string[] = ['compoundingId', 'date', 'notes', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumnsData: string[] = ['id', 'parameterSet', 'dryingTime', 'actions'];
selectedDate: Date | null = null;

  dataSourceInjection = new MatTableDataSource<any>([])

  @ViewChild('paginatorCompounding') paginatorCompounding!: MatPaginator;
  @ViewChild('paginatorInjection') paginatorInjection!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private toastr: ToastrService, private dialog: MatDialog, private compoundingService: AddCompoundingService, private injectionService: InjectionMoldingService, private router: Router, private injectionMoldingService: InjectionMoldingService) { }

  ngOnInit(): void {
    this.idOfRecipe = history.state.id;
    // this.recipeId = history.state.id;

    console.log("Received recipeId:", this.idOfRecipe);
    this.fetchInjectionDataByRecipe();

    this.fetchCompoundingData();
  }


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

          if (this.paginatorCompounding) {
            this.paginatorCompounding.firstPage();
          }
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
        console.log(this.idOfRecipe);
        console.log("Received data from Injection API:", JSON.stringify(data, null, 2));

        // Reset DataSource
        this.dataSourceInjection = new MatTableDataSource<any>(data);

        // Ensure paginator and sort are re-applied
        setTimeout(() => {
          this.dataSourceInjection.paginator = this.paginatorInjection;
          this.dataSourceInjection.sort = this.sort;

          if (this.paginatorInjection) {
            this.paginatorInjection.firstPage();
          }
        });

        console.log('Injection Data:', this.dataSourceInjection.data);
      },
      error: (err) => {
        console.error('Failed to fetch injection data', err);
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
  navigateToAddInjectionMOlding(): void {
    this.router.navigate(['/injectionMolding'], {
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

  deleteCompounding(compoundingId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Do you really want to delete this record?'
      }
    });

    const deletedBy = Number(localStorage.getItem('UserId'));

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.compoundingService.deleteCompoundingData(compoundingId, deletedBy).subscribe({
          next: () => {
            this.toastr.success('Deleted successfully.');
            this.fetchCompoundingData(); // Refresh data

            if (this.dataSource.data.length === 1) {
              this.dataSource.data = [];
            }
          },
          error: (err) => {
            console.error('Failed to delete compounding data', err);
            this.toastr.error('Failed to delete compounding data.');
          }
        });
      } else {
        this.toastr.info('Deletion cancelled.');
      }
    });
  }

  navigateToUpdateInjectionMolding(InjectionId: number | undefined): void {
    console.log('Clicked compoundingId:', InjectionId);
    if (InjectionId != null) {
      this.router.navigate(['/updaetInjection'], {
        state: {
          injectionId: InjectionId,
          recipeId: this.idOfRecipe
        }
      });
    } else {
      console.error('compoundingId is undefined or null!');
    }
  }

  deleteInjection(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this injection Molding?'
      }
    });
    const deletedBY = Number(localStorage.getItem('UserId'));

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.injectionMoldingService.deleteinjection(id, deletedBY).subscribe({
          next: (res: any) => {
            // this.dataSource.data = this.dataSource.data.filter(material => material.projectId !== id);
            this.toastr.success(' deleted successfully', 'success', {
              timeOut: 5000
            });
            //   this.router.navigate(['/comp-inject'],{
            // state:{id: this.idOfRecipe}
            //   })
            this.fetchInjectionDataByRecipe();
            if (this.dataSourceInjection.data.length === 1) {
              this.dataSourceInjection.data = [];
            }
          },
          error: (err: any) => {
            console.error('Error:', err);
            this.toastr.error('Something went wrong!', 'error', {
              timeOut: 5000
            });
          }
        });

      } else {
        this.toastr.info('Deletion cancelled');
      }
    });
  }

 formatDate(e: any) {
    console.log("hiiiiiiii");
    const d = new Date(e.target.value);
    d.setDate(d.getDate() + 1);
    const convertDate = d.toISOString().split('T')[0];
    console.log(convertDate);
    // this.compoundForm.get('date')?.setValue(convertDate, { onlySelf: true });
  }

onFilter(): void {
  console.log("helll")
  if (!this.selectedDate) {
    this.toastr.warning('Please select a date to filter.');
    return;
  }

  const formattedDate = this.formatDateForAPI(this.selectedDate);

  this.compoundingService.getCompoundingDataByRecipeId(this.idOfRecipe, formattedDate).subscribe({
    next: (data) => {
      this.dataSource.data = data;
      this.dataSource = new MatTableDataSource<any>(data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginatorCompounding;
        this.dataSource.sort = this.sort;
        this.paginatorCompounding?.firstPage();
      });
    },
    error: (err) => {
      console.error('Filter fetch failed:', err);
      this.toastr.error('Failed to fetch filtered data.');
    }
  });
}

resetFilter(): void {
  this.selectedDate = null;
  this.fetchCompoundingData(); 
}


formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); 
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}



}
