import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AddCompoundingService } from '../../services/add-compounding.service';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-get-comp-inject',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,MatInputModule, RouterModule, MatTableModule],
  templateUrl: './get-comp-inject.component.html',
  styleUrls: ['./get-comp-inject.component.css']
})
export class GetCompInjectComponent implements OnInit {
  recipeId!: number;
  compoundingData: any[] = [];
  displayedColumns: string[] = ['compoundingId', 'date', 'temperature', 'notes', 'pretreatment', 'notMeasured'];

  constructor(private compoundingService: AddCompoundingService) {}

  ngOnInit(): void {
    this.recipeId = history.state.id;
    console.log("Received recipeId:", this.recipeId);
    this.fetchCompoundingData();
  }

  fetchCompoundingData(): void {
    this.compoundingService.getCompoundingDataByRecipeId(this.recipeId).subscribe({
      next: (data) => {
        this.compoundingData = data;
        console.log('Compounding Data:', this.compoundingData);
      },
      error: (err) => {
        console.error('Failed to fetch compounding data', err);
      }
    });
  }
}
