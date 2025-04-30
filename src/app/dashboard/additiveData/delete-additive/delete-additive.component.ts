import { Component } from '@angular/core';
import { Additives } from '../../../models/contacts';
import { AdditiveservicesService } from '../../../additiveservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-additive',
  standalone: true,

  imports: [],
  templateUrl: './delete-additive.component.html',
  styleUrl: './delete-additive.component.css'
})
export class DeleteAdditiveComponent {


  additives:Additives[]=[];

  constructor(private additiveServices:AdditiveservicesService,private router:Router){}


  deleteAdditivesData(id:number){
    if(confirm("Do you want to delete this Additives")){
    this.additiveServices.deleteAdditives(id).subscribe(()=>{
      this.additives= this.additives.filter(accounts => accounts.id !== id)
      alert("account deleted successfully")

    })
    
  }
  else  alert("Account not able to delete")
  }
}
