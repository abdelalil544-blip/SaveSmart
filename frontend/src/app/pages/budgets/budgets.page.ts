import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BudgetsService } from '../../services/budgets.service';
import { CategoriesService } from '../../services/categories.service';
import { TokenService } from '../../core/token.service';
import { BudgetCreate, BudgetResponse, BudgetUpdate } from '../../models/budgets.models';
import { CategoryResponse } from '../../models/categories.models';

type BudgetItem = {
  title: string;
  spent: number;
  limit: number;
  month: string;
  tag: string;
};

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budgets.page.html'
})
export class BudgetsPage implements OnInit {
  budgets: BudgetResponse[] = [];
  filteredBudgets: BudgetResponse[] = [];
  categories: CategoryResponse[] = [];
  categoryMap = new Map<string, CategoryResponse>();

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

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
  viewMode: 'selected' | 'all' = 'selected';
  groupedBudgets: { label: string; items: BudgetResponse[] }[] = [];

  form = {
    budgetAmount: '',
    isGlobal: false,
    categoryId: '',
    month: 0,
    year: 0
  };
  editingId: string | null = null;

  private numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

  constructor(
    private budgetsService: BudgetsService,
    private categoriesService: CategoriesService,
    private tokenService: TokenService
  ) {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();
    for (let year = this.selectedYear - 2; year <= this.selectedYear + 1; year += 1) {
      this.years.push(year);
    }
    this.form.month = this.selectedMonth;
    this.form.year = this.selectedYear;
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  onPeriodChange(): void {
    this.form.month = this.selectedMonth;
    this.form.year = this.selectedYear;
    this.applyFilter();
  }

  toggleView(mode: 'selected' | 'all'): void {
    this.viewMode = mode;
    this.applyFilter();
  }

  submitBudget(): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.errorMessage.set('Utilisateur introuvable. Veuillez vous reconnecter.');
      return;
    }
    const amount = Number(this.form.budgetAmount);
    if (!amount || amount <= 0) {
      this.errorMessage.set('Le montant doit etre superieur a 0.');
      return;
    }
    if (!this.form.isGlobal && !this.form.categoryId) {
      this.errorMessage.set('Choisis une categorie ou active le budget global.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.editingId) {
      const payload: BudgetUpdate = {
        budgetAmount: amount,
        month: Number(this.form.month),
        year: Number(this.form.year),
        isGlobal: this.form.isGlobal
      };
      if (!this.form.isGlobal && this.form.categoryId) {
        payload.categoryId = this.form.categoryId;
      } else if (this.form.isGlobal) {
        payload.categoryId = '';
      }

      this.budgetsService
        .update(this.editingId, payload)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.successMessage.set('Budget mis a jour.');
            this.editingId = null;
            this.resetForm();
            this.loadBudgets();
          },
          error: (error) => {
            this.errorMessage.set(error?.error?.message ?? 'Mise a jour impossible.');
          }
        });
      return;
    }

    const payload: BudgetCreate = {
      budgetAmount: amount,
      month: Number(this.form.month),
      year: Number(this.form.year),
      isGlobal: this.form.isGlobal
    };
    if (!this.form.isGlobal && this.form.categoryId) {
      payload.categoryId = this.form.categoryId;
    }

    this.budgetsService
      .create(userId, payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Budget cree.');
          this.resetForm();
          this.loadBudgets();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'Creation impossible.');
        }
      });
  }

  editBudget(budget: BudgetResponse): void {
    this.editingId = budget.id;
    this.form.budgetAmount = String(budget.budgetAmount ?? '');
    this.form.isGlobal = !!budget.isGlobal;
    this.form.categoryId = budget.categoryId ?? '';
    this.form.month = budget.month;
    this.form.year = budget.year;
    this.selectedMonth = budget.month;
    this.selectedYear = budget.year;
    this.applyFilter();
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  deleteBudget(budget: BudgetResponse): void {
    if (!confirm('Supprimer ce budget ?')) {
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.budgetsService
      .delete(budget.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Budget supprime.');
          this.loadBudgets();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'Suppression impossible.');
        }
      });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.resetForm();
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) {
      return 'Global';
    }
    return this.categoryMap.get(categoryId)?.name ?? 'Categorie';
  }

  getCategoryTag(budget: BudgetResponse): string {
    if (budget.isGlobal || !budget.categoryId) {
      return 'Global';
    }
    return this.categoryMap.get(budget.categoryId)?.name ?? 'Category';
  }

  formatAmount(amount?: number): string {
    return this.numberFormatter.format(amount ?? 0);
  }

  private resetForm(): void {
    this.form = {
      budgetAmount: '',
      isGlobal: false,
      categoryId: '',
      month: this.selectedMonth,
      year: this.selectedYear
    };
  }

  private loadBudgets(): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.errorMessage.set('Utilisateur introuvable. Veuillez vous reconnecter.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      budgets: this.budgetsService.getByUser(userId).pipe(catchError(() => of([]))),
      categories: this.categoriesService.getByUser(userId).pipe(catchError(() => of([])))
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ budgets, categories }) => {
        this.budgets = budgets;
        this.categories = categories.filter((category) => category.type === 'EXPENSE');
        this.categoryMap = new Map(this.categories.map((category) => [category.id, category]));
        this.applyFilter();
      });
  }

  private applyFilter(): void {
    const sorted = [...this.budgets].sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });
    this.filteredBudgets = sorted.filter(
      (budget) => budget.month === Number(this.selectedMonth) && budget.year === Number(this.selectedYear)
    );

    const groups = new Map<string, BudgetResponse[]>();
    sorted.forEach((budget) => {
      const key = `${budget.year}-${String(budget.month).padStart(2, '0')}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push(budget);
    });
    this.groupedBudgets = Array.from(groups.entries()).map(([key, items]) => ({
      label: key,
      items
    }));
  }
}
