import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from '../../models/project.model'; // Correct interface
import { ProjectService } from '../../services/project.service'; // Correct service
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddprojectComponent } from '../addproject/addproject.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UpdateProjectComponent } from '../update-project/update-project.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ]
})
export class ProjectComponent implements OnInit {

  displayedColumns: string[] = ['area','projectName', 'projectType','Priority', 'status',  'startDate', 'endDate','actions'];
  dataSource = new MatTableDataSource<Project>([]); // Using your Project model

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
// element: any;

  constructor(private projectService: ProjectService,private dialog: MatDialog,private toastr: ToastrService) {}


  ngOnInit() {
    this.loadProjects();
    this.projectService.refreshProjects$.subscribe(() => {
      this.loadProjects();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProjects() {
    this.projectService.getAllProjects()
      .subscribe((data: Project[]) => {
        console.log('Loaded materials:', data);
        this.dataSource.data = data;
      }, error => {
        console.error('Error fetching materials:', error);
      });
  }
 
  
  // UpdateProject(projectId: any) {
    
  //   }

  openAddProjectDialog() {
      const dialogRef = this.dialog.open(AddprojectComponent, {
        width: '800%',  
        maxWidth: '800px',
        disableClose: true,
      });
    }
    editProject(project: any): void {
      const dialogRef = this.dialog.open(UpdateProjectComponent, {
        maxWidth: '800%', 
        width: '800px',
        data: project
      });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result === true) {
      //     this.toastr.success('Project updated successfully!');
      //     this.projectService.triggerRefresh();
      //   }
      // });
    }
     
    

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          console.log(`Project with ID ${id} deleted successfully.`);
          // alert("deleted successfully");
          this.toastr.success('Project deleted successfully','success',{
            timeOut: 5000 
          });
          this.dataSource.data = this.dataSource.data.filter(project => project.projectId !== id);
  
          this.loadProjects();
        },  
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
    }
  }
  
}