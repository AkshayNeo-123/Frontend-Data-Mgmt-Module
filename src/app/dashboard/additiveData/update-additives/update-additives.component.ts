import { Component } from '@angular/core';
import { Additives, UpdateAdditive } from '../../../models/contacts';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AdditiveservicesService } from '../../../additiveservices.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-additives',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './update-additives.component.html',
  styleUrl: './update-additives.component.css'
})
export class UpdateAdditivesComponent {

  additives:Additives={
    id:0,
    additiveName:' ',
    createdBy:1,
    createdDate:new Date(Date.now()),
    modifiedDate:  new Date(Date.now()),
       modifiedBy:1};


  additive:UpdateAdditive={
    id:0,
   additiveName:' ',
  //  modifiedDate:  new Date(Date.now()),
  //     modifiedBy:1
  }

  
 successMessage='';
 errorMessage='';
   constructor(private additiveServices:AdditiveservicesService,private router:Router,private route:ActivatedRoute ){}
   
   
  
    
   updateAdditivesData(form:NgForm){
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    this.additiveServices.updateAdditives(this.additive.id,this.additive).subscribe({
      next:(response)=>{
        alert("Additive Updated Successfully")
        this.router.navigate(['/contacts'])
        this.errorMessage = '';
        // form.resetForm(); 
           },
           error: (error) => {
            this.errorMessage = 'Failed to add account.';
            console.error(error);
          }
  
      })
    }  
  }


