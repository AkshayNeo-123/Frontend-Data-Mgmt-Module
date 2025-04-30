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
  