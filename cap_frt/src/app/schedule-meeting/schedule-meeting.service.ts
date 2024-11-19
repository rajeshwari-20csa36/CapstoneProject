import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailRequest } from './email.interface';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private baseUrl = 'http://localhost:8081/api/timezone/email'; 

  constructor(private http: HttpClient) {}

  sendEmail(emailRequest: EmailRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/send`, emailRequest);
  }
}
