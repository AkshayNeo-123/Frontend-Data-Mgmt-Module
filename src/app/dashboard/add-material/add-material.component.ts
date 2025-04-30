import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialService } from '../../services/material.service';
import { CommonService } from '../../services/common.service';
import { Material, MaterialTypeEnum, MvrMfrType, StorageLocation } from '../../models/material.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  manufacturers: any[] = [];

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMaterialComponent>,
    private materialService: MaterialService,
    private commonService: CommonService,
    private toastr: ToastrService,
    
    @Inject(MAT_DIALOG_DATA) public data: Material
  ) {
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

  get isEditMode(): boolean {
    return !!this.data;
  }

  ngOnInit(): void {
    this.commonService.getAdditives().subscribe({
      next: (res) => {
        this.additives = res;
      },
      error: (err) => console.error('Failed to load additives:', err)
    });

    this.commonService.getMainPolymers().subscribe({
      next: (res) => {
        this.mainPolymers = res;
      },
      error: (err) => console.error('Failed to load main polymers:', err)
    });

    this.commonService.getManufacture().subscribe({
      next: (res) => {
        this.manufacturers = res;
      },
      error: (err) => console.error('Failed to load manufacturers:', err)
    });
    

    if (this.isEditMode) {
      this.materialForm.patchValue({
        materialsType: this.data.materialsType,
        additiveId : this.data.additiveId,
        mainPolymerId:this.data.mainPolymerId,
        designation: this.data.designation,
        manufacturerId: this.data.manufacturerId,
        quantity: this.data.quantity,
        density: this.data.density,
        testMethod: this.data.testMethod,
        tdsFilePath: this.data.tdsFilePath,
        msdsFilePath: this.data.msdsFilePath,
        storageLocation: this.data.storageLocation,
        description: this.data.description,
        MVR_MFR: this.data.mvR_MFR
      });
    }
  }

  onSubmit() {
    if (this.materialForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
  
      if (!user) {
        console.error('No user found in localStorage!');
        this.toastr.error('User not found. Please log in again.', 'Error');
        return;
      }
  
      const newMaterial: Material = {
        ...this.materialForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
        modifiedBy: user.userId,
        modifiedDate: new Date().toISOString(),
        materialId: this.isEditMode ? this.data.materialId : 0
      };
  
      const request$ = this.isEditMode
        ? this.materialService.updateMaterial(newMaterial)
        : this.materialService.addMaterial(newMaterial);
  
      request$.subscribe({
        next: () => {
          this.toastr.success(
            this.isEditMode ? 'Material updated successfully!' : 'Material added successfully!',
            'Success'
          );
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error saving material:', err);
          this.toastr.error('Failed to save material. Please try again.', 'Error');
        }
      });
    }
  }
  

  onCancel() {
    this.dialogRef.close(false);
  }
}
