import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { BudgetResponse } from '../../models/budgets.models';
import { CategoryResponse } from '../../models/categories.models';
import { ExpenseResponse } from '../../models/expenses.models';
import { MonthlyStatsResponse } from '../../models/stats.models';
import { SavingGoalResponse } from '../../models/saving-goals.models';

type StatCard = {
  label: string;
  value: string;
  delta: string;
};

type CategorySpend = {
  name: string;
  spent: number;
  limit: number;
  spentLabel: string;
  limitLabel: string;
  color: string;
  hasBudget: boolean;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  stats: StatCard[] = [];
  categories: CategorySpend[] = [];
  allCategories: CategoryResponse[] = [];
  highlights: { title: string; detail: string }[] = [];
  bars: number[] = [68, 52, 82, 44];

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Quick Action Form
  transactionForm = {
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    amount: null as number | null,
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  };

  months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' }
  ];
  years: number[] = [];
  selectedMonth: number;
  selectedYear: number;

  private numberFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  constructor(
    private statsService: StatsService,
    private expensesService: ExpensesService,
    private incomesService: IncomesService,
    private categoriesService: CategoriesService,
    private budgetsService: BudgetsService,
    private savingGoalsService: SavingGoalsService,
    private tokenService: TokenService
  ) {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();
    for (let year = this.selectedYear - 2; year <= this.selectedYear + 1; year += 1) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  onPeriodChange(): void {
    this.loadDashboard();
  }

  getPercent(item: CategorySpend): number {
    if (!item.limit) {
      return 0;
    }
    return Math.min(100, Math.round((item.spent / item.limit) * 100));
  }

  filteredCategories(): CategoryResponse[] {
    return this.allCategories.filter(c => c.type === this.transactionForm.type);
  }

  submitTransaction() {
    const userId = this.tokenService.getUserId();
    if (!userId) return;

    if (!this.transactionForm.amount || !this.transactionForm.categoryId || !this.transactionForm.date) {
      this.errorMessage.set('Please fill in all mandatory fields.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload = {
      amount: this.transactionForm.amount,
      categoryId: this.transactionForm.categoryId,
      date: this.transactionForm.date,
      description: this.transactionForm.description
    };

    const request = this.transactionForm.type === 'INCOME' 
      ? this.incomesService.create(userId, payload)
      : this.expensesService.create(userId, payload);

    request.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.successMessage.set(`${this.transactionForm.type === 'INCOME' ? 'Income' : 'Expense'} added successfully.`);
        this.resetForm();
        this.loadDashboard();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to add transaction. Please try again.');
      }
    });
  }

  private resetForm() {
    this.transactionForm = {
      type: 'EXPENSE',
      amount: null,
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    };
  }

  private loadDashboard(): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.errorMessage.set('User not found. Please log in again.');
      return;
    }

    const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    const endDate = new Date(this.selectedYear, this.selectedMonth, 0);
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);

    this.isLoading.set(true);

    forkJoin({
      stats: this.statsService.getMonthly(userId, this.selectedYear, this.selectedMonth).pipe(
        catchError(() => of(null))
      ),
      expenses: this.expensesService.getByUserDate(userId, start, end).pipe(
        catchError(() => of([]))
      ),
      categories: this.categoriesService.getByUser(userId).pipe(
        catchError(() => of([]))
      ),
      budgets: this.budgetsService.getByUser(userId).pipe(
        catchError(() => of([]))
      ),
      goals: this.savingGoalsService.getByUser(userId).pipe(
        catchError(() => of([]))
      )
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ stats, expenses, categories, budgets, goals }) => {
        this.allCategories = categories;
        this.applyStats(stats);
        this.applyCategorySpend(expenses, categories, budgets);
        this.applyHighlights(goals);
        this.applyBars(expenses);
      });
  }

  private applyStats(stats: MonthlyStatsResponse | null): void {
    const safeStats: MonthlyStatsResponse = stats ?? {
      year: this.selectedYear,
      month: this.selectedMonth,
      totalIncome: 0,
      totalExpense: 0,
      net: 0,
      budgetTotal: 0,
      budgetRemaining: 0
    };

    this.stats = [
      {
        label: 'Total income',
        value: this.formatAmount(safeStats.totalIncome),
        delta: `Month ${safeStats.month}/${safeStats.year}`
      },
      {
        label: 'Total expenses',
        value: this.formatAmount(safeStats.totalExpense),
        delta: `Month ${safeStats.month}/${safeStats.year}`
      },
      {
        label: 'Net balance',
        value: this.formatAmount(safeStats.net),
        delta: safeStats.net >= 0 ? 'Positive flow' : 'Negative flow'
      },
      {
        label: 'Budget remaining',
        value: this.formatAmount(safeStats.budgetRemaining),
        delta: this.formatBudgetDelta(safeStats)
      }
    ];
  }

  private applyCategorySpend(
    expenses: ExpenseResponse[],
    categories: CategoryResponse[],
    budgets: BudgetResponse[]
  ): void {
    const expenseCategories = categories.filter((category) => category.type === 'EXPENSE');
    const categoryMap = new Map<string, CategoryResponse>();
    expenseCategories.forEach((category) => categoryMap.set(category.id, category));

    const budgetsMap = new Map<string, number>();
    budgets
      .filter((budget) => budget.month === this.selectedMonth && budget.year === this.selectedYear)
      .filter((budget) => !!budget.categoryId)
      .forEach((budget) => budgetsMap.set(budget.categoryId as string, budget.budgetAmount));

    const totals = new Map<string, number>();
    expenses.forEach((expense) => {
      const key = expense.categoryId ?? 'uncategorized';
      totals.set(key, (totals.get(key) ?? 0) + (expense.amount ?? 0));
    });

    budgetsMap.forEach((_, categoryId) => {
      if (!totals.has(categoryId)) {
        totals.set(categoryId, 0);
      }
    });

    const palette = ['#ff9f87', '#8ec9ff', '#b49bff', '#3ad2ac', '#ffae58'];
    const items = Array.from(totals.entries())
      .map(([categoryId, spent], index) => {
        const category = categoryMap.get(categoryId);
        const budgetLimit = budgetsMap.get(categoryId);
        const limit = budgetLimit ?? Math.max(spent, 1);
        const color = category?.color ?? palette[index % palette.length];
        return {
          name: category?.name ?? 'Uncategorized',
          spent,
          limit,
          spentLabel: this.formatAmount(spent),
          limitLabel: budgetLimit ? this.formatAmount(budgetLimit) : 'No budget',
          color,
          hasBudget: !!budgetLimit
        };
      })
      .sort((a, b) => b.spent - a.spent);

    this.categories = items.length ? items : [];
  }

  private applyHighlights(goals: SavingGoalResponse[]): void {
    const activeGoals = goals.filter((goal) => goal.status === 'ACTIVE');
    const activeCount = activeGoals.length;
    const topGoal = activeGoals.reduce<{ goal: SavingGoalResponse | null; percent: number }>(
      (acc, goal) => {
        const percent = goal.targetAmount ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        return percent > acc.percent ? { goal, percent } : acc;
      },
      { goal: null, percent: 0 }
    );

    const deadlines = activeGoals
      .filter((goal) => !!goal.deadline)
      .sort((a, b) => new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime());
    const nextDeadline = deadlines[0];

    this.highlights = [
      {
        title: 'Active goals',
        detail: `${activeCount} goal${activeCount === 1 ? '' : 's'} in progress`
      },
      {
        title: topGoal.goal ? `Top goal: ${topGoal.goal.name}` : 'Top goal',
        detail: topGoal.goal ? `${Math.round(topGoal.percent)}% reached` : 'No active goals yet'
      },
      {
        title: 'Next deadline',
        detail: nextDeadline?.deadline ? this.formatReadableDate(nextDeadline.deadline) : 'No deadline set'
      }
    ];
  }

  private applyBars(expenses: ExpenseResponse[]): void {
    const totals = [0, 0, 0, 0];
    expenses.forEach((expense) => {
      if (!expense.date) {
        return;
      }
      const day = new Date(expense.date).getDate();
      const index = Math.min(3, Math.floor((day - 1) / 7));
      totals[index] += expense.amount ?? 0;
    });

    const max = Math.max(...totals, 1);
    this.bars = totals.map((value) => Math.round((value / max) * 100));
  }

  private formatAmount(value: number): string {
    return this.numberFormatter.format(value ?? 0);
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private formatReadableDate(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  private formatBudgetDelta(stats: MonthlyStatsResponse): string {
    if (!stats.budgetTotal) {
      return 'No budget set';
    }
    const percent = Math.max(0, Math.round((stats.budgetRemaining / stats.budgetTotal) * 100));
    return `${percent}% left`;
  }
}

