import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUsersService } from '../../services/admin-users.service';
import { UserResponse, UserUpdate } from '../../models/user.models';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.page.html'
})
export class AdminPage implements OnInit {
  private adminUsersService = inject(AdminUsersService);

  users = signal<UserResponse[]>([]);
  selectedUser = signal<UserResponse | null>(null);
  searchQuery = '';

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  editRole = 'ROLE_USER';
  editActive = true;
  resetPassword = '';

  // Pagination
  pageSize = 5;
  currentPage = signal(0);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const query = this.searchQuery.trim();
    this.adminUsersService.list(query || undefined).subscribe({
      next: (data) => {
        this.users.set(data);
        this.currentPage.set(0);
        this.isLoading.set(false);
        const current = this.selectedUser();
        if (current) {
          const refreshed = data.find((u) => u.id === current.id) || null;
          this.setSelectedUser(refreshed);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load users.');
      }
    });
  }

  selectUser(user: UserResponse): void {
    this.setSelectedUser(user);
  }

  clearSelection(): void {
    this.setSelectedUser(null);
  }

  updateUser(): void {
    const user = this.selectedUser();
    if (!user) return;
    const payload: UserUpdate = {
      role: this.editRole,
      active: this.editActive
    };
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.adminUsersService.update(user.id, payload).subscribe({
      next: (updated) => {
        this.successMessage.set('User updated.');
        this.isSaving.set(false);
        this.setSelectedUser(updated);
        this.loadUsers();
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Failed to update user.');
      }
    });
  }

  resetUserPassword(): void {
    const user = this.selectedUser();
    const password = this.resetPassword.trim();
    if (!user || password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters.');
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.adminUsersService.resetPassword(user.id, password).subscribe({
      next: () => {
        this.successMessage.set('Password reset.');
        this.isSaving.set(false);
        this.resetPassword = '';
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Failed to reset password.');
      }
    });
  }

  deleteUser(): void {
    const user = this.selectedUser();
    if (!user) return;
    if (!confirm(`Delete user ${user.email}?`)) return;
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.adminUsersService.delete(user.id).subscribe({
      next: () => {
        this.successMessage.set('User deleted.');
        this.isSaving.set(false);
        this.setSelectedUser(null);
        this.loadUsers();
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Failed to delete user.');
      }
    });
  }

  private setSelectedUser(user: UserResponse | null): void {
    this.selectedUser.set(user);
    if (user) {
      this.editRole = user.role || 'ROLE_USER';
      this.editActive = !!user.active;
    } else {
      this.editRole = 'ROLE_USER';
      this.editActive = true;
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.users().length / this.pageSize));
  }

  pagedUsers(): UserResponse[] {
    const start = this.currentPage() * this.pageSize;
    return this.users().slice(start, start + this.pageSize);
  }

  pageEndIndex(): number {
    const end = (this.currentPage() + 1) * this.pageSize;
    return Math.min(end, this.users().length);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  goToPage(index: number): void {
    if (index >= 0 && index < this.totalPages) {
      this.currentPage.set(index);
    }
  }
}
