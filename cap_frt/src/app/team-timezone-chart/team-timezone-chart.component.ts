import { Component, OnInit, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import  moment from 'moment-timezone';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TeamService } from '../my-team/team.service';
import { TimesheetService } from '../timesheet/timesheet.service';
import { Employee } from '../team-dashboard/employee.model';
import { EmployeeTimeZone } from '../timesheet/team-timezone.interface';
import { TimeZoneService } from './timezone.service';

// Add TimeZone Service
interface OverlapSlot {
  dateTime: string;
  score?: number;
}
Chart.register(...registerables);
@Component({
  selector: 'app-team-timezone-chart',
  standalone: true,
  imports: [CommonModule, NavSidebarComponent, TopBarComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-nav-sidebar [activePage]="'Team Timezone'" />
      <main class="flex-1 overflow-y-auto">
        <app-top-bar [currentPage]="'Team Timezone'" />
        
        <div class="p-6">
          <!-- Date Selection -->
          <div class="mb-6">
            <input 
              type="date" 
              [value]="selectedDate | date:'yyyy-MM-dd'"
              (change)="onDateChange($event)"
              class="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <!-- Timezone Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Best Meeting Time
              </h3>
              <p class="text-gray-600" [class.text-red-500]="!bestMeetingTime">
                {{ bestMeetingTime || 'Calculating best meeting time...' }}
              </p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Available Meeting Slots
              </h3>
              <div class="max-h-40 overflow-y-auto">
                <div *ngFor="let slot of availableSlots" 
                     class="text-gray-600 mb-1 p-2 hover:bg-gray-50 rounded cursor-pointer"
                     (click)="validateMeetingTime(slot)">
                  {{ formatSlotTime(slot.dateTime) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Container -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="h-[400px] relative">
              <canvas #chartCanvas></canvas>
            </div>

            <!-- Legend -->
            <div class="flex justify-center gap-6 mt-4">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-blue-200 border border-blue-500"></span>
                <span class="text-sm text-gray-600">Working Hours</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-purple-200 border border-purple-500"></span>
                <span class="text-sm text-gray-600">Overlap Time</span>
              </div>
            </div>
          </div>

          <!-- Validation Message -->
          <div *ngIf="validationMessage" 
               [class]="validationMessage.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
               class="mt-4 p-4 rounded-lg">
            {{ validationMessage.message }}
          </div>
        </div>
      </main>
    </div>
  `
})
export class TeamTimezoneChartComponent implements OnInit {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart?: Chart;
  private destroyRef = inject(DestroyRef);
  
  teamMembers: Employee[] = [];
  employeeTimeZones: Record<number, EmployeeTimeZone> = {};
  bestMeetingTime = '';
  availableSlots: OverlapSlot[] = [];
  selectedDate = new Date();
  validationMessage: { isValid: boolean; message: string } | null = null;

  constructor(
    private teamService: TeamService,
    private timesheetService: TimesheetService,
    private timeZoneService: TimeZoneService  // Inject the TimeZoneService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadTeamData();
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = new Date(input.value);
    this.loadOverlapData();
  }

  private loadTeamData(): void {
    this.teamService.getTeamMembers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(members => {
          this.teamMembers = members;
          return members.map(member => member.employeeId);
        }),
        switchMap(employeeIds => {
          // Load overlap data from backend
          return forkJoin([
            this.loadOverlapData(),
            this.loadBestMeetingTime(employeeIds)
          ]);
        })
      )
      .subscribe({
        error: (error) => console.error('Error loading team data:', error)
      });
  }

  private loadOverlapData(): Promise<void> {
    const employeeIds = this.teamMembers.map(member => member.employeeId);
    
    return this.timeZoneService.getOverlappingWorkingHours(employeeIds, this.selectedDate)
      .toPromise()
      .then(slots => {
        if (slots) {
          this.availableSlots = slots.map(slot => ({ dateTime: slot }));
          this.updateChart();
        }
      })
      .catch(error => {
        console.error('Error loading overlap data:', error);
      });
  }

  private loadBestMeetingTime(employeeIds: number[]): Promise<void> {
    const daysToCheck = 5; // Configure as needed
    
    return this.timeZoneService.suggestBestMeetingTime(
      employeeIds, 
      this.selectedDate,
      daysToCheck
    )
    .toPromise()
    .then(bestTime => {
      if (bestTime) {
        this.bestMeetingTime = this.formatDateTime(bestTime);
      }
    })
    .catch(error => {
      console.error('Error loading best meeting time:', error);
      this.bestMeetingTime = 'Unable to calculate best meeting time';
    });
  }

  validateMeetingTime(slot: OverlapSlot): void {
    const employeeIds = this.teamMembers.map(member => member.employeeId);
    const proposedTime = new Date(slot.dateTime);

    this.timeZoneService.validateMeetingTime(employeeIds, proposedTime)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (isValid) => {
          this.validationMessage = {
            isValid,
            message: isValid 
              ? 'This meeting time works for all team members!' 
              : 'Some team members might be unavailable at this time.'
          };
        },
        error: (error) => {
          console.error('Error validating meeting time:', error);
          this.validationMessage = {
            isValid: false,
            message: 'Unable to validate meeting time'
          };
        }
      });
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const datasets = this.generateDatasets();
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category', 
            stacked: true,
            title: {
              display: true,
              text: 'Time (UTC)',
              color: '#4B5563'
            },
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: this.teamMembers.length,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: '#E5E7EB'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const hour = context.label;
                const value = context.raw as number;
                return value > 0 ? `${datasetLabel} (${hour})` : '';
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private generateDatasets() {
    const hourlyData = new Array(24).fill(0);
    const workingHoursData = new Array(24).fill(0);
    const overlapData = new Array(24).fill(0);

    // Process available slots from backend
    this.availableSlots.forEach(slot => {
      const hour = new Date(slot.dateTime).getUTCHours();
      overlapData[hour] = this.teamMembers.length; // Full overlap
      workingHoursData[hour] = 0; // Zero out working hours for overlap periods
    });

    return [
      {
        label: 'Working Hours',
        data: workingHoursData,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1
      },
      {
        label: 'Overlap',
        data: overlapData,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 0.8)',
        borderWidth: 1
      }
    ];
  }

  private formatDateTime(dateTime: string): string {
    return moment(dateTime).format('MMMM D, YYYY HH:mm [UTC]');
  }

  formatSlotTime(dateTime: string): string {
    return moment(dateTime).format('HH:mm [UTC]');
  }
}
