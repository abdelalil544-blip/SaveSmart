import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SavingGoalsService } from '../../services/saving-goals.service';
import { TokenService } from '../../core/token.service';
import { SavingGoalResponse, SavingGoalCreate, SavingGoalUpdate, GoalStatus } from '../../models/saving-goals.models';

@Component({
  selector: 'app-goals-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.page.html'
})
export class GoalsPage implements OnInit {
  private goalsService = inject(SavingGoalsService);
  private tokenService = inject(TokenService);

  // State
  goals = signal<SavingGoalResponse[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  // Form state
  today = new Date().toISOString().split('T')[0];
  showAddModal = signal(false);
  showEditModal = signal(false);
  editGoalId = signal<string | null>(null);
  editGoal: SavingGoalUpdate = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    description: '',
    status: 'ACTIVE'
  };
  statusOptions: GoalStatus[] = ['ACTIVE', 'COMPLETED', 'CANCELLED'];
  newGoal: SavingGoalCreate = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    description: '',
    status: 'ACTIVE'
  };

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    const userId = this.tokenService.getUserId();
    if (!userId) return;

    this.isLoading.set(true);
    this.goalsService.getByUser(userId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.goals.set(data),
        error: () => this.errorMessage.set('Failed to load goals.')
      });
  }

  getPercent(goal: SavingGoalResponse): number {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  }

  getTotalSaved(): number {
    return this.goals().reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  }

  openAddModal() {
    this.newGoal = {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      description: '',
      status: 'ACTIVE'
    };
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  openEditModal(goal: SavingGoalResponse) {
    this.editGoalId.set(goal.id);
    this.editGoal = {
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline || '',
      description: goal.description || '',
      status: goal.status
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editGoalId.set(null);
  }

  createGoal() {
    const userId = this.tokenService.getUserId();
    if (!userId || !this.newGoal.name || this.newGoal.targetAmount <= 0) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    if ((this.newGoal.currentAmount || 0) >= this.newGoal.targetAmount) {
      this.errorMessage.set('Le montant économisé doit être strictement inférieur à l\'objectif.');
      return;
    }

    this.isSaving.set(true);
    this.goalsService.create(userId, this.newGoal)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.loadGoals();
          this.closeAddModal();
        },
        error: () => this.errorMessage.set('Failed to create goal.')
      });
  }

  deleteGoal(id: string) {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    this.goalsService.delete(id).subscribe({
      next: () => this.loadGoals(),
      error: () => this.errorMessage.set('Failed to delete goal.')
    });
  }

  updateAllocation(goal: SavingGoalResponse) {
    this.openEditModal(goal);
  }

  updateGoal() {
    const goalId = this.editGoalId();
    if (!goalId || !this.editGoal.name || (this.editGoal.targetAmount || 0) <= 0) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    const currentAmount = this.editGoal.currentAmount || 0;
    const targetAmount = this.editGoal.targetAmount || 0;
    if (currentAmount >= targetAmount) {
      this.errorMessage.set('Le montant économisé doit être strictement inférieur à l\'objectif.');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    this.isSaving.set(true);
    this.goalsService.update(goalId, this.editGoal)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.loadGoals();
          this.closeEditModal();
        },
        error: () => this.errorMessage.set('Failed to update goal.')
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-600 ring-emerald-200';
      case 'CANCELLED': return 'bg-rose-100 text-rose-600 ring-rose-200';
      default: return 'bg-slate-100 text-slate-600 ring-slate-200';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'No deadline';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}

