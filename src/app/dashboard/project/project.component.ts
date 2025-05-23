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
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { PermissionServiceService } from '../../services/permission-service.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    RouterModule,
    MatTooltipModule
  ]
})
export class ProjectComponent implements OnInit {
  // area: string;

  // displayedColumns: string[] = ['area','projectName','projectNumber', 'projectType','Priority', 'status',  'startDate', 'endDate','actions'];
  displayedColumns: string[] = ['projectNumber','projectName','status'];
  canAddProject = false;
  canEditProject = false;
  canDeleteProject = false;
  dataSource = new MatTableDataSource<Project>([]); // Using your Project model

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private location: Location,
    private permissionService: PermissionServiceService
  ) {}


  ngOnInit() {
    this.canAddProject = this.permissionService.hasPermission('Project', 'canCreate');
    this.canEditProject = this.permissionService.hasPermission('Project', 'canEdit');
    this.canDeleteProject = this.permissionService.hasPermission('Project', 'canDelete');
    if (this.canEditProject || this.canDeleteProject) {
    this.displayedColumns.push('actions');
  }
    this.loadProjects();
    this.projectService.refreshProjects$.subscribe(() => {
      this.loadProjects();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (data, property) => {
      console.log('Status data structure:', data.status);
      switch (property) {
        case 'projectName':
          return data.projectName?.toLowerCase();
        case 'status':
          return data.status.status.toLowerCase();
        default:
          return (data as any)[property];
      }
    }
  }

  loadProjects() {
    this.projectService.getAllProjects()
      .subscribe((data: Project[]) => {
        console.log('Loaded projects:', data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
       

      }, error => {
        console.error('Error fetching materials:', error);
      });
  }
 
  


  openAddProjectDialog() {
      const dialogRef = this.dialog.open(AddprojectComponent, {
        width: '80%',  
        maxWidth: '800px',
        disableClose: true,
      });
    }
    editProject(project: any): void {
      const dialogRef = this.dialog.open(UpdateProjectComponent, {
        maxWidth: '800%',
        width: '800px',
        // maxHeight:'65vh',
        data: project
      });
    
    }
     
    

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // this.dataSource.filter = filterValue;
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  

  this.dataSource.filterPredicate = (data, filter: string) => {
    return data.projectName.toLowerCase().includes(filter); 
  };

  this.dataSource.filter = filterValue;  
  }


  deleteProject(id: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete this Project?'
        }
      });
      const deletedBY=Number(localStorage.getItem('UserId'));
    
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.projectService.deleteProject(id,deletedBY).subscribe({
            next: (res: any) => {
              this.dataSource.data = this.dataSource.data.filter(material => material.projectId !== id);
              this.toastr.success(' deleted successfully','success',{
                timeOut:5000
              });
            },
            error: (err: any) => {
              console.error('Error:', err);
              this.toastr.error('Something went wrong!','error',{
                timeOut:5000
              });
            }
          });
          
        } else {
          this.toastr.info('Deletion cancelled');
        }
      });
    }
onExport(): void {
  const exportData = this.dataSource.data.map((project: any) => ({
    'Project Number': project.projectNumber || '-',
    'Project Name': project.projectName || '-',
    'Status': project.status?.status || '-',
    'Area': project.areas?.area || '-',
    'Project Type': project.projectTypes?.projectTypeName || '-',
    'Priority': project.priorities?.priority || '-',
    'Start Date': project.startDate ? new Date(project.startDate).toLocaleDateString() : '-',
    'End Date': project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');

  XLSX.writeFile(workbook, 'Projects.xlsx');
}

    goBack(): void {
      this.location.back();
    }
  
}