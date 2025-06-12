import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { RecipeAndProject } from '../../models/recipe.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { FooterComponent } from '../../footer/footer.component';
import { GetmaterialsComponent } from '../getmaterials/getmaterials.component';
import { RecipyComponent } from '../recipy/recipy.component';
import { ProjectComponent } from '../project/project.component';
import { MastertableComponent } from '../mastertable/mastertable.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { ManageusersComponent } from '../manageusers/manageusers.component';
import { RolemasterComponent } from '../rolemaster/rolemaster.component';
import { AllMainPolymersComponent } from '../MainPolymerData/all-main-polymers/all-main-polymers.component';
import { AddInjectionMoldingComponent } from '../add-injection-molding/add-injection-molding.component';
import { AddCompoundingComponent } from '../add-compounding/add-compounding.component';
import { UpdateInjectionMoldingComponent } from '../update-injection-molding/update-injection-molding.component';
import { UpdateCompoundingComponent } from '../update-compounding/update-compounding.component';
import { GetAllAdditivesComponent } from '../get-all-additives/get-all-additives.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    GetmaterialsComponent,
    RecipyComponent,
    ProjectComponent,
    MastertableComponent,
    ContactsComponent,
    GetAllAdditivesComponent,
    AllMainPolymersComponent,
    ManageusersComponent,
    RolemasterComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatMomentDateModule,
    RouterModule,
    AddCompoundingComponent,
    UpdateInjectionMoldingComponent,
    UpdateCompoundingComponent,
    AddInjectionMoldingComponent,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = true;
  selectedSection: string = 'dashboard';

  recipyAndProject: RecipeAndProject[] = [];
  projectFilter: string = '';
  count = 0;
  paginatedRecipes: RecipeAndProject[] = [];
  pageSize = 6;
  currentPage = 1;
  totalPages = 0;

  tensileMin: number | undefined;
  tensileMax: number | undefined;
  charpyMin: number | undefined;
  charpyMax: number | undefined;
  stressMin: number | undefined;
  stressMax: number | undefined;

  tensileTouched = false;
  charpyTouched = false;
  stressTouched = false;
  loading:boolean=true;

  displayedColumns: string[] = ['recipeId', 'productName', 'projectNumber', 'description'];
  dataSource: MatTableDataSource<RecipeAndProject> = new MatTableDataSource<RecipeAndProject>();

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.tensileMin = 0;
  this.tensileMax = 1000;
  this.charpyMin = 0;
  this.charpyMax = 1000;
  this.stressMin = 0;
  this.stressMax = 1000;
    this.updateTrack();
    this.updateCharpyTrack();
    this.updateStressTrack();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRecipes(): void {
    this.recipeService.getRecipeAndProject().subscribe({
      next: (data) => {
        this.recipyAndProject = data;
        this.count = data.length;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.updatePaginatedRecipes();
        this.loading=false;
      },
      error: (err) => {
        console.error('Error fetching recipes', err)
        this.loading=false;
      }
    });
  }

  updatePaginatedRecipes(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRecipes = this.recipyAndProject.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRecipes();
    }
  }

  applyCustomFilter(): void {
    const tensileMin = this.tensileTouched ? this.tensileMin : undefined;
    const tensileMax = this.tensileTouched ? this.tensileMax : undefined;
    const charpyMin = this.charpyTouched ? this.charpyMin : undefined;
    const charpyMax = this.charpyTouched ? this.charpyMax : undefined;
    const stressMin = this.stressTouched ? this.stressMin : undefined;
    const stressMax = this.stressTouched ? this.stressMax : undefined;

    this.recipeService.getRecipeAndProject(
      this.projectFilter,
      tensileMax, tensileMin,
      charpyMax, charpyMin,
      stressMax, stressMin
    ).subscribe({
      next: (data) => {
        this.recipyAndProject = data;
        this.count = data.length;
        this.currentPage = 1;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.updatePaginatedRecipes();
      },
      error: (err) => console.error('Error filtering recipes', err)
    });
  }

  // Slider change handlers
  onTensileChange(): void {
    this.tensileTouched = true;
    this.updateTrack();
  }

  onCharpyChange(): void {
    this.charpyTouched = true;
    this.updateCharpyTrack();
  }

  onStressChange(): void {
    this.stressTouched = true;
    this.updateStressTrack();
  }

  // Track UI styles
  trackStyle = {};
  charpyTrackStyle: any = {};
  stressTrackStyle: any = {};

  updateTrack(): void {
    if (this.tensileMin !== undefined && this.tensileMax !== undefined && this.tensileMin > this.tensileMax) {
      [this.tensileMin, this.tensileMax] = [this.tensileMax, this.tensileMin];
    }
    const min = this.tensileMin ?? 0;
    const max = this.tensileMax ?? 1000;
    const minPercent = (min / 1000) * 100;
    const maxPercent = (max / 1000) * 100;
    this.trackStyle = {
      left: `${minPercent}%`,
      width: `${maxPercent - minPercent}%`,
      backgroundColor: '#b1d536'
    };
  }

  updateCharpyTrack(): void {
    if (this.charpyMin !== undefined && this.charpyMax !== undefined && this.charpyMin > this.charpyMax) {
      [this.charpyMin, this.charpyMax] = [this.charpyMax, this.charpyMin];
    }
    const min = this.charpyMin ?? 0;
    const max = this.charpyMax ?? 1000;
    const minPercent = (min / 1000) * 100;
    const maxPercent = (max / 1000) * 100;
    this.charpyTrackStyle = {
      left: `${minPercent}%`,
      width: `${maxPercent - minPercent}%`,
      backgroundColor: '#b1d536'
    };
  }

  updateStressTrack(): void {
    if (this.stressMin !== undefined && this.stressMax !== undefined && this.stressMin > this.stressMax) {
      [this.stressMin, this.stressMax] = [this.stressMax, this.stressMin];
    }
    const min = this.stressMin ?? 0;
    const max = this.stressMax ?? 1000;
    const minPercent = (min / 1000) * 100;
    const maxPercent = (max / 1000) * 100;
    this.stressTrackStyle = {
      left: `${minPercent}%`,
      width: `${maxPercent - minPercent}%`,
      backgroundColor: '#b1d536'
    };
  }

  resetFilter(): void {
    this.projectFilter = '';
    this.tensileMin = 0;
    this.tensileMax = 1000;
    this.charpyMin = 0;
    this.charpyMax = 1000;
    this.stressMin = 0;
    this.stressMax = 1000;
    this.tensileTouched = false;
    this.charpyTouched = false;
    this.stressTouched = false;
    this.currentPage = 1;

    this.updateTrack();
    this.updateCharpyTrack();
    this.updateStressTrack();
    this.loadRecipes();
  }

  onToggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSectionChange(section: string): void {
    this.selectedSection = section;
  }

  
     gotoDetailsPage(recipeId:number){
      console.log('clicked' ,recipeId)
         if (recipeId != null) {
    this.router.navigate(['/recipedetails'],{
      state:{id: recipeId}
    });
  } else {
    console.error('recipeId is undefined or null!');
  }

     }

  goToRecipeDetails(recipeId: number): void {
    if (recipeId != null && recipeId > 0) {
      this.router.navigate(['/recipedetails'], {
        state: { id: recipeId }
      });
    } else {
      console.error('recipeId is undefined or invalid!');
    }
  }
}
