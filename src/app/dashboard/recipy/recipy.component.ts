// src/app/components/recipy/recipy.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recipy',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './recipy.component.html',
  styleUrls: ['./recipy.component.css']
})
export class RecipyComponent implements OnInit {
  recipyList: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => (this.recipyList = data),
      error: (err: any) => console.error('Error fetching recipes', err)
    });
  }
}
