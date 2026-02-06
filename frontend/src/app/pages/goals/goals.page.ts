import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type GoalCard = {
  title: string;
  saved: number;
  target: number;
  due: string;
  status: string;
};

@Component({
  selector: 'app-goals-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goals.page.html'
})
export class GoalsPage {
  goals: GoalCard[] = [
    { title: 'Emergency fund', saved: 1800, target: 2500, due: 'Dec 2026', status: 'On track' },
    { title: 'New laptop', saved: 620, target: 900, due: 'Oct 2026', status: 'Sprint' },
    { title: 'Vacation', saved: 1400, target: 3000, due: 'Jun 2027', status: 'Steady' }
  ];

  getPercent(goal: GoalCard): number {
    return Math.min(100, Math.round((goal.saved / goal.target) * 100));
  }
}
