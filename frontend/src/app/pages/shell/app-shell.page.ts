import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../core/token.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shell-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.page.html'
})
export class AppShellPage implements OnInit {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private userService = inject(UserService);
  private router = inject(Router);

  userInitials = signal('U');

  ngOnInit() {
    const userId = this.tokenService.getUserId();
    if (userId) {
      this.userService.getById(userId).subscribe(user => {
        const first = user.firstName?.charAt(0) || '';
        const last = user.lastName?.charAt(0) || '';
        this.userInitials.set((first + last) || 'U');
      });
    }
  }

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
