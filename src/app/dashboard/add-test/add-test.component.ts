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
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ],
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent {
  sharedForm: FormGroup;
  mechanicalForm: FormGroup;
  temperatureForm: FormGroup;
  flammabilityForm: FormGroup;
  generalForm:FormGroup;
electricalForm:FormGroup;
 propertiesForm:FormGroup;

 
  constructor(private _formBuilder: FormBuilder) {
    // Common fields shown outside stepper
    this.sharedForm = this._formBuilder.group({
      productName: [''],
      recipeNumber: [''],
      comment: [''],
    });

    this.mechanicalForm = this._formBuilder.group({
      tensileModulus_DAM: [''],
      tensileModulus_Conditioned: [''],
      tensileModulus_Conditioned_Mm_Min: [''],
      stressAtYield_DAM: [''],
      stressAtYield_Conditioned: [''],
      stressAtYield_Conditioned_Mm_Min: [''],
      strainAtYield_DAM: [''],
      strainAtYield_Conditioned: [''],
      strainAtYield_Conditioned_Mm_Min: [''],
      strainAtBreak_DAM: [''],
      strainAtBreak_Conditioned: [''],
      strainAtBreak_Conditioned_Mm_Min: [''],
      flexuralModulus_DAM: [''],
      flexuralModulus_Conditioned: [''],
      flexuralModulus_Conditioned_Mm_Min: [''],
      charpyNotchedImpact23:[''],
      charpyNotchedImpactMinus30:[''],
      flexuralStrength_DAM:[''],
      flexuralStrength_Conditioned:[''],
      flexuralStrength_Conditioned_Mm_Min:[''],
    flexuralStrainBreak_DAM:[''],
flexuralStrainBreak_Conditioned:[''],
charpyImpact_DAM:[''],
charpyImpact_Conditioned:[''],
izodNotchedImpact_DAM:[''],
izodNotchedImpact_Conditioned:[''],
shoreDHardness_DAM:[''],
shoreDHardness_Conditioned:['']

    });

    this.temperatureForm = this._formBuilder.group({
      heatDeflectionTemp: [''],
      deflectionTempUnderLoad: [''],
      meltingTemp: [''],
      linearExpansionParallel: [''],
      linearExpansionTransverse: [''],
      
    });

    this.flammabilityForm = this._formBuilder.group({
      burningRateWallThickness: [''],
      gwfi: [''],
      gwft: [''],
      burningRateThickness1: [''],
      burningRateThickness2: [''],
    })

    this.generalForm = this._formBuilder.group({
      density: [''],
      humidityAbsorption: [''],
      moldingShrinkageFlow: [''],
      moldingShrinkageTransverse: [''],
      mfr: [''],
      mvr:[''],
    })

     this. electricalForm= this._formBuilder.group({
      volumeResistivity1: [''],
      volumeResistivity2: [''],
      surfaceResistivity: [''],
      comparativeTracking: [''],
    
    })
 this.propertiesForm = this._formBuilder.group({
  sustainable: [false],
   impactModified: [false],
    flameRetardant: [false],
    heatStabilized130: [false],
    heatStabilized160: [false],
    heatStabilized230: [false],
    hydrolysisStabilized: [false],
    laserTransparent: [false],
    laserMarkable: [false],
    lowWarpage: [false],
    reducedDensity: [false],
    reducedMoisture: [false],
    electricallyNeutral: [false],
    uvStabilized: [false],
    surfaceModified: [false],
    adhesionModified: [false],
    tribologicalModified: [false],
    easyFlow: [false],
    nucleated: [false],
    processImproved: [false],
    fluidInjection: [false],
    recycledContent: [false],
    additiveManufacturing: [false]
});

    
  }

  onSubmit() {
    const combined = {
      ...this.sharedForm.value,
      ...this.mechanicalForm.value,
      ...this.temperatureForm.value,
      ...this.flammabilityForm.value,
      ...this.generalForm.value,
      ...this.propertiesForm.value
    };
    console.log('All form values:', combined);
  }

  onCancel() {
    this.sharedForm.reset();
    this.mechanicalForm.reset();
    this.temperatureForm.reset();
    this.flammabilityForm.reset();
    this.generalForm.reset();
    this.propertiesForm.reset();
  }
}
