import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BudgetsService } from '../../services/budgets.service';
import { CategoriesService } from '../../services/categories.service';
import { ExpensesService } from '../../services/expenses.service';
import { IncomesService } from '../../services/incomes.service';
import { SavingGoalsService } from '../../services/saving-goals.service';
import { StatsService } from '../../services/stats.service';
import { TokenService } from '../../core/token.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  // Services
  private statsService = inject(StatsService);
  private expensesService = inject(ExpensesService);
  private incomesService = inject(IncomesService);
  private categoriesService = inject(CategoriesService);
  private budgetsService = inject(BudgetsService);
  private goalsService = inject(SavingGoalsService);
  private tokenService = inject(TokenService);

  // UI State
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Period
  selectedMonth = signal(new Date().getMonth() + 1);
  selectedYear = signal(new Date().getFullYear());
  years = computed(() => Array.from({ length: 5 }, (_, i) => this.selectedYear() - 2 + i));
  months = [
    { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' }
  ];

  // Data
  private rawStats = signal<any>(null);
  private rawExpenses = signal<any[]>([]);
  private rawCategories = signal<any[]>([]);
  private rawBudgets = signal<any[]>([]);
  private rawGoals = signal<any[]>([]);

  // Computed View Data
  stats = computed(() => {
    const s = this.rawStats() || { totalIncome: 0, totalExpense: 0, net: 0, budgetRemaining: 0, budgetTotal: 0 };
    return [
      { label: 'Total income', value: s.totalIncome, delta: `Month ${this.selectedMonth()}/${this.selectedYear()}`, type: 'income' },
      { label: 'Total expenses', value: s.totalExpense, delta: `Month ${this.selectedMonth()}/${this.selectedYear()}`, type: 'expense' },
      { label: 'Net balance', value: s.net, delta: s.net >= 0 ? 'Positive flow' : 'Negative flow', type: 'net' },
      { label: 'Budget remaining', value: s.budgetRemaining, delta: s.budgetTotal ? `${Math.round((s.budgetRemaining / s.budgetTotal) * 100)}% left` : 'No budget set', type: 'budget' }
    ];
  });

  categories = computed(() => {
    const expenses = this.rawExpenses();
    const budgets = this.rawBudgets().filter(b => b.month === this.selectedMonth() && b.year === this.selectedYear());
    return this.rawCategories()
      .filter(c => c.type === 'EXPENSE')
      .map(cat => {
        const spent = expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + (e.amount || 0), 0);
        const budget = budgets.find(b => b.categoryId === cat.id);
        const limit = budget?.budgetAmount || 0;
        return { id: cat.id, name: cat.name, spent, limit: limit || Math.max(spent, 1), color: cat.color || '#6366f1', hasBudget: !!limit };
      })
      .filter(i => i.spent > 0 || i.hasBudget)
      .sort((a, b) => b.spent - a.spent);
  });

  highlights = computed(() => {
    const goals = this.rawGoals().filter(g => g.status === 'ACTIVE');
    const topGoal = [...goals].sort((a, b) => (b.currentAmount / (b.targetAmount || 1)) - (a.currentAmount / (a.targetAmount || 1)))[0];
    const nextDeadline = [...goals].filter(g => g.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
    return [
      { title: 'Active goals', detail: `${goals.length} goals in progress` },
      { title: topGoal ? `Top: ${topGoal.name}` : 'Top goal', detail: topGoal ? `${Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100)}% reached` : 'No active goals' },
      { title: 'Next deadline', detail: nextDeadline?.deadline ? new Date(nextDeadline.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline set' }
    ];
  });

  // Transaction Form
  transactionForm = { type: 'EXPENSE' as 'INCOME' | 'EXPENSE', amount: null as number | null, categoryId: '', date: new Date().toISOString().split('T')[0], description: '' };

  get filteredCategories() {
    return this.rawCategories().filter(c => c.type === this.transactionForm.type);
  }

  ngOnInit() { this.loadDashboard(); }

  loadDashboard() {
    const userId = this.tokenService.getUserId();
    if (!userId) return;

    this.isLoading.set(true);
    const start = new Date(this.selectedYear(), this.selectedMonth() - 1, 1).toISOString().split('T')[0];
    const end = new Date(this.selectedYear(), this.selectedMonth(), 0).toISOString().split('T')[0];

    forkJoin({
      stats: this.statsService.getMonthly(userId, this.selectedYear(), this.selectedMonth()).pipe(catchError(() => of(null))),
      expenses: this.expensesService.getByUserDate(userId, start, end).pipe(catchError(() => of([]))),
      categories: this.categoriesService.getByUser(userId).pipe(catchError(() => of([]))),
      budgets: this.budgetsService.getByUser(userId).pipe(catchError(() => of([]))),
      goals: this.goalsService.getByUser(userId).pipe(catchError(() => of([])))
    }).pipe(finalize(() => this.isLoading.set(false))).subscribe(res => {
      this.rawStats.set(res.stats);
      this.rawExpenses.set(res.expenses);
      this.rawCategories.set(res.categories);
      this.rawBudgets.set(res.budgets);
      this.rawGoals.set(res.goals);
    });
  }

  submitTransaction() {
    const userId = this.tokenService.getUserId();
    if (!userId || !this.transactionForm.amount || !this.transactionForm.categoryId) return this.errorMessage.set('All fields are mandatory.');

    // Pre-validation: Prevent exceeding budget for expenses
    if (this.transactionForm.type === 'EXPENSE') {
      const catId = Number(this.transactionForm.categoryId);
      const cat = this.categories().find(c => c.id === catId);
      const newAmount = this.transactionForm.amount || 0;

      if (cat && cat.hasBudget && (cat.spent + newAmount > cat.limit)) {
        this.errorMessage.set(`Opération annulée : Cette dépense dépasse votre budget de ${cat.limit}€ pour "${cat.name}".`);
        setTimeout(() => this.errorMessage.set(null), 5000);
        return;
      }
    }

    this.isSaving.set(true);
    const payload = { ...this.transactionForm, amount: this.transactionForm.amount as number };
    const service = this.transactionForm.type === 'INCOME' ? this.incomesService : this.expensesService;
    service.create(userId, payload).pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.successMessage.set('Entry recorded.');
        this.resetForm();
        this.loadDashboard();
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: () => {
        this.errorMessage.set('Failed to save entry.');
        setTimeout(() => this.errorMessage.set(null), 5000);
      }
    });
  }

  clearMessages() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private resetForm() {
    this.transactionForm = { ...this.transactionForm, amount: null, categoryId: '', description: '' };
  }

  resetFilters() {
    const now = new Date();
    this.selectedMonth.set(now.getMonth() + 1);
    this.selectedYear.set(now.getFullYear());
    this.loadDashboard();
  }

  getPercent(item: any): number {
    return Math.min(100, Math.round((item.spent / item.limit) * 100));
  }
}


