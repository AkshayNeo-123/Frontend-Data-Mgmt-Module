import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  isSidebarOpen = true;

  // toggleSidebar() {
  //   this.isOpen = !this.isOpen;
  // }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
