import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { TopbarComponent } from './dashboard/topbar/topbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatTableModule,
    TopbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'data-management-ui';
}
