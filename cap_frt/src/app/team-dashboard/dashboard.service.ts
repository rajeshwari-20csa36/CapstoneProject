// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { TeamService } from '../my-team/team.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8081/api/employees';

  constructor(private http: HttpClient, private teamService: TeamService) {}

  // Get a list of employees with pagination and filters
  getEmployees(
    page: number,
    size: number,
    searchTerm?: string,
    skills?: string[],
    location?: string,
    numberOfEmployees?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (skills && skills.length > 0) params = params.set('skills', skills.join(','));
    if (location) params = params.set('location', location);
    if (numberOfEmployees) params = params.set('numberOfEmployees', numberOfEmployees.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  addToTeam(employeeId: number): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/${employeeId}/toggle-team`, {}).pipe(
      tap((updatedEmployee) => {
        // Only update if the employee isn't already a team member
        if (!this.teamService.isTeamMember(employeeId)) {
          updatedEmployee.isTeamMember = true;
        }
      })
    );
  }

  // Get unique skills from the backend
  getUniqueSkills(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/skills`);
  }

  // Get unique locations from the backend
  getUniqueLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/locations`);
  }
}
