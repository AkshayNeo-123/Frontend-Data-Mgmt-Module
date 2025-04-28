export interface Project {
    projectName: string;
    projectType: number;
    area: number;
    status: number;
    project_Description: string;
    startDate: string;       // ISO string (or Date if you want to parse it later)
    endDate: string;
    isDelete: number;
    createdBy: number;
    createdDate: string;
    modifiedBy: number | null;
    modifiedDate: string | null;
  }
  