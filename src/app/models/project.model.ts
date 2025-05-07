export interface Project {
  projectId: number;
    projectName: string;
    areaId: number;
    status: number;
    priority:number;
    ProjectTypeId?:number;
    project_Description: string;
    startDate: string;      
    endDate: string;
    isDelete: number;
    createdBy: number;
    createdDate: string;
    modifiedBy: number | null;
    modifiedDate: string | null;
  }
  

  export interface AddPRoject {
    projectName: string;
    ProjectNumber:string;
    ProjectTypeId?:number;
    statusId:number;
    areaId?: number;
    priorityId?: number;
    projectDescription: string;
    startDate?: string; 
    endDate?: string;  // optional if not marked [Required] in backend
    createdBy: number;
  createdDate: string;
  }
  
  // Optionally, define the enums if used as enums in backend
 

  export interface UpdateProject {
    projectId: number;
    projectName: string;
    projectType: number;
    area: number;
    priority:number;
    project_Description: string;
    startDate: string;
    endDate: string;
  }
  