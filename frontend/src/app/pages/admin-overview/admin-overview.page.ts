import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminStatsService } from '../../services/admin-stats.service';
import { AdminOverviewStats } from '../../models/admin.models';

@Component({
  selector: 'app-admin-overview-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview.page.html'
})
export class AdminOverviewPage implements OnInit {
  private adminStatsService = inject(AdminStatsService);

  stats = signal<AdminOverviewStats | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.adminStatsService.getOverview().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load admin stats.');
      }
    });
  }
}
