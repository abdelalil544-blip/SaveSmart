import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { ExpensesService } from '../../services/expenses.service';
import { IncomesService } from '../../services/incomes.service';
import { TokenService } from '../../core/token.service';
import { TransactionResponse } from '../../models/transactions.models';
import { CategoryResponse } from '../../models/categories.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timeline.page.html'
})
export class TimelinePage implements OnInit {
  entries = signal<TransactionResponse[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showTransactionModal = signal(false);

  // Transaction Form
  transactionForm = { type: 'EXPENSE' as 'INCOME' | 'EXPENSE', amount: null as number | null, categoryId: '', date: new Date().toISOString().split('T')[0], description: '' };
  rawCategories = signal<CategoryResponse[]>([]);

  get filteredCategories() {
    return this.rawCategories().filter(c => c.type === this.transactionForm.type);
  }

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 10;
  totalElements = signal(0);

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private expensesService: ExpensesService,
    private incomesService: IncomesService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
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

  loadCategories(): void {
    const userId = this.tokenService.getUserId();
    if (!userId) return;

    this.categoriesService.getByUser(userId).subscribe({
      next: (data) => this.rawCategories.set(data),
      error: () => this.errorMessage.set('Failed to load categories.')
    });
  }

  submitTransaction() {
    const userId = this.tokenService.getUserId();
    if (!userId || !this.transactionForm.amount || !this.transactionForm.categoryId) {
      this.errorMessage.set('All fields are mandatory.');
      return;
    }

    this.isSaving.set(true);
    const payload = { ...this.transactionForm, amount: this.transactionForm.amount as number };
    const service = this.transactionForm.type === 'INCOME' ? this.incomesService : this.expensesService;
    service.create(userId, payload).pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.successMessage.set('Entry recorded.');
        this.resetForm();
        this.closeTransactionModal();
        this.loadTransactions(0);
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: () => {
        this.errorMessage.set('Failed to save entry.');
        setTimeout(() => this.errorMessage.set(null), 5000);
      }
    });
  }

  openTransactionModal() {
    this.transactionForm = {
      ...this.transactionForm,
      date: new Date().toISOString().split('T')[0]
    };
    this.showTransactionModal.set(true);
  }

  closeTransactionModal() {
    this.showTransactionModal.set(false);
  }

  clearMessages() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private resetForm() {
    this.transactionForm = {
      ...this.transactionForm,
      amount: null,
      categoryId: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    };
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
