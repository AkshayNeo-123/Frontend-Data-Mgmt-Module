import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { RecipyComponent } from '../recipy/recipy.component'; 
import { GetmaterialsComponent } from '../getmaterials/getmaterials.component';

@Component({
  selector: 'app-dashboard',
  standalone: true, // ✅ Enable standalone
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    RecipyComponent,  // ✅ Make sure this is added so <app-recipy> works
    GetmaterialsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarOpen = true;
  selectedSection: string = 'dashboard'; 

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

 
  onSectionChange(section: string) {
    this.selectedSection = section;
  }
}
