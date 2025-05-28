import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
// export class AddTestComponent {
//   firstFormGroup: FormGroup;
//   secondFormGroup: FormGroup;

//   constructor(private _formBuilder: FormBuilder) {
//     this.firstFormGroup = this._formBuilder.group({
//       productName: ['', Validators.required],
//       recipeNumber: ['', Validators.required],
//     });

//     this.secondFormGroup = this._formBuilder.group({
//       mainPolymer: ['', Validators.required],
//     });
//   }

//   onSubmit() {
//     const data = {
//       ...this.firstFormGroup.value,
//       ...this.secondFormGroup.value,
//     };
//     console.log('Form Submitted:', data);
//   }

//   onCancel() {
//     this.firstFormGroup.reset();
//     // this.dialogRef.close();
//   }
// }
export class AddTestComponent {
  mechanicalForm: FormGroup;
  temperatureForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.mechanicalForm = this._formBuilder.group({
      productName: ['', Validators.required],
      recipeNumber: ['', Validators.required],
      comment: [''],
      tensileModulus: [''],
      stressAtYield: [''],
      flexuralModulus: [''],
      flexuralStrength: [''],
      strainAtYield: [''],
      strainAtBreak: [''],
      charpyNotchedImpact: [''],
      charpyUnnotchedImpact: [''],
      flexuralStrengthBreak: [''],
      charpyImpactStrength: [''],
      izodNotchedImpact: [''],
      shoreHardness: [''],
    });

    this.temperatureForm = this._formBuilder.group({
      heatDeflectionTemp: [''],
      deflectionTempUnderLoad: [''],
      meltingTemp: [''],
      linearExpansionParallel: [''],
      linearExpansionTransverse: [''],
    });
  }

  onSubmit() {
    const combined = {
      ...this.mechanicalForm.value,
      ...this.temperatureForm.value,
    };
    console.log('All form values:', combined);
  }

  onCancel() {
    this.mechanicalForm.reset();
    this.temperatureForm.reset();
  }
}
