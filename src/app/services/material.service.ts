import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model'; 

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private apiUrl = 'https://localhost:7030/api/Materials/GetMaterials';
  private addMaterialapi = 'https://localhost:7030/api/Materials/AddMaterials'; 
  private deleteMaterialapi = 'https://localhost:7030/api/Materials/'; 
  private updateMaterialApi = 'https://localhost:7030/api/Materials/UpdateMaterials';
private GetMvrMfr='https://localhost:7030/api/MaterialMaster/mvrmfr';
private GetStorageLocation='https://localhost:7030/api/MaterialMaster/storage';
private apifileUrl = 'https://localhost:7030/api/File/FileUpload';
  constructor(private http: HttpClient) { }

  // Method to fetch materials data
  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  addMaterial(material: Material): Observable<Material> {
    return this.http.post<Material>(this.addMaterialapi, material);
  }

  deleteMaterial(materialId: number): Observable<any> {
    const url = `https://localhost:7030/api/Materials/${materialId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  

   // Method to update a material
   updateMaterial(material: Material): Observable<Material> {
    return this.http.put<Material>(`${this.updateMaterialApi}/${material.materialId}`, material);
  }

  getMvrMfr(): Observable<any[]> {
    return this.http.get<any[]>(`${this.GetMvrMfr}`);
  }

  
  
  getStorageLocation(): Observable<any[]> {
    return this.http.get<any[]>(`${this.GetStorageLocation}`);
  }

  postFileMaterial(file: File): Observable<any> {
    const formData = new FormData();
    
    // Append the file as 'file' (binary data)
    formData.append('file', file, file.name);

    // Send the POST request with FormData
    return this.http.post<any>(this.apifileUrl, formData, {
      responseType: 'json', // Expect JSON response
    });
  }
}
