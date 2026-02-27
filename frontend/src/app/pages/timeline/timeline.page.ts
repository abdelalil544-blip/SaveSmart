import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { TokenService } from '../../core/token.service';
import { TransactionResponse } from '../../models/transactions.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.page.html'
})
export class TimelinePage implements OnInit {
  entries = signal<TransactionResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 10;
  totalElements = signal(0);

  constructor(
    private transactionsService: TransactionsService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(page: number = 0): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.errorMessage.set('User not found. Please log in again.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.transactionsService.getTransactions(userId, page, this.pageSize)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.entries.set(res.content);
          this.currentPage.set(res.number);
          this.totalPages.set(res.totalPages);
          this.totalElements.set(res.totalElements);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Failed to load transaction history.');
        }
      });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadTransactions(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadTransactions(this.currentPage() - 1);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
