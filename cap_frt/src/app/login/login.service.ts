import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }
  private userId: number | null = null;
 
   
    


  private apiUrl = 'http://localhost:8081/api/employees'; 
  private http = inject(HttpClient);
  private router = inject(Router); 

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);


        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthenticatedUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/user`, { headers });
  }
}