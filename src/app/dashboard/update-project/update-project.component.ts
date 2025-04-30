import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { Project, UpdateProject } from '../../models/project.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-update-project',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    CommonModule
    
    
  ],
  providers: [
    {
      provide: MomentDateAdapter,
      useFactory: () => new MomentDateAdapter('en'),
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'LL', // Example format
        },
        display: {
          dateInput: 'LL', // Example format
          monthYearLabel: 'MM YYYY', // Example format
          dateA11yLabel: 'LL', // Example format
        },
      },
    },
  ],
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit {
  projectForm!: FormGroup;

  projectTypes = [
    { value: 1, viewValue: 'Pre Development' },
    { value: 2, viewValue: 'Application Development' },
    { value: 3, viewValue: 'Service' }
  ];

  areas = [
    { value: 1, viewValue: 'Rotomolding' },
    { value: 2, viewValue: 'Injection Molding' },
    { value: 3, viewValue: 'Blow Molding' }
  ];

  priorities = [
    { value: 1, viewValue: 'Low' },
    { value: 2, viewValue: 'Medium' },
    { value: 3, viewValue: 'High' }
  ];
  status = [
    { value: 1, viewValue: 'Planed' },
    { value: 2, viewValue: 'ONGoing' },
    { value: 3, viewValue: 'Completed' }
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router:Router,
    private toastr: ToastrService,

    private dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectName: [this.data.projectName, Validators.required],
      projectType: [this.data.projectType, Validators.required],
      area: [this.data.area, Validators.required],
      priority: [this.data.priority, Validators.required],
      // status: ['', Validators.required],
      project_Description: [this.data.project_Description, Validators.required],
      startDate: [new Date(this.data.startDate), Validators.required],
      endDate: [new Date(this.data.endDate), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
  
      if (!user) {
        console.error('No user found in localStorage!');
        return;
      }
  
      const updatedProject: UpdateProject = {
        ...this.projectForm.value,
        modifiedBy: user.userId,
        modifiedDate: new Date().toISOString()
      };
  
      this.projectService.updateProject(this.data.projectId, updatedProject).subscribe({
        next: (response) => {
          console.log('Project updated successfully', response);
          this.toastr.success('Project updated successfully!');
          this.projectService.triggerRefresh();
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.toastr.error('Failed to update project!');
        }
      });
    } else {
      this.projectForm.markAllAsTouched(); 
    }
  }
  
  

  onCancel() {
    this.dialogRef.close(false);
  }
}