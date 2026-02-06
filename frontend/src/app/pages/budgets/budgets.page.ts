import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './budgets.page.html'
})
export class BudgetsPage {
  budgets: BudgetItem[] = [
    { title: 'Global budget', spent: 3120, limit: 4200, month: 'September', tag: 'Global' },
    { title: 'Home bills', spent: 980, limit: 1050, month: 'September', tag: 'Housing' },
    { title: 'Food and groceries', spent: 420, limit: 520, month: 'September', tag: 'Essentials' },
    { title: 'Transport', spent: 210, limit: 320, month: 'September', tag: 'Essentials' }
  ];

  getPercent(item: BudgetItem): number {
    return Math.min(100, Math.round((item.spent / item.limit) * 100));
  }

  getStatus(item: BudgetItem): string {
    const percent = this.getPercent(item);
    if (percent >= 100) {
      return 'Over';
    }
    if (percent >= 80) {
      return 'Warning';
    }
    return 'On track';
  }
}
