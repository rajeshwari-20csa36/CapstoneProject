// team.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../team-dashboard/employee.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamMembersSubject = new BehaviorSubject<Employee[]>([]);
  teamMembers$: Observable<Employee[]> = this.teamMembersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTeamMembers() {
    const storedMembers = localStorage.getItem('teamMembers');
    if (storedMembers) {
      this.teamMembersSubject.next(JSON.parse(storedMembers));
    } else {
      this.http.get<Employee[]>('http://localhost:8081/api/employees/team').subscribe(members => {
        this.teamMembersSubject.next(members);
        localStorage.setItem('teamMembers', JSON.stringify(members));
      });
    }
    return this.teamMembers$;
  }

  // Check if employee is already a team member
  isTeamMember(employeeId: number): boolean {
    const currentMembers = this.teamMembersSubject.value;
    return currentMembers.some(member => member.employeeId === employeeId);
  }

  // Add a team member with duplicate check
  addTeamMember(employee: Employee): boolean {
    if (this.isTeamMember(employee.employeeId)) {
      console.warn(`Employee ${employee.name} is already a team member`);
      return false;
    }

    const currentMembers = this.teamMembersSubject.value;
    this.teamMembersSubject.next([...currentMembers, employee]);
    localStorage.setItem('teamMembers', JSON.stringify(this.teamMembersSubject.value));
    return true;
  }

  removeTeamMember(employeeId: number) {
    const currentMembers = this.teamMembersSubject.value.filter(emp => emp.employeeId !== employeeId);
    this.teamMembersSubject.next(currentMembers);
    localStorage.setItem('teamMembers', JSON.stringify(currentMembers));
  }
}