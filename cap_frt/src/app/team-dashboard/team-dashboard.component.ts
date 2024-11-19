import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { Employee } from './employee.model';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TeamService } from '../my-team/team.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavSidebarComponent, TopBarComponent],
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployees: Set<number> = new Set();  // Store selected employee ids
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  searchTerm = '';
  numberOfEmployees: number | null = null;
  location = '';

  constructor(
    private dashboardService: DashboardService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }


 

  loadEmployees() {
    this.dashboardService.getEmployees(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      [],
      this.location,
      this.numberOfEmployees || undefined
    ).subscribe(
      (data: any) => {
        // Mark employees who are already team members
        this.employees = data.content.map((emp: Employee) => ({
          ...emp,
          isTeamMember: this.teamService.isTeamMember(emp.employeeId)
        }));
        this.totalPages = data.totalPages;
      },
      error => console.error('Error loading employees', error)
    );
  }

  // Add selected employees to the team
  addToTeam() {
    console.log('Adding selected employees to the team', this.selectedEmployees);

    this.selectedEmployees.forEach(employeeId => {
      const employee = this.employees.find(emp => emp.employeeId === employeeId);
      if (employee && !employee.isTeamMember) {
        this.dashboardService.addToTeam(employeeId).subscribe(
          () => {
            console.log(`Employee ${employeeId} added to team`);
            if (this.teamService.addTeamMember(employee)) {
              employee.isTeamMember = true;
              this.selectedEmployees.delete(employeeId);
            }
          },
          error => console.error(`Error adding employee ${employeeId} to team`, error)
        );
      } else {
        console.warn(`Employee ${employeeId} is already a team member`);
        this.selectedEmployees.delete(employeeId);
      }
    });
  }

  search() {
    this.currentPage = 0;
    this.loadEmployees();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  toggleEmployeeSelection(employeeId: number) {
    if (this.selectedEmployees.has(employeeId)) {
      this.selectedEmployees.delete(employeeId);
    } else {
      this.selectedEmployees.add(employeeId);
    }
  }

  // // Add selected employees to the team
  // addToTeam() {
  //   console.log('Adding selected employees to the team', this.selectedEmployees);

  //   this.selectedEmployees.forEach(employeeId => {
  //     const employee = this.employees.find(emp => emp.employeeId === employeeId);
  //     if (employee) {
  //       this.teamService.addTeamMember(employee);  // Update local state of team
  //       this.dashboardService.addToTeam(employeeId).subscribe(
  //         () => {
  //           console.log(`Employee ${employeeId} added to team`);
  //           this.selectedEmployees.delete(employeeId);  // Clear selection
  //           // Optionally, reload employees to reflect team status changes
  //           this.loadEmployees();
  //         },
  //         error => console.error(`Error adding employee ${employeeId} to team`, error)
  //       );
  //     }
  //   });
  // }
}
