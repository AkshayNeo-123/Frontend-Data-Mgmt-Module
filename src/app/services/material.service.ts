import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model'; 
import { APP_CONSTANTS } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private apiUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Materials/GetMaterials`;
  private addMaterialapi = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Materials/AddMaterials`; 
  private deleteMaterialapi = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Materials`; 
  private updateMaterialApi = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Materials/UpdateMaterials`;
private GetMvrMfr=`${APP_CONSTANTS.apiUrls.loadApiUrl}/MaterialMaster/mvrmfr`;
private GetStorageLocation=`${APP_CONSTANTS.apiUrls.loadApiUrl}/MaterialMaster/storage`;
private apifileUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/File/FileUpload`;
  constructor(private http: HttpClient) { }

  // Method to fetch materials data
  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  addMaterial(material: Material): Observable<Material> {
    return this.http.post<Material>(this.addMaterialapi, material);
  }

  deleteMaterial(materialId: number): Observable<any> {
    const url = `${this.deleteMaterialapi}/${materialId}`;
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
        formData.append('file', file, file.name);
    return this.http.post<any>(this.apifileUrl, formData, {
      responseType: 'json', 
    });
  }

  updateMaterialFile(file: File, oldFilePath: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('oldFilePath', oldFilePath);  // Add the old file path
  
    return this.http.post<any>(`${APP_CONSTANTS.apiUrls.loadApiUrl}/File/FileUpdate`, formData);
  }
  
}
