import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestService } from '../../services/test.service';
import { Router } from '@angular/router';
import { RecipeDataforTest } from '../../models/test';
import { MatOption } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

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
    MatCheckboxModule,
    MatOption,
    MatSelectModule,
  ],
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent {
  sharedForm: FormGroup;
  mechanicalForm: FormGroup;
  temperatureForm: FormGroup;
  flammabilityForm: FormGroup;
  generalForm: FormGroup;
  electricalForm: FormGroup;
  propertiesForm: FormGroup;
  recipeData: RecipeDataforTest[] = [];
  

  constructor(private _formBuilder: FormBuilder,
    private testService: TestService,
 private router: Router 
  ) {
    // Common fields shown outside stepper
    this.sharedForm = this._formBuilder.group({
      productName: [''],
      recipeNumber: [{ value: '', disabled: true }],
      comment: [''],
    });

    this.mechanicalForm = this._formBuilder.group({
      tensileModulus_DAM: [null],
      tensileModulus_Conditioned: [null],
      tensileModulus_Conditioned_Mm_Min: [null],
      stressAtYield_DAM: [null],
      stressAtYield_Conditioned: [null],
      stressAtYield_Conditioned_Mm_Min: [null],
      strainAtYield_DAM: [null],
      strainAtYield_Conditioned: [null],
      strainAtYield_Conditioned_Mm_Min: [null],
      strainAtBreak_DAM: [null],
      strainAtBreak_Conditioned: [null],
      strainAtBreak_Conditioned_Mm_Min: [null],
      flexuralModulus_DAM: [null],
      flexuralModulus_Conditioned: [null],
      flexuralModulus_Conditioned_Mm_Min: [null],
      charpyNotchedImpact23: [null],
      charpyNotchedImpactMinus30: [null],
      flexuralStrength_DAM: [null],
      flexuralStrength_Conditioned: [null],
      flexuralStrength_Conditioned_Mm_Min: [null],
      flexuralStrainBreak_DAM: [null],
      flexuralStrainBreak_Conditioned: [null],
      charpyImpact_DAM: [null],
      charpyImpact_Conditioned: [null],
      izodNotchedImpact_DAM: [null],
      izodNotchedImpact_Conditioned: [null],
      shoreDHardness_DAM: [null],
      shoreDHardness_Conditioned: [null]
    });


    this.temperatureForm = this._formBuilder.group({
      tempHdtA: [null],
      tempHdtB: [null],
      meltingTemp: [null],
      coefficientsParallel: [null],
      coefficientsTransverse: [null],

    });

    this.flammabilityForm = this._formBuilder.group({
      burningRateWallThickness: [null],
      gwfi: [null],
      gwft: [null],
      burningRateThickness1: [null],
      burningRateThickness2: [null],
    })

    this.generalForm = this._formBuilder.group({
      density: [null],
      humidityAbsorption: [null],
      moldingShrinkageFlow: [null],
      moldingShrinkageTransverse: [null],
      mfr: [null],
      mvr: [null],
    });

    this.electricalForm = this._formBuilder.group({
      volumeResistivity1: [null],
      volumeResistivity2: [null],
      surfaceResistivity: [null],
      comparativeTracking: [null],
    });

    this.propertiesForm = this._formBuilder.group({
      sustainable: [false],
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
  

  ngOnInit(): void {
    this.loadRecipeData();
  
}



  onSubmit() {
    const requestBody = {
      // ...this.sharedForm.value,
      test: this.sharedForm.value,
      mechanicalProperty: this.mechanicalForm.value,
      temperatureProperty: this.temperatureForm.value,
      flammabilityProperty: this.flammabilityForm.value,
      generalProperty: this.generalForm.value,
      electricalProperty: this.electricalForm.value,
      properties: this.propertiesForm.value
    };

    console.log('Request Body:', requestBody);

    // Optional: Submit to API
    this.testService.addTest(requestBody).subscribe(
      response => {
        console.log('Form submitted successfully:', response);
      },
      error => {
        console.error('Error submitting form:', error);
      }
    );
  }
  loadRecipeData(){
    this.testService.getRecipeDataForTest().subscribe({
      next:(data:RecipeDataforTest[])=>{
        this.recipeData=data;
        console.log(this.recipeData);
        
      },
        error: (err) => {
        console.error('Error fetching recipe data:', err);
      }
    })
  }

onRecipeSelect(event: any) {
  const selectedRecipe = this.recipeData.find(r => r.receipeId === event.value);
  if (selectedRecipe) {
    this.sharedForm.patchValue({
      recipeNumber: selectedRecipe.receipeId
    });
  }
}

  onCancel() {
    this.sharedForm.reset();
    this.mechanicalForm.reset();
    this.temperatureForm.reset();
    this.flammabilityForm.reset();
    this.generalForm.reset();
    this.propertiesForm.reset();

      this.router.navigate(['/gettest']); 

  }

  
}