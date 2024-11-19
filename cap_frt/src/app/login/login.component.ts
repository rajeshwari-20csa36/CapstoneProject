import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <p *ngIf="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  private authService = inject(LoginService);
  private router = inject(Router);

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Redirect to the home page (TeamDashboardComponent)
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}