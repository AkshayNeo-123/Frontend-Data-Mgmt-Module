import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectService } from '../../services/project.service';
import { AddInjectionMoulding, UpdateInjectionMoulding } from '../../models/injection-molding';
import { InjectionMoldingService } from '../../services/injection-molding.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  InjectionId!: number;
   recipeId!: number;

  injectionForm!: FormGroup;
  projects: any[] = [];
  filteredProjects: any[] = [];
  parameterSetpreviousdata!:number;
  
  constructor(private snackBar: MatSnackBar,private fb: FormBuilder,private injectionservice:InjectionMoldingService,private toastr: ToastrService,private projectservice:ProjectService, private location: Location, private route:Router) {
    this.injectionForm = this.fb.group({
      projectId: ['',Validators.required],
      parameterSet: [{value:'', disabled: true}],
      recipeId: [{value:'', disabled: true}],
      repetition: [],
      additive: [''],
      reference:[false],
      notes:[''],
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
//     this.injectionForm = this.fb.group({
//   projectId: [[], Validators.required],
//   recipeId: [{value:'', disabled: true}],
//   parameterSet: [{value:'', disabled: true}],
//   notes: [''],
//   additive: ['', [Validators.maxLength(99)]],
//   repetitionCount: [0, [Validators.min(1)]],
//   reference: [false],
//   pretreatmentNone: [false],
//   pretreatmentDryTest: [false],
//   dryingTemperature: [null, [Validators.min(-100), Validators.max(300)]],
//   dryingTime: [null, [Validators.min(0), Validators.max(24)]],
//   residualMoisture: [null, [Validators.min(0), Validators.max(100)]],
//   processingMoisture: [null, [Validators.min(0), Validators.max(100)]],
//   notMeasured: [false],
//   plasticizingVolume: [null, [Validators.min(0), Validators.max(999.99)]],
//   decompressionVolume: [null, [Validators.min(0), Validators.max(999.99)]],
//   holdingPressure: [null, [Validators.min(0), Validators.max(200)]],
//   switchingPoint: [null, [Validators.min(0), Validators.max(500)]],
//   screwSpeed: [null, [Validators.min(0), Validators.max(999.99)]],
//   speedMms: [{ value: 0, disabled: true }],
//   injectionSpeed: [null, [Validators.min(0), Validators.max(500)]],
//   injectionPressure: [null, [Validators.min(0), Validators.max(999)]],
//   temperatureZone: [null, [Validators.min(-100), Validators.max(300)]],
//   meltTemperature: [null, [Validators.min(-100), Validators.max(300)]],
//   nozzleTemperature: [null, [Validators.min(-100), Validators.max(300)]],
//   mouldTemperature: [null, [Validators.min(-100), Validators.max(300)]],
// });

    this.route.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0);
    }
  });
  
   
  
    
  }
  
  ngOnInit(): void {
    this.InjectionId = history.state.injectionId;
this.recipeId = history.state.recipeId;
// this.compoundForm.get('recipeNumber')?.setValue(this.recipeId);
    
    this.loadMaster();
    this.repetitionCount = Number(this.injectionForm.get('repetition')?.value || 0);
    // this.injectionForm.get('parameterSet')?.setValue(this.parameterSetpreviousdata);
    
    this.injectionForm.get('screwSpeed')!.valueChanges.subscribe(value => {
      const converted = Number(value) * 1000; // Convert m/s to mm/s
      this.injectionForm.get('speedMms')!.setValue(converted, { emitEvent: false });
    });

    this.injectionservice.GetByIdInjection(this.InjectionId).subscribe({
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
          mouldTemperature:data.mouldTemperature,
          notes:data.notes


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
    if (this.injectionForm.invalid) {
    this.showValidationErrors();
    return;
  }
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
          this.injectionservice.UpdateInjection(this.InjectionId,newInjectionMolding).subscribe({
            next: (response) => {
              console.log('updated successfully', response);
              this.toastr.success('updated successfully');
              // this.injectionForm.reset();
              this.location.back();
              // this.route.navigate(['/comp-inject'],{
              // state:{id: this.recipeId}
              // })
              // this.route.navigate(['/comp-inject']);
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
  this.location.back();
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




showValidationErrors() {
  const errors: string[] = [];

  Object.keys(this.injectionForm.controls).forEach(controlName => {
    const control = this.injectionForm.get(controlName);
    if (control && control.invalid) {
      control.markAsTouched(); // to trigger errors in UI too
      const controlErrors = control.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          errors.push(this.getErrorMessage(controlName, errorKey));
        });
      }
    }
  });

  if (errors.length > 0) {
    const message = errors.join('\n');
    this.toastr.error(message,'Error',{
  timeOut:5000
         });
  }
}



getErrorMessage(controlName: string, errorKey: string): string {
  const labels: { [key: string]: string } = {
    projectId: 'Project ID',
    parameterSet: 'Parameter Set',
    recipeId: 'Recipe Number',
    repetition: 'Repetition',
    additive: 'Additive',
    reference: 'Reference',
    notes: 'Notes',
    pretreatmentNone: 'Pretreatment None',
    pretreatmentDryTest: 'Pretreatment Dry Test',
    dryingTemperature: 'Drying Temperature',
    dryingTime: 'Drying Time',
    residualMoisture: 'Residual Moisture',
    notMeasured: 'Not Measured',
    processingMoisture: 'Processing Moisture',
    plasticizingVolume: 'Plasticizing Volume',
    decompressionVolume: 'Decompression Volume',
    holdingPressure: 'Holding Pressure',
    switchingPoint: 'Switching Point',
    screwSpeed: 'Screw Speed',
    speedMms: 'Speed (mm/s)',
    injectionSpeed: 'Injection Speed',
    injectionPressure: 'Injection Pressure',
    temperatureZone: 'Temperature Zone',
    meltTemperature: 'Melt Temperature',
    nozzleTemperature: 'Nozzle Temperature',
    mouldTemperature: 'Mould Temperature'
  };

  const label = labels[controlName] || controlName;

  switch (errorKey) {
    case 'required': return `${label} is required.`;
    case 'maxlength': return `${label} exceeds maximum length.`;
    case 'min': return `${label} is below minimum allowed value.`;
    case 'max': return `${label} exceeds maximum allowed value.`;
    default: return `${label} is invalid.`;
  }
}

//   showValidationErrors() {
//     for (const controlName in this.injectionForm.controls) {
//       const control = this.injectionForm.get(controlName);
//       if (control && control.invalid) {
//         control.markAsTouched(); // Mark to trigger validation messages
//         const errorKeys = Object.keys(control.errors || {});
//         if (errorKeys.length > 0) {
//           const errorType = errorKeys[0];
//           const message = this.getErrorMessage(controlName, errorType);
//           this.toastr.error(message,'Error',{
//   timeOut:5000
//          });
//         // this.snackBar.open(message, 'Close', {
//         //   duration: 3000,
//         //   panelClass: ['snack-bar-error']
//         // });
//         break; // Show only one error at a time
//             }
//     }
//   }
// }


// getErrorMessage(controlName: string, errorType: string): string {
//   const fieldNames: { [key: string]: string } = {
//     projectId: 'Project ID',
//     recipeId: 'Recipe Number',
//     additive: 'Additive',
//     dryingTemperature: 'Drying Temperature',
//     // Add all your fields as needed
//   };

//   const fieldLabel = fieldNames[controlName] || controlName;

//   switch (errorType) {
//     case 'required':
//       return `${fieldLabel} is required.`;
//     case 'maxlength':
//       return `${fieldLabel} exceeds maximum length.`;
//     case 'min':
//       return `${fieldLabel} is below the allowed minimum.`;
//     case 'max':
//       return `${fieldLabel} exceeds the allowed maximum.`;
//     default:
//       return `${fieldLabel} is invalid.`;
//   }
// }




}
