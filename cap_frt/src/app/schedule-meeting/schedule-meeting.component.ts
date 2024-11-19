import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { MeetingService } from './schedule-meeting.service';
import { EmailRequest } from './email.interface';

@Component({
  selector: 'app-schedule-meeting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NavSidebarComponent,TopBarComponent],
  templateUrl: './schedule-meeting.component.html',
  styleUrl: './schedule-meeting.component.css'
})
export class ScheduleMeetingComponent implements OnInit {
  meetingForm!: FormGroup;

  constructor(private fb: FormBuilder, private meetingService: MeetingService) {}

  ngOnInit() {
    this.meetingForm = this.fb.group({
      meetingTitle: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      participants: ['', [Validators.required]],
      platform: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      const { meetingTitle, date, time, participants, platform } = this.meetingForm.value;
      
      // Prepare EmailRequest object
      const emailRequest: EmailRequest = {
        title: meetingTitle,
        emails: participants,
        date: date,
        time: time,
        mode: platform
      };

      this.meetingService.sendEmail(emailRequest).subscribe(
        response => {
          console.log('Emails sent successfully:', response);
        
          this.meetingForm.reset();
        },
        error => {
          console.error('Error sending emails:', error);
   
        }
      );
    }
  }
}