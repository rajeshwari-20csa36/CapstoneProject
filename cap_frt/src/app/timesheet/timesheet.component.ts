import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { EmployeeTimeZone } from './team-timezone.interface';
import { TimesheetService } from './timesheet.service';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, NavSidebarComponent, TopBarComponent],
  templateUrl: './timesheet.component.html'
})
export class TimesheetComponent implements OnInit {
  employeeTimeZone: EmployeeTimeZone = {
      employeeId: 0,
      timeZone: '',
      workingHoursStart: '',
      workingHoursEnd: '',
      isSubmitted: false
  };


  timeZones: string[] = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Europe/London',
    'Europe/Paris',
    'Australia/Sydney'
  ];

  isSubmitted = false;
  isSaved = false;
  message = '';

  constructor(private timesheetService: TimesheetService) {}

  ngOnInit(): void {
    const savedEmployeeId = localStorage.getItem('currentEmployeeId');
    if (savedEmployeeId) {
        this.timesheetService.getEmployeeTimeZone(Number(savedEmployeeId))
            .subscribe({
                next: (data) => {
                    // Format the received time strings for input fields
                    this.employeeTimeZone = {
                        ...data,
                        workingHoursStart: this.formatTimeForInput(data.workingHoursStart),
                        workingHoursEnd: this.formatTimeForInput(data.workingHoursEnd)
                    };
                    this.isSaved = true;
                },
                error: (error) => {
                    console.error('Error fetching employee timezone:', error);
                    this.message = 'Error fetching timezone data';
                }
            });
    }
  }
  onSave(): void {
    if (!this.employeeTimeZone.employeeId) {
        this.message = 'Please enter an Employee ID';
        return;
    }

    this.timesheetService.saveEmployeeTimeZone(this.employeeTimeZone)
        .subscribe({
            next: (response) => {
                this.message = 'Time zone settings saved successfully!';
                this.isSaved = true;
                localStorage.setItem('currentEmployeeId', response.employeeId.toString());
            },
            error: (error) => {
                this.message = 'Error saving time zone settings: ' + 
                    (error.error?.message || 'Unknown error occurred');
                console.error('Error:', error);
            }
        });
}

  onSubmit(): void {
    this.isSubmitted = true;
    this.message = 'Time zone settings submitted successfully!';
  }

  onUpdate(): void {
    if (!this.employeeTimeZone.employeeId) {
        this.message = 'Error: No employee ID found for update';
        return;
    }

    this.timesheetService.updateEmployeeTimeZone(
        this.employeeTimeZone.employeeId, 
        this.employeeTimeZone
    ).subscribe({
        next: () => {
            this.message = 'Time zone settings updated successfully!';
        },
        error: (error) => {
            this.message = 'Error updating time zone settings: ' + 
                (error.error?.message || 'Unknown error occurred');
            console.error('Error:', error);
        }
    });
}

private formatTimeForInput(time: string): string {
    // Ensure time is in HH:mm format for input fields
    return time.substring(0, 5);
}

}