import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { CategoriesService } from '../../services/categories.service';
import { TokenService } from '../../core/token.service';
import { CategoryResponse, CategoryType } from '../../models/categories.models';

@Component({
    selector: 'app-categories-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './categories.page.html'
})
export class CategoriesPage implements OnInit {
    categories = signal<CategoryResponse[]>([]);
    isLoading = signal(false);
    isSaving = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);
    showDeleteModal = signal(false);
    deletingCategory = signal<CategoryResponse | null>(null);

    editingId: string | null = null;
    form = {
        name: '',
        type: 'EXPENSE' as CategoryType,
        color: '#1d1c26'
    };

    constructor(
        private categoriesService: CategoriesService,
        private tokenService: TokenService
    ) { }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        const userId = this.tokenService.getUserId();
        if (!userId) return;

        this.isLoading.set(true);
        this.categoriesService.getByUser(userId)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (res) => this.categories.set(res),
                error: () => this.errorMessage.set('Failed to load categories.')
            });
    }

    submitCategory(): void {
        const userId = this.tokenService.getUserId();
        if (!userId) return;

        if (!this.form.name) {
            this.errorMessage.set('Name is required.');
            return;
        }

        this.isSaving.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        if (this.editingId) {
            this.categoriesService.update(this.editingId, this.form)
                .pipe(finalize(() => this.isSaving.set(false)))
                .subscribe({
                    next: () => {
                        this.successMessage.set('Category updated.');
                        this.cancelEdit();
                        this.loadCategories();
                    },
                    error: () => this.errorMessage.set('Failed to update category.')
                });
        } else {
            this.categoriesService.create(userId, this.form)
                .pipe(finalize(() => this.isSaving.set(false)))
                .subscribe({
                    next: () => {
                        this.successMessage.set('Category created.');
                        this.resetForm();
                        this.loadCategories();
                    },
                    error: () => this.errorMessage.set('Failed to create category.')
                });
        }
    }

    editCategory(cat: CategoryResponse): void {
        this.editingId = cat.id;
        this.form = {
            name: cat.name,
            type: cat.type,
            color: cat.color || '#1d1c26'
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteCategory(id: string): void {
        this.openDeleteModal(id);
    }

    openDeleteModal(id: string): void {
        const cat = this.categories().find(c => c.id === id) || null;
        this.deletingCategory.set(cat);
        this.showDeleteModal.set(true);
    }

    closeDeleteModal(): void {
        this.showDeleteModal.set(false);
        this.deletingCategory.set(null);
    }

    confirmDeleteCategory(): void {
        const cat = this.deletingCategory();
        if (!cat) return;

        this.categoriesService.delete(cat.id).subscribe({
            next: () => {
                this.successMessage.set('Category deleted.');
                this.loadCategories();
                this.closeDeleteModal();
            },
            error: () => this.errorMessage.set('Failed to delete category.')
        });
    }

    cancelEdit(): void {
        this.editingId = null;
        this.resetForm();
    }

    private resetForm(): void {
        this.form = {
            name: '',
            type: 'EXPENSE',
            color: '#1d1c26'
        };
    }
}
