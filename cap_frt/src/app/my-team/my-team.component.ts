import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TeamService } from './team.service';
import { Employee } from '../team-dashboard/employee.model';


@Component({
  selector: 'app-my-team',
  standalone: true,
  imports: [CommonModule, NavSidebarComponent, TopBarComponent],
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {
  teamMembers: Employee[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    // Load team members from localStorage if they exist
    const storedMembers = localStorage.getItem('teamMembers');
    if (storedMembers) {
      this.teamMembers = JSON.parse(storedMembers);  // Load from localStorage
    } else {
      this.teamService.getTeamMembers().subscribe(members => {
        this.teamMembers = members;  // Fetch from backend
      });
    }
  }


  calculateTotalPages() {
    const itemsPerPage = 10;  
    this.totalPages = Math.ceil(this.teamMembers.length / itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
