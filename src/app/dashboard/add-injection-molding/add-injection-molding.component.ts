import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-add-injection-molding',
  imports: [ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    // MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatNativeDateModule,
    RouterModule,
    CommonModule],
  templateUrl: './add-injection-molding.component.html',
  styleUrl: './add-injection-molding.component.css'
})
export class AddInjectionMoldingComponent {
injectionForm!: FormGroup;
projects: any[] = [];
filteredProjects: any[] = [];

constructor(private fb: FormBuilder,private projectservice:ProjectService) {
  this.injectionForm = this.fb.group({
    projectId: ['',Validators.required],
    parameterSet: [{value:'001', disabled: true}],
    recipeNumber: ['', Validators.required],
    repetition: ['0'],
    additive: [''],

    pretreatmentNone: [false],
    pretreatmentDryTest: [false],
    dryingTemperature: [''],
    dryingTime: [''],
    residualMoisture: [''],
    notMeasured: [false],
    processingMoisture: [''],

    plasticizingVolume: [''],
    decompressionVolume: [''],
    holdingPressure: [''],
    switchingPoint: [''],
    screwSpeed: [''],
    injectionSpeed: ['225'],
    injectionPressure: ['23'],

    temperatureZone: [''],
    meltTemperature: [''],
    nozzleTemperature: [''],
    mouldTemperature: ['']
  });

 

  
}

ngOnInit(): void {
  
  this.loadMaster();
  
  
  
}
repetitionCount = 0;

increaseRepetition() {
  this.repetitionCount++;
}

decreaseRepetition() {
  if (this.repetitionCount > 0) {
    this.repetitionCount--;
  }
}

// onSubmit(): void {
//   // if (this.injectionFormForm.valid) {
//   //   console.log('Form Data:', this.injectionFormForm.value);
//   //   // TODO: Send to API or process the data
//   // } else {
//   //   console.warn('Form is invalid');
//   //   this.injectionFormForm.markAllAsTouched();
//   // }
// }
onSubmit() {
throw new Error('Method not implemented.');
}
onCancel() {
throw new Error('Method not implemented.');
}


loadMaster(){
  this.projectservice.getAllProjects().subscribe({
    next: (data) => (this.projects = data),
    error: (err) => console.error('Error fetching project types:', err)
  });
  console.log(`ProjectData:${this.projects}`);
  this.filteredProjects = [...this.projects];
}

// filterProjects() {
//   const search = this.projectFilter.toLowerCase();
//   this.filteredProjects = this.projects.filter(p =>
//     p.projectNumber.toLowerCase().includes(search)
//   );
// }

}
