import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

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
        path: '',
        redirectTo: 'dashboard',
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
  }
];
