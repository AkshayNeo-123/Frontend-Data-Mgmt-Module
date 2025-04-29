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
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    MatDatepickerModule
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

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router:Router,
    private dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectName: [this.data.projectName, Validators.required],
      projectType: [this.data.projectType, Validators.required],
      area: [this.data.area, Validators.required],
      priority: [this.data.priority, Validators.required],
      project_Description: [this.data.project_Description, Validators.required],
      startDate: [new Date(this.data.startDate), Validators.required],
      endDate: [new Date(this.data.endDate), Validators.required]
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Updating project with ID:', this.data.projectId);
console.log('Form data:', this.projectForm.value);
      this.projectService.updateProject(this.data.projectId, this.projectForm.value).subscribe(() => {
        alert('Project updated successfully');
        this.projectService.triggerRefresh();
        this.dialogRef.close(true)// close dialog and return success
       
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}