import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type StatCard = {
  label: string;
  value: string;
  delta: string;
};

type CategorySpend = {
  name: string;
  spent: number;
  limit: number;
  color: string;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage {
  stats: StatCard[] = [
    { label: 'Total income', value: '12,450', delta: '+8% vs last month' },
    { label: 'Total expenses', value: '6,380', delta: '-4% vs last month' },
    { label: 'Net balance', value: '6,070', delta: 'Healthy' },
    { label: 'Budget remaining', value: '1,220', delta: '19% left' }
  ];

  categories: CategorySpend[] = [
    { name: 'Food', spent: 420, limit: 520, color: 'var(--chart-1)' },
    { name: 'Transport', spent: 210, limit: 320, color: 'var(--chart-2)' },
    { name: 'Home', spent: 980, limit: 1050, color: 'var(--chart-3)' },
    { name: 'Leisure', spent: 150, limit: 280, color: 'var(--chart-4)' }
  ];

  highlights = [
    { title: 'Goal pacing', detail: 'On track to hit 2 of 3 goals this quarter.' },
    { title: 'Top category', detail: 'Home bills are 32% of total spend.' },
    { title: 'Next payout', detail: 'Salary expected on 28th.' }
  ];

  getPercent(item: CategorySpend): number {
    return Math.min(100, Math.round((item.spent / item.limit) * 100));
  }
}
