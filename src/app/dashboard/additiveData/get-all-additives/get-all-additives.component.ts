import { Component, OnInit } from '@angular/core';
import { Additives } from '../../../models/contacts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdditiveservicesService } from '../../../services/additiveservices.service';

@Component({
  selector: 'app-get-all-additives',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './get-all-additives.component.html',
  styleUrl: './get-all-additives.component.css'
})
export class GetAllAdditivesComponent implements OnInit {
   allAdditives:Additives[]=[];

   


   constructor(private getAllAdditivesService:AdditiveservicesService,private router:Router){}
  ngOnInit(): void {
    this.getAllAdditivesData()
  }
   
  getAllAdditivesData(){
    this.getAllAdditivesService.getAllAdditives().subscribe(data=>{
      this.allAdditives=data;
    })
  }


  navigateToAddAdditives(){
    this.router.navigate(['addadditives'])
  }

  
  // navigateToDeleteAdditive(id:number){
  //   this.
  // }
  




  deleteAdditivesData(id:number){
    if(confirm("Do you want to delete this Additives")){
    this.getAllAdditivesService.deleteAdditives(id).subscribe(()=>{
      this.allAdditives= this.allAdditives.filter(accounts => accounts.id !== id)
      alert("account deleted successfully")

    })
    
  }
  else  alert("Account not able to delete")
  }


  


 navigateToGetDetails(id: number) {
  this.getAllAdditivesService.getAdditiveId(id);
  this.router.navigate(['get-additivebyid',id]);
}


navigateToUpdateAdditives(id:number){
  this.getAllAdditivesService.getAdditiveId(id);
  this.router.navigate(['update-additives',id]);
}
}
