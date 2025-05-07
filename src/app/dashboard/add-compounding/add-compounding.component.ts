import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-compounding',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
    MatRadioModule
  ],
  templateUrl: './add-compounding.component.html',
  styleUrls: ['./add-compounding.component.css']
})
export class AddCompoundingComponent {
  compoundForm: FormGroup;
  dynamicCols: string[] = ['T1', 'T2', 'T3']; // Dynamic columns
  componentOptions: string[] = ['Component A', 'Component B', 'Component C']; // Example options

  // Getter for components (FormArray)
  get components() {
    return (this.compoundForm.get('components') as FormArray).controls;
  }

  constructor(private fb: FormBuilder) {
    this.compoundForm = this.fb.group({
      compoundNumber: [''],
      parameterSet: [''],
      date: [''],
      note: [''],
      pretreatment: [''],
      temperature: [''],
      duration: [''],
      residualMoisture: [''],
      notMeasured: [false],
      speedFeeder1: [''],
      speedFeeder2: [''],
      screwStandard: [false], 
      screwModified: [false],
      degassingStandard: [false],
      degassingVacuum: [false],
      degassingNone: [false],
      degassingFET: [false],
      screwSpeed: [''],
      torque: [''],
      pressure: [''],
      totalOutput: [''],
      granulator: [''],
      bulkDensity: [''],
      coolingSection: [''],
      tempBath1: [''],
      tempBath2: [''],
      tempBath3: [''],
      meltPump: [''],
      underwaterPelletizer: [''] ,
      nozzlePlate:[''],
      productionNote:[''],
      premix:[false],
      PremixNote:[''],
      temp1: [100],
      temp2: [200],
      temp3: [200],
      temp4: [200],
      temp5: [200],
      temp6: [100],
      temp7: [200],
      temp8: [200],
      temp9: [230],
      temp10: [230],
      temp11: [230],
      temp12: [230],
      pretreatmentNone: [false],
      pretreatmentDrying: [false],
      components: this.fb.array([]) 
    });
    

    // Optionally add an initial component
    this.addComponent();
  }

  // Add a new component to the FormArray
  addComponent() {
    const componentGroup = this.fb.group({
      name: ['', Validators.required],
      share: ['', Validators.required],
      MF: [false],
      SecondF: [false],
      SF: [false],
    });

    // Add dynamic cols as controls
    this.dynamicCols.forEach((col: string) => {
      // Explicitly cast the form group to allow dynamic keys
      (componentGroup as any).addControl(col, this.fb.control(false));  // Add dynamic controls
    });

    // Push the componentGroup into the components FormArray
    (this.compoundForm.get('components') as FormArray).push(componentGroup);
  }

  // Remove a component at the given index
  removeComponent(index: number) {
    (this.compoundForm.get('components') as FormArray).removeAt(index);
  }

  // Calculate the total share
  getTotalShare(): number {
    return (this.compoundForm.get('components') as FormArray).value
      .reduce((acc: number, curr: any) => acc + (+curr.share || 0), 0);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file.name);
      // You can upload it or preview it here
    }
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


  onSubmit() {
    if (this.compoundForm.valid) {
      console.log('Form Submitted', this.compoundForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  
}
