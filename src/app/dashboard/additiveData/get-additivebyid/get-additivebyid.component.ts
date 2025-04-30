import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Additives } from '../../../models/contacts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdditiveservicesService } from '../../../services/additiveservices.service';

@Component({
  selector: 'app-get-additivebyid',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './get-additivebyid.component.html',
  styleUrl: './get-additivebyid.component.css'
})
export class GetAdditivebyidComponent implements OnInit{

   additive:Additives={
      id:0,
      additiveName:' ',
      createdBy:1,
      createdDate:new Date(Date.now()),
      modifiedDate:  new Date(Date.now()),
         modifiedBy:1};
  
      
         constructor(private additiveServices:AdditiveservicesService,private router:Router,private route: ActivatedRoute){}

         ngOnInit(): void {
          const id = Number(this.route.snapshot.paramMap.get('id'));
          if (id) {
            this.getAdditivesById(id);
          }
        }

  getAdditivesById(id:number){
    this.additiveServices.getAdditivesById(id).subscribe((data) => {
      
       console.log('Contact fetched successfully', data);
         this.additive=data;
     },
     (error) => {
       console.error('Error fetching contact details:', error);
     }
   );
 }

}
