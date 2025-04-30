export interface Project {
    projectName: string;
    projectType: number;
    area: number;
    status: number;
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
    projectType: ProjectType;
    area: Area;
    priority: Priority;
    project_Description: string;
    startDate: string; // use ISO string format (e.g., "2025-04-28T00:00:00Z")
    endDate?: string;  // optional if not marked [Required] in backend
  }
  
  // Optionally, define the enums if used as enums in backend
  export enum ProjectType {
    Internal = 0,
    Client = 1,
    Research = 2
  }
  
  export enum Area {
    Development = 0,
    Testing = 1,
    Deployment = 2
  }
  
  export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2
  }