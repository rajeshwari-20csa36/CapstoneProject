import { Routes } from '@angular/router';

import { MyTeamComponent } from './my-team/my-team.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';

import { LoginComponent } from './login/login.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AuthGuard } from './interceptor/auth.guard';
import { DashboardComponent } from './team-dashboard/team-dashboard.component';
import { TeamTimezoneChartComponent } from './team-timezone-chart/team-timezone-chart.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'myteam', component: MyTeamComponent, canActivate: [AuthGuard] },
    { path: 'schedule', component: ScheduleMeetingComponent, canActivate: [AuthGuard] },
    { path: 'timezone', component: TeamTimezoneChartComponent, canActivate: [AuthGuard] },
    { path: 'timesheet', component: TimesheetComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' } 
];