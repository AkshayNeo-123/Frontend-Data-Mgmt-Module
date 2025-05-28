import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-get-test',
  standalone:true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './get-test.component.html',
styleUrls: ['./get-test.component.css']
})
export class GetTestComponent {

}
