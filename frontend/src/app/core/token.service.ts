import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userIdKey = 'userId';
  private userRoleKey = 'userRole';

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUserRole(): string | null {
    const stored = localStorage.getItem(this.userRoleKey);
    if (stored) {
      return stored;
    }
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    const role = this.extractRoleFromToken(token);
    if (role) {
      localStorage.setItem(this.userRoleKey, role);
    }
    return role;
  }

  setTokens(accessToken: string, refreshToken: string, userId?: string | null, role?: string | null): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    }
    if (role) {
      localStorage.setItem(this.userRoleKey, role);
    }
  }

  clear(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userRoleKey);
  }

  private extractRoleFromToken(token: string): string | null {
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
