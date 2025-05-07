import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { GetmaterialsComponent } from '../getmaterials/getmaterials.component';
import { RecipyComponent } from '../recipy/recipy.component';
import { FooterComponent } from '../../footer/footer.component';
import { ProjectComponent } from '../project/project.component';
import { MastertableComponent } from '../mastertable/mastertable.component';
import { AllMainPolymersComponent } from '../MainPolymerData/all-main-polymers/all-main-polymers.component';
import { RouterOutlet } from '@angular/router';
import { ContactsComponent } from '../contacts/contacts.component';
import { ManageusersComponent } from '../manageusers/manageusers.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RolemasterComponent } from '../rolemaster/rolemaster.component';
import { GetAllAdditivesComponent } from '../get-all-additives/get-all-additives.component';
import { AddAdditiveComponent } from '../additiveData/addadditives/addadditives.component';
import { AddInjectionMoldingComponent } from '../add-injection-molding/add-injection-molding.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    RecipyComponent,
    GetmaterialsComponent,
    FooterComponent,
    ProjectComponent,
    MastertableComponent,
    ContactsComponent,
    AddInjectionMoldingComponent,
   
    GetAllAdditivesComponent,
    AllMainPolymersComponent,
    ManageusersComponent,
    RolemasterComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarOpen = true;
  selectedSection: string = 'dashboard';
  currentPage: number = 1;
  itemsPerPage: number = 3;

  // Static product data
  staticProducts: any[] = [
    {
      productName: 'Product A',
      comments: 'Sample comment A',
      projectId: 1001,
      createdBy: 'Alice',
      createdDate: new Date('2023-01-01'),
      modifiedDate: new Date('2023-01-10')
    },
    {
      productName: 'Product B',
      comments: 'Sample comment B',
      projectId: 1002,
      createdBy: 'Bob',
      createdDate: new Date('2023-01-02'),
      modifiedDate: new Date('2023-01-11')
    },
    {
      productName: 'Product C',
      comments: 'Sample comment C',
      projectId: 1003,
      createdBy: 'Charlie',
      createdDate: new Date('2023-01-03'),
      modifiedDate: new Date('2023-01-12')
    },
    {
      productName: 'Product D',
      comments: 'Sample comment D',
      projectId: 1004,
      createdBy: 'David',
      createdDate: new Date('2023-01-04'),
      modifiedDate: new Date('2023-01-13')
    },
    {
      productName: 'Product E',
      comments: 'Sample comment E',
      projectId: 1005,
      createdBy: 'Eve',
      createdDate: new Date('2023-01-05'),
      modifiedDate: new Date('2023-01-14')
    }
  ];

  get totalItems(): number {
    return this.staticProducts.length;
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.staticProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pageRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSectionChange(section: string) {
    this.selectedSection = section;
  }

  viewDetails(product: any) {
    console.log('Viewing details for product:', product);
    // Add modal or routing logic here later
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
}

