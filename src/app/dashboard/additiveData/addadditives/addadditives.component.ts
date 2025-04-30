import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { AddAdditives, Additives } from '../../../models/contacts';
import { Router } from '@angular/router';
import { AdditiveservicesService } from '../../../services/additiveservices.service';

@Component({
  selector: 'app-addadditives',
  standalone: true,

  imports: [CommonModule,FormsModule],
  templateUrl: './addadditives.component.html',
  styleUrl: './addadditives.component.css'
})
export class AddadditivesComponent {

  additive:AddAdditives={
    id:0,
   additiveName:' '
  //  createdDate:  new Date(Date.now()),
  //     createdBy:
  }
 successMessage='';
 errorMessage='';
   constructor(private additiveServices:AdditiveservicesService,private router:Router){}


   addAdditivesData(form:NgForm){
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.additiveServices.addAdditive(this.additive).subscribe({

      next:(response)=>{
        alert("Additive Added Successfully")
        this.router.navigate(['/contacts'])
        this.errorMessage = '';
        form.resetForm(); 
           },
           error: (error) => {
            this.errorMessage = 'Failed to add account.';
            console.error(error);
          }
  
      })
    }  

}