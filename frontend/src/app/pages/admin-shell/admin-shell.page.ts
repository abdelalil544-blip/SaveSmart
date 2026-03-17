import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../core/token.service';

@Component({
  selector: 'app-admin-shell-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-shell.page.html'
})
export class AdminShellPage {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  logout() {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.tokenService.clear();
      this.router.navigateByUrl('/login');
      return;
    }

    this.authService
      .logout(refreshToken)
      .pipe(
        finalize(() => {
          this.tokenService.clear();
          this.router.navigateByUrl('/login');
        })
      )
      .subscribe({
        error: () => {
          // Even if logout fails, clear local state and redirect.
        }
      });
  }
}
