export interface Project {
  projectId: number;
    projectName: string;
    projectType: number;
    area: number;
    status: number;
    priority:number;
    project_Description: string;
    startDate: string;       // ISO string (or Date if you want to parse it later)
    endDate: string;
    isDelete: number;
    createdBy: number;
    createdDate: string;
    modifiedBy: number | null;
    modifiedDate: string | null;
  }
  

  export interface AddPRoject {
    projectName: string;
    projectType: number;
    area: number;
    priority: number;
    projectDescription: string;
    startDate: string; // use ISO string format (e.g., "2025-04-28T00:00:00Z")
    endDate?: string;  // optional if not marked [Required] in backend
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
  