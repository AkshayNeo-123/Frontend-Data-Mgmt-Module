import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialService } from '../../services/material.service';
import { CommonService } from '../../services/common.service';
import { Material } from '../../models/material.model';
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
  suppliers: any[] = [];
  mvrMfrTypes: any[] = [];
  storageLocations: any[] = [];
  materials: Material[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMaterialComponent>,
    private materialService: MaterialService,
    private commonService: CommonService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Material
  ) {
    this.materialForm = this.fb.group({
      materialId: [0],
      materialName: ['', [Validators.required]],
      manufacturerId: [0, [this.nonZeroValidator]],
      additiveId: [0, [this.nonZeroValidator]],
      mainPolymerId: [0, [this.nonZeroValidator]],
      supplierId: [0, [this.nonZeroValidator]],
      density: [0],
      quantity: [0, [Validators.min(0), Validators.max(20)]],
      testMethod: [''],
      tdsFilePath: [''],
      msdsFilePath: [''],
      storageLocationId: [ ''],
      mvrMfrId: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe({
      next: (res) => {
        this.materials = res;

        if (!this.isEditMode) {
          this.materialForm.get('materialName')?.addValidators(this.materialNameUniqueValidator());
          this.materialForm.get('materialName')?.updateValueAndValidity();
        }
      },
      error: (err) => console.error('Materials load failed:', err)
    });

    this.commonService.getAdditives().subscribe({
      next: (res) => { this.additives = res; },
      error: (err) => console.error('Additives load failed:', err)
    });

    this.commonService.getMainPolymers().subscribe({
      next: (res) => { this.mainPolymers = res; },
      error: (err) => console.error('Polymers load failed:', err)
    });

    this.commonService.getManufacture().subscribe({
      next: (res) => { this.manufacturers = res; },
      error: (err) => console.error('Manufacturers load failed:', err)
    });

    this.commonService.getSupplier().subscribe({
      next: (res) => { this.suppliers = res; },
      error: (err) => console.error('Suppliers load failed:', err)
    });

    this.materialService.getMvrMfr().subscribe({
      next: (res) => { this.mvrMfrTypes = res; },
      error: (err) => console.error('MVR/MFR load failed:', err)
    });

    this.materialService.getStorageLocation().subscribe({
      next: (res) => { this.storageLocations = res; },
      error: (err) => console.error('Storage locations load failed:', err)
    });

    if (this.isEditMode) {
      this.materialForm.patchValue({
        materialId: this.data.materialId,
        materialName: this.data.materialName,
        additiveId: this.data.additiveId,
        mainPolymerId: this.data.mainPolymerId,
        manufacturerId: this.data.manufacturerId,
        supplierId: this.data.supplierId,
        density: this.data.density,
        quantity: this.data.quantity,
        testMethod: this.data.testMethod,
        tdsFilePath: this.data.tdsFilePath,
        msdsFilePath: this.data.msdsFilePath,
        storageLocationId: this.data.storageLocationId ?? '',
        mvrMfrId: this.data.mvrMfrId ?? '',
        description: this.data.description
      });
    }
  }

  get isEditMode(): boolean {
    return !!this.data;
  }

  nonZeroValidator(control: any) {
    return control.value && control.value !== 0 ? null : { nonZero: true };
  }

  materialNameUniqueValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || this.isEditMode) return null;
      const nameExists = this.materials.some(
        (mat) =>
          mat.materialName.trim().toLowerCase() === control.value.trim().toLowerCase()
      );
      return nameExists ? { nameNotUnique: true } : null;
    };
  }

  onSubmit() {
    if (!this.materialForm.valid) return;
    const adduserId=localStorage.getItem('UserId');

    const formValue = { ...this.materialForm.value };
    formValue.storageLocationId = formValue.storageLocationId === '' ? null : formValue.storageLocationId;
    formValue.mvrMfrId = formValue.mvrMfrId === '' ? null : formValue.mvrMfrId;

    const material: Material = {
      ...formValue,
      ...(this.isEditMode
        ? { modifiedBy: adduserId, modifiedDate: new Date().toISOString() }
        : { createdBy: adduserId, createdDate: new Date().toISOString(), modifiedDate: new Date().toISOString() }
      )
    };

    const request$ = this.isEditMode
      ? this.materialService.updateMaterial(material)
      : this.materialService.addMaterial(material);

    request$.subscribe({
      next: () => {
        this.toastr.success(this.isEditMode ? 'Updated successfully.' : 'Saved successfully.', 'Success', {
          timeOut: 5000
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Save error:', err);
        this.toastr.error('Something went wrong while saving material.', 'Error', {
          timeOut: 5000
        });
      }
    });
  }

  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
  
    if (file) {
      if (file.type !== 'application/pdf') {
        this.toastr.error('Only PDF files are allowed.', 'Invalid File', { timeOut: 3000 });
        input.value = '';
        return;
      }
  
      const currentFilePath = this.materialForm.get(controlName)?.value;
      if (currentFilePath) {
        this.materialService.updateMaterialFile(file, currentFilePath).subscribe({
          next: (res) => {
            const filePath = `${res.fileName}`;
            this.materialForm.get(controlName)?.setValue(filePath);  
          },
          error: (err) => {
            console.error('File upload failed:', err);
            this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          }
        });
      } else {
        this.materialService.postFileMaterial(file).subscribe({
          next: (res) => {
            const filePath = `${res.fileName}`;
            this.materialForm.get(controlName)?.setValue(filePath);
          },
          error: (err) => {
            console.error('File upload failed:', err);
            this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          }
        });
      }
    }
  }
  

  onCancel() {
    this.dialogRef.close(false);
  }
}
