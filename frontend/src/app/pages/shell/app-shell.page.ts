import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TokenService } from '../../core/token.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shell-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.page.html'
})
export class AppShellPage implements OnInit {
  private tokenService = inject(TokenService);
  private userService = inject(UserService);

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
}
