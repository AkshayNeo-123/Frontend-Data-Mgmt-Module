import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
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
import { AddInjectionMoulding, UpdateInjectionMoulding } from '../../models/injection-molding';
import { InjectionMoldingService } from '../../services/injection-molding.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-injection-molding',
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
  templateUrl: './update-injection-molding.component.html',
  styleUrl: './update-injection-molding.component.css'
})
export class UpdateInjectionMoldingComponent {
  injectionForm!: FormGroup;
  projects: any[] = [];
  filteredProjects: any[] = [];
  parameterSetpreviousdata!:number;
  
  constructor(private fb: FormBuilder,private injectionservice:InjectionMoldingService,private toastr: ToastrService,private projectservice:ProjectService) {
    this.injectionForm = this.fb.group({
      projectId: ['',Validators.required],
      parameterSet: [{value:'', disabled: true}],
      recipeId: [{value:'', disabled: true}],
      repetition: [],
      additive: [''],
      reference:[false],
  
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
      speedMms: [{ value: 0, disabled: true }],
      injectionSpeed: [''],
      injectionPressure: [''],
  
      temperatureZone: [''],
      meltTemperature: [''],
      nozzleTemperature: [''],
      mouldTemperature: ['']
    });
  
   
  
    
  }
  
  ngOnInit(): void {
    
    this.loadMaster();
    this.repetitionCount = Number(this.injectionForm.get('repetition')?.value || 0);
    // this.injectionForm.get('parameterSet')?.setValue(this.parameterSetpreviousdata);
    
    this.injectionForm.get('screwSpeed')!.valueChanges.subscribe(value => {
      const converted = Number(value) * 1000; // Convert m/s to mm/s
      this.injectionForm.get('speedMms')!.setValue(converted, { emitEvent: false });
    });

    this.injectionservice.GetByIdInjection(10).subscribe({
      next: (data) => {
        console.log('API Response:', data);
        const projectArray = typeof data.projectId === 'string'
  ? (data.projectId as string).split(',').map((p: string) => p.trim())
  : data.projectId;
    
        // Directly use the array if it's already string[]
        this.injectionForm.patchValue({
          projectId: projectArray,
          parameterSet:data.parameterSet,
          recipeId:data.recipeId,
          repetition:data.repetition,
          additive:data.additive,
          reference:data.reference,
          pretreatmentNone:data.pretreatmentNone,
          pretreatmentDryTest:data.pretreatmentDryTest,
          dryingTemperature:data.dryingTemperature,
          dryingTime:data.dryingTime,
          residualMoisture:data.residualMoisture,
          notMeasured:data.notMeasured,
          processingMoisture:data.processingMoisture,
          plasticizingVolume:data.plasticizingVolume,
          decompressionVolume:data.decompressionVolume,
          holdingPressure:data.holdingPressure,
          switchingPoint:data.switchingPoint,
          screwSpeed:data.screwSpeed,
          injectionSpeed:data.injectionSpeed,
          injectionPressure:data.injectionPressure,
          temperatureZone:data.temperatureZone,
          meltTemperature:data.meltTemperature,
          nozzleTemperature:data.nozzleTemperature,
          mouldTemperature:data.mouldTemperature

        });
        this.repetitionCount = Number(this.injectionForm.get('repetition')?.value || 0);


    
      }
    });
    
    
    
  }
  repetitionCount = 0;
  
  increaseRepetition() {
    this.repetitionCount++;
    this.injectionForm.get('repetition')?.setValue(this.repetitionCount);
  }
  
  decreaseRepetition() {
    if (this.repetitionCount > 0) {
      this.repetitionCount--;
      this.injectionForm.get('repetition')?.setValue(this.repetitionCount);
    }
  }
  
  
  onSubmit() {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
  
    if (!user) {
      console.error('No user found in localStorage!');
      return;
    }
    const adduserId=localStorage.getItem('UserId');
    let formData = this.injectionForm.value;
    if (Array.isArray(formData.projectId)) {
      formData.projectId = formData.projectId.join(','); 
    }
  
    // Convert empty strings to null
    const cleanedData = this.convertEmptyToNull(formData);
  
    console.log('Cleaned Data:', cleanedData);
    const newInjectionMolding: UpdateInjectionMoulding = {
            ...cleanedData,
            recipeId: this.injectionForm.get('recipeId')?.value,
            parameterSet:this.injectionForm.get('parameterSet')?.value,

            modifiedBy:adduserId,
            
          };
          console.log(newInjectionMolding);
          this.injectionservice.UpdateInjection(10,newInjectionMolding).subscribe({
            next: (response) => {
              console.log('updated successfully', response);
              this.toastr.success('updated successfully');
              this.injectionForm.reset();
              // this.injectionservice.triggerRefresh();
              // this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error adding project:', error);
              this.toastr.error('Something went wrong?');
            }
          });
  
  }
  onCancel() {
  throw new Error('Method not implemented.');
  }
  
  
  convertEmptyToNull(obj: any): any {
    const result: any = {};
    for (let key in obj) {
      if (obj[key] === ''|| obj[key] === 0) {
        result[key] = null;
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively clean nested objects
        result[key] = this.convertEmptyToNull(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
  
  loadMaster(){
    this.projectservice.getAllProjects().subscribe({
      next: (data) => (this.projects = data),
      error: (err) => console.error('Error fetching project types:', err)
    });
    console.log(`ProjectData:${this.projects}`);
    this.filteredProjects = [...this.projects];
  
    this.injectionservice.getparemeterSet().subscribe({
      next: (data) => (data++,console.log('Received:', data),this.injectionForm.get('parameterSet')?.setValue(data)),
      error: (err) => console.error('Error fetching project types:', err)
    });
    console.log(this.parameterSetpreviousdata);
  
    this.parameterSetpreviousdata++;
    console.log(this.parameterSetpreviousdata);
    
    
  }

  blockNumbers(event: KeyboardEvent) {
  const charCode = event.key;
  if (/\d/.test(charCode)) {
    event.preventDefault(); // Block number input
  }
}

}
