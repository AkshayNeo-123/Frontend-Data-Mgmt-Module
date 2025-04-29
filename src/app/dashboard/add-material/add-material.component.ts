import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialService } from '../../services/material.service';
import { CommonService } from '../../services/common.service'; // Import the CommonService
import { Material, MaterialTypeEnum, MvrMfrType, StorageLocation } from '../../models/material.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class AddMaterialComponent implements OnInit {
  materialForm: FormGroup;

  additives: any[] = []; 
  mainPolymers: any[] = [];

  materialTypes = [
    { value: MaterialTypeEnum.RawMaterial, viewValue: 'Raw Material' },
    { value: MaterialTypeEnum.FinishedGood, viewValue: 'Finished Good' },
    { value: MaterialTypeEnum.PackagingMaterial, viewValue: 'Packaging Material' },
    { value: MaterialTypeEnum.Additive, viewValue: 'Additive' },
    { value: MaterialTypeEnum.Resin, viewValue: 'Resin' },
    { value: MaterialTypeEnum.Compound, viewValue: 'Compound' },
    { value: MaterialTypeEnum.Masterbatch, viewValue: 'Masterbatch' },
    { value: MaterialTypeEnum.Catalyst, viewValue: 'Catalyst' },
    { value: MaterialTypeEnum.Stabilizer, viewValue: 'Stabilizer' }
  ];

  mvrMfrTypes = [
    { value: MvrMfrType._190C_2_16kg, viewValue: '190 °C / 2.16 kg' },
    { value: MvrMfrType._190C_5kg, viewValue: '190 °C / 5 kg' },
    { value: MvrMfrType._200C_5kg, viewValue: '200 °C / 5 kg' },
    { value: MvrMfrType._220C_10kg, viewValue: '220 °C / 10 kg' },
    { value: MvrMfrType._230C_5kg, viewValue: '230 °C / 5 kg' }
  ];

  storageLocations = [
    { value: StorageLocation.Warehouse_A, viewValue: 'Warehouse A' },
    { value: StorageLocation.Warehouse_B, viewValue: 'Warehouse B' },
    { value: StorageLocation.ColdStorage, viewValue: 'Cold Storage' },
    { value: StorageLocation.ProductionArea, viewValue: 'Production Area' },
    { value: StorageLocation.QualityLab, viewValue: 'Quality Lab' },
    { value: StorageLocation.OutdoorYard, viewValue: 'Outdoor Yard' },
    { value: StorageLocation.Silo_1, viewValue: 'Silo 1' },
    { value: StorageLocation.Silo_2, viewValue: 'Silo 2' },
    { value: StorageLocation.HazardousStorage, viewValue: 'Hazardous Storage' }
  ];

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddMaterialComponent>);
  private materialService = inject(MaterialService);
  private commonService = inject(CommonService); // Inject CommonService

  constructor() {
    this.materialForm = this.fb.group({
      materialsType: [null, Validators.required],
      designation: ['', Validators.required],
      manufacturerId: [null, Validators.required],
      additiveId: [null, Validators.required],
      mainPolymerId: [null, Validators.required],
      quantity: [null, Validators.required],
      density: [null, Validators.required],
      testMethod: ['', Validators.required],
      tdsFilePath: ['', Validators.required],
      msdsFilePath: ['', Validators.required],
      storageLocation: [null, Validators.required],
      description: [''],
      MVR_MFR: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch additives from the API
    this.commonService.getAdditives().subscribe({
      next: (additives) => {
        this.additives = additives; // Store the additives for the dropdown
      },
      error: (err) => console.error('Error fetching additives:', err)
    });

       this.commonService.getMainPolymers().subscribe({
      next: (mainPolymers) => {
        this.mainPolymers = mainPolymers; // Store the main polymers for the dropdown
      },
      error: (err) => console.error('Error fetching main polymers:', err)
    });
  }

  onSubmit() {
    if (this.materialForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) return console.error('No user found in localStorage!');

      const newMaterial: Material = {
        ...this.materialForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
        modifiedBy: null,
        modifiedDate: null,
        materialId: 0
      };

      this.materialService.addMaterial(newMaterial).subscribe({
        next: (res) => this.dialogRef.close(true),
        error: (err) => console.error('Error adding material:', err)
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
