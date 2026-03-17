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
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  editingTransaction = signal<TransactionResponse | null>(null);
  deletingTransaction = signal<TransactionResponse | null>(null);

  // Transaction Form
  transactionForm = { type: 'EXPENSE' as 'INCOME' | 'EXPENSE', amount: null as number | null, categoryId: '', date: new Date().toISOString().split('T')[0], description: '' };
  editForm = { amount: null as number | null, categoryId: '', date: '', description: '' };
  rawCategories = signal<CategoryResponse[]>([]);

  get filteredCategories() {
    return this.rawCategories().filter(c => c.type === this.transactionForm.type);
  }

  getCategoriesForType(type: 'INCOME' | 'EXPENSE') {
    return this.rawCategories().filter(c => c.type === type);
  }

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 8;
  totalElements = signal(0);

  // Filters
  selectedMonth = signal(0);
  selectedYear = signal(new Date().getFullYear());
  typeFilter = signal<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  months = [
    { value: 0, label: 'All months' },
    { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' }
  ];
  years = Array.from({ length: 5 }, (_, i) => this.selectedYear() - 2 + i);

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

    const month = this.selectedMonth();
    const start = month ? new Date(this.selectedYear(), month - 1, 1).toISOString().split('T')[0] : undefined;
    const end = month ? new Date(this.selectedYear(), month, 0).toISOString().split('T')[0] : undefined;

    this.transactionsService.getTransactions(userId, page, this.pageSize, start, end, this.typeFilter())
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

  openEditModal(tx: TransactionResponse) {
    this.editingTransaction.set(tx);
    this.editForm = {
      amount: tx.amount || null,
      categoryId: tx.categoryId || '',
      date: tx.date || new Date().toISOString().split('T')[0],
      description: tx.description || ''
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingTransaction.set(null);
  }

  saveTransactionEdit() {
    const tx = this.editingTransaction();
    if (!tx) return;
    if (!this.editForm.amount || !this.editForm.categoryId || !this.editForm.date) {
      this.errorMessage.set('All fields are mandatory.');
      return;
    }

    const payload = {
      amount: this.editForm.amount as number,
      date: this.editForm.date,
      description: this.editForm.description,
      categoryId: this.editForm.categoryId
    };
    const service = tx.type === 'INCOME' ? this.incomesService : this.expensesService;
    this.isSaving.set(true);
    service.update(tx.id, payload).pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.successMessage.set('Transaction updated.');
        this.closeEditModal();
        this.loadTransactions(this.currentPage());
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: () => {
        this.errorMessage.set('Failed to update transaction.');
        setTimeout(() => this.errorMessage.set(null), 5000);
      }
    });
  }

  openDeleteModal(tx: TransactionResponse) {
    this.deletingTransaction.set(tx);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deletingTransaction.set(null);
  }

  confirmDeleteTransaction() {
    const tx = this.deletingTransaction();
    if (!tx) return;
    const service = tx.type === 'INCOME' ? this.incomesService : this.expensesService;
    this.isSaving.set(true);
    service.delete(tx.id).pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.successMessage.set('Transaction deleted.');
        this.closeDeleteModal();
        this.loadTransactions(this.currentPage());
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: () => {
        this.errorMessage.set('Failed to delete transaction.');
        setTimeout(() => this.errorMessage.set(null), 5000);
      }
    });
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

  resetFilters(): void {
    const now = new Date();
    this.selectedMonth.set(0);
    this.selectedYear.set(now.getFullYear());
    this.typeFilter.set('ALL');
    this.loadTransactions(0);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
