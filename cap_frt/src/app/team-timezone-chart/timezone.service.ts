import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  private apiUrl = 'http://localhost:8081/api/timezone';

  constructor(private http: HttpClient) {}

  getOverlappingWorkingHours(
    employeeIds: number[], 
    date: Date
  ): Observable<string[]> {
    const params = new HttpParams()
      .set('employeeIds', employeeIds.join(','))
      .set('date', date.toISOString().split('T')[0]);

    return this.http.get<string[]>(`${this.apiUrl}/overlap`, { params });
  }

  suggestBestMeetingTime(
    employeeIds: number[], 
    startDate: Date,
    daysToCheck: number
  ): Observable<string> {
    const params = new HttpParams()
      .set('employeeIds', employeeIds.join(','))
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('daysToCheck', daysToCheck.toString());

    return this.http.get<string>(`${this.apiUrl}/suggest-meeting`, { params });
  }

  validateMeetingTime(
    employeeIds: number[], 
    proposedTime: Date
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('employeeIds', employeeIds.join(','))
      .set('proposedMeetingTime', proposedTime.toISOString());

    return this.http.get<boolean>(`${this.apiUrl}/validate-meeting-time`, { params });
  }
}