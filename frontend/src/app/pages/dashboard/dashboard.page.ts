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
import { TransactionsService } from '../../services/transactions.service';
import { TokenService } from '../../core/token.service';
import { TransactionResponse } from '../../models/transactions.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  // Services
  private expensesService = inject(ExpensesService);
  private incomesService = inject(IncomesService);
  private transactionsService = inject(TransactionsService);
  private categoriesService = inject(CategoriesService);
  private budgetsService = inject(BudgetsService);
  private goalsService = inject(SavingGoalsService);
  private tokenService = inject(TokenService);

  // UI State
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

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
  incomes = signal<any[]>([]);
  private rawAllExpenses = signal<any[]>([]);
  private rawAllIncomes = signal<any[]>([]);
  private rawCategories = signal<any[]>([]);
  private rawBudgets = signal<any[]>([]);
  private rawGoals = signal<any[]>([]);
  recentTransactions = signal<TransactionResponse[]>([]);

  // Computed View Data
  stats = computed(() => {
    const s = this.rawStats() || { totalIncome: 0, totalExpense: 0, net: 0, budgetRemaining: 0, budgetTotal: 0 };
    return [
      { label: 'Total income', value: s.totalIncome, delta: 'All time', type: 'income' },
      { label: 'Total expenses', value: s.totalExpense, delta: 'All time', type: 'expense' },
      { label: 'Net balance', value: s.net, delta: s.net >= 0 ? 'Positive flow' : 'Negative flow', type: 'net' },
      { label: 'Budget remaining', value: s.budgetRemaining, delta: s.budgetTotal ? `${Math.round((s.budgetRemaining / s.budgetTotal) * 100)}% left` : `Month ${this.selectedMonth()}/${this.selectedYear()}`, type: 'budget' }
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

  getIncomeTotal(): number {
    return this.incomes().reduce((sum, i) => sum + (i.amount || 0), 0);
  }

  getIncomeBreakdown() {
    const total = this.getIncomeTotal();
    if (!total) return [];

    const categoryMap = new Map<number | string, { id: number | string; name: string; color: string }>();
    this.rawCategories()
      .filter(c => c.type === 'INCOME')
      .forEach(c => categoryMap.set(c.id, { id: c.id, name: c.name, color: c.color || '#94a3b8' }));

    const totals = new Map<number | string, number>();
    this.incomes().forEach(i => {
      const key = i.categoryId;
      totals.set(key, (totals.get(key) || 0) + (i.amount || 0));
    });

    const items = Array.from(totals.entries())
      .map(([id, amount]) => {
        const meta = categoryMap.get(id);
        return {
          name: meta?.name || 'Other',
          amount,
          percent: (amount / total) * 100,
          color: meta?.color || '#cbd5f5'
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return items;
  }

  getIncomeDonutGradient(): string {
    const breakdown = this.getIncomeBreakdown();
    if (!breakdown.length) return 'conic-gradient(#e2e8f0 0% 100%)';

    let start = 0;
    const stops = breakdown.map(item => {
      const end = start + item.percent;
      const seg = `${item.color} ${start}% ${end}%`;
      start = end;
      return seg;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

  getTotalSpent(): number {
    return this.categories().reduce((sum, item) => sum + (item.spent || 0), 0);
  }

  getCategoryBreakdown() {
    const total = this.getTotalSpent();
    if (!total) return [];

    const sorted = [...this.categories()].sort((a, b) => b.spent - a.spent);
    const top = sorted.slice(0, 4);
    const rest = sorted.slice(4);

    const breakdown = top.map(item => ({
      name: item.name,
      amount: item.spent,
      percent: (item.spent / total) * 100,
      color: item.color || '#94a3b8'
    }));

    if (rest.length) {
      const otherAmount = rest.reduce((sum, item) => sum + (item.spent || 0), 0);
      breakdown.push({
        name: 'Other',
        amount: otherAmount,
        percent: (otherAmount / total) * 100,
        color: '#cbd5f5'
      });
    }

    return breakdown;
  }

  getDonutGradient(): string {
    const breakdown = this.getCategoryBreakdown();
    if (!breakdown.length) return 'conic-gradient(#e2e8f0 0% 100%)';

    let start = 0;
    const stops = breakdown.map(item => {
      const end = start + item.percent;
      const seg = `${item.color} ${start}% ${end}%`;
      start = end;
      return seg;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

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

  ngOnInit() { this.loadDashboard(); }

  loadDashboard() {
    const userId = this.tokenService.getUserId();
    if (!userId) return;

    this.isLoading.set(true);
    const start = new Date(this.selectedYear(), this.selectedMonth() - 1, 1).toISOString().split('T')[0];
    const end = new Date(this.selectedYear(), this.selectedMonth(), 0).toISOString().split('T')[0];

    forkJoin({
      allExpenses: this.expensesService.getByUser(userId).pipe(catchError(() => of([]))),
      allIncomes: this.incomesService.getByUser(userId).pipe(catchError(() => of([]))),
      expenses: this.expensesService.getByUserDate(userId, start, end).pipe(catchError(() => of([]))),
      incomes: this.incomesService.getByUserDate(userId, start, end).pipe(catchError(() => of([]))),
      categories: this.categoriesService.getByUser(userId).pipe(catchError(() => of([]))),
      budgets: this.budgetsService.getByUser(userId).pipe(catchError(() => of([]))),
      goals: this.goalsService.getByUser(userId).pipe(catchError(() => of([]))),
      recentTx: this.transactionsService.getTransactions(userId, 0, 5).pipe(catchError(() => of({ content: [] } as any)))
    }).pipe(finalize(() => this.isLoading.set(false))).subscribe(res => {
      this.rawAllExpenses.set(res.allExpenses);
      this.rawAllIncomes.set(res.allIncomes);
      this.rawExpenses.set(res.expenses);
      this.incomes.set(res.incomes);
      this.rawCategories.set(res.categories);
      this.rawBudgets.set(res.budgets);
      this.rawGoals.set(res.goals);
      this.recentTransactions.set(res.recentTx?.content || []);

      const totalIncome = (res.allIncomes || []).reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
      const totalExpense = (res.allExpenses || []).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
      const budgetItems = (res.budgets || []).filter((b: any) => b.month === this.selectedMonth() && b.year === this.selectedYear());
      const budgetTotal = budgetItems.reduce((sum: number, b: any) => sum + (b.budgetAmount || 0), 0);
      const budgetSpent = (res.expenses || []).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
      const budgetRemaining = Math.max(budgetTotal - budgetSpent, 0);

      this.rawStats.set({
        totalIncome,
        totalExpense,
        net: totalIncome - totalExpense,
        budgetRemaining,
        budgetTotal
      });
    });
  }

  clearMessages() {
    this.errorMessage.set(null);
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

  formatShortDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}



