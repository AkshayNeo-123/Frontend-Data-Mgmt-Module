import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';  // Import MatDialogRef to control the dialog close

@Component({
  selector: 'app-add-recipy',
  standalone: true,
  templateUrl: './add-recipy.component.html',
  styleUrls: ['./add-recipy.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogActions
  ]
})
export class AddRecipyComponent implements OnInit {
  recipeForm: FormGroup;

  additives: string[] = ['Additive A', 'Additive B', 'Additive C'];
  polymers: string[] = ['Polymer X', 'Polymer Y', 'Polymer Z'];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private dialogRef: MatDialogRef<AddRecipyComponent>  // Inject MatDialogRef to close the dialog
  ) {
    this.recipeForm = this.fb.group({
      productName: ['', Validators.required],
      comments: [''],
      projectName: [''],
      additiveName: ['', Validators.required],
      polymerName: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const newRecipe = this.recipeForm.value;
      this.recipeService.addRecipe(newRecipe).subscribe({
        next: () => {
          alert('Recipe added successfully!');
          this.dialogRef.close(true);  // Close the dialog on successful submission
        },
        error: (err) => {
          console.error('Error adding recipe', err);
          this.dialogRef.close(false); 
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();  
  }
}
