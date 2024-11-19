import { Employee } from "../team-dashboard/employee.model";


export interface EmployeeTimeZone {

    isSubmitted: boolean;
    employeeId: number;
    timeZone: string;
    workingHoursStart: string;
    workingHoursEnd: string;
  }