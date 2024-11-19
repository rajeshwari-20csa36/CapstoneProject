import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeTimeZone } from './team-timezone.interface';

@Injectable({
    providedIn: 'root'
  })
  export class TimesheetService {
    private apiUrl = 'http://localhost:8081/api/timezone';
  
    constructor(private http: HttpClient) { }
  
    saveEmployeeTimeZone(employeeTimeZone: EmployeeTimeZone): Observable<EmployeeTimeZone> {
      // Format the time strings before sending to backend
      const formattedData = {
          ...employeeTimeZone,
          workingHoursStart: this.formatTimeForBackend(employeeTimeZone.workingHoursStart),
          workingHoursEnd: this.formatTimeForBackend(employeeTimeZone.workingHoursEnd)
      };
      return this.http.post<EmployeeTimeZone>(this.apiUrl, formattedData);
  }
      
    submitEmployeeTimeZone(employeeTimeZone: EmployeeTimeZone): Observable<EmployeeTimeZone> {
      return this.http.post<EmployeeTimeZone>(this.apiUrl, employeeTimeZone);
    }
  
    updateEmployeeTimeZone(employeeId: number, employeeTimeZone: EmployeeTimeZone): Observable<EmployeeTimeZone> {
      const formattedData = {
          ...employeeTimeZone,
          workingHoursStart: this.formatTimeForBackend(employeeTimeZone.workingHoursStart),
          workingHoursEnd: this.formatTimeForBackend(employeeTimeZone.workingHoursEnd)
      };
      return this.http.put<EmployeeTimeZone>(`${this.apiUrl}/${employeeId}`, formattedData);
  }
  
  getEmployeeTimeZone(employeeId: number): Observable<EmployeeTimeZone> {
    return this.http.get<EmployeeTimeZone>(`${this.apiUrl}/${employeeId}`);
}

private formatTimeForBackend(time: string): string {
  // Ensure time is in HH:mm format
  return time.substring(0, 5);
}
  }