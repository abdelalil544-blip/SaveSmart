import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TokenService } from '../../../core/token.service';

@Component({
  selector: 'app-oauth2-redirect-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="oauth2-redirect">
      <div class="card">
        <h1>Connexion Google</h1>
        <p *ngIf="status() === 'processing'">Connexion en cours...</p>
        <p *ngIf="status() === 'success'">Connexion reussie. Redirection...</p>
        <p *ngIf="status() === 'error'">Connexion echouee. Veuillez reessayer.</p>
        <button *ngIf="status() === 'error'" (click)="goToLogin()">Retour a la connexion</button>
      </div>
    </div>
  `,
  styles: [`
    .oauth2-redirect {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f5f6fa;
      padding: 24px;
    }
    .card {
      width: min(420px, 100%);
      background: #ffffff;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      text-align: center;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 22px;
    }
    p {
      margin: 0 0 16px;
      color: #444;
    }
    button {
      border: none;
      background: #1d1c26;
      color: #fff;
      padding: 10px 16px;
      border-radius: 10px;
      cursor: pointer;
    }
  `]
})
export class OAuth2RedirectPage implements OnInit {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  status = signal<'processing' | 'success' | 'error'>('processing');

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      this.status.set('error');
      return;
    }

    const userId = this.extractUserId(accessToken);
    const role = this.extractUserRole(accessToken);
    this.tokenService.setTokens(accessToken, refreshToken, userId, role);
    this.status.set('success');
    this.router.navigateByUrl('/app/dashboard');
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  private extractUserId(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }
      const payload = this.decodeBase64Url(parts[1]);
      if (!payload) {
        return null;
      }
      const data = JSON.parse(payload) as { userId?: string };
      return data.userId ?? null;
    } catch {
      return null;
    }
  }

  private extractUserRole(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }
      const payload = this.decodeBase64Url(parts[1]);
      if (!payload) {
        return null;
      }
      const data = JSON.parse(payload) as { role?: string };
      return data.role ?? null;
    } catch {
      return null;
    }
  }

  private decodeBase64Url(input: string): string | null {
    try {
      const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      return decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return null;
    }
  }
}
