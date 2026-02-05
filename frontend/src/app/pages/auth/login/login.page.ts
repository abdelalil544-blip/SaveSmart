import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../core/token.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload = this.loginForm.getRawValue();
    this.authService.login(payload).subscribe({
      next: (response) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken, response.user?.id);
        this.successMessage.set('Connexion reussie.');
        this.isLoading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Connexion impossible.');
      }
    });
  }
}
