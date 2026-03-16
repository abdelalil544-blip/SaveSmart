import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shell/app-shell.page').then((m) => m.AppShellPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
      },
      {
        path: 'budgets',
        loadComponent: () => import('./pages/budgets/budgets.page').then((m) => m.BudgetsPage)
      },
      {
        path: 'goals',
        loadComponent: () => import('./pages/goals/goals.page').then((m) => m.GoalsPage)
      },
      {
        path: 'timeline',
        loadComponent: () => import('./pages/timeline/timeline.page').then((m) => m.TimelinePage)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.page').then((m) => m.CategoriesPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin-shell/admin-shell.page').then((m) => m.AdminShellPage),
    children: [
      {
        path: 'overview',
        loadComponent: () => import('./pages/admin-overview/admin-overview.page').then((m) => m.AdminOverviewPage)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage)
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then((m) => m.RegisterPage)
  },
  {
    path: 'oauth2/redirect',
    loadComponent: () =>
      import('./pages/auth/oauth2-redirect/oauth2-redirect.page').then((m) => m.OAuth2RedirectPage)
  }
];
