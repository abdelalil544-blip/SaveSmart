import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type TimelineEntry = {
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
};

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.page.html'
})
export class TimelinePage {
  entries: TimelineEntry[] = [
    { title: 'Salary', category: 'Income', amount: 3200, date: 'Sep 28', type: 'income' },
    { title: 'Groceries', category: 'Food', amount: 120, date: 'Sep 26', type: 'expense' },
    { title: 'Fuel', category: 'Transport', amount: 60, date: 'Sep 24', type: 'expense' },
    { title: 'Freelance project', category: 'Income', amount: 680, date: 'Sep 21', type: 'income' },
    { title: 'Rent', category: 'Home', amount: 900, date: 'Sep 20', type: 'expense' }
  ];
}
