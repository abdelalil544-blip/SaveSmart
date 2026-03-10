import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../core/token.service';
import { UserResponse, UserUpdate } from '../../models/user.models';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile.page.html'
})
export class ProfilePage implements OnInit {
    private userService = inject(UserService);
    private tokenService = inject(TokenService);
    private router = inject(Router);

    // UI State
    user = signal<UserResponse | null>(null);
    isLoading = signal(false);
    isSaving = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    // Form state
    editMode = signal(false);
    editForm: UserUpdate = {};

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        const userId = this.tokenService.getUserId();
        if (!userId) return;

        this.isLoading.set(true);
        this.userService.getById(userId)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (data) => {
                    this.user.set(data);
                    this.resetForm();
                },
                error: () => this.errorMessage.set('Failed to load profile.')
            });
    }

    toggleEdit() {
        if (this.editMode()) {
            this.resetForm();
        }
        this.editMode.set(!this.editMode());
    }

    resetForm() {
        const u = this.user();
        if (u) {
            this.editForm = {
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phoneNumber: u.phoneNumber
            };
        }
    }

    saveProfile() {
        const userId = this.tokenService.getUserId();
        if (!userId) return;

        this.isSaving.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        this.userService.update(userId, this.editForm)
            .pipe(finalize(() => this.isSaving.set(false)))
            .subscribe({
                next: (updated) => {
                    this.user.set(updated);
                    this.editMode.set(false);
                    this.successMessage.set('Profile updated successfully.');
                    setTimeout(() => this.successMessage.set(null), 3000);
                },
                error: (err) => {
                    this.errorMessage.set('Failed to update profile.');
                    console.error(err);
                }
            });
    }

    logout() {
        this.tokenService.clear();
        this.router.navigateByUrl('/login');
    }
}
