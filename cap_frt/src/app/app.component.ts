import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './team-dashboard/team-dashboard.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';

import { LoginComponent } from './login/login.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { TeamTimezoneChartComponent } from './team-timezone-chart/team-timezone-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, MyTeamComponent,ScheduleMeetingComponent,LoginComponent,TopBarComponent,TeamTimezoneChartComponent,NgxChartsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'capstone-project';
}
