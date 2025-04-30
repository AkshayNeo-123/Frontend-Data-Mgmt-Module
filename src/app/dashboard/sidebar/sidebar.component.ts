import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastertableComponent } from '../mastertable/mastertable.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() sectionChange = new EventEmitter<string>();  // Output to notify parent

  // Method to emit the section change event
  emitSection(section: string) {
    this.sectionChange.emit(section);  // Emit the selected section
  }

  // Method to toggle the sidebar's open/close state
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
