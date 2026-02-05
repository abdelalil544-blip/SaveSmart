export interface MonthlyStatsResponse {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
  budgetTotal: number;
  budgetRemaining: number;
}

export interface AnnualStatsResponse {
  year: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
  budgetTotal: number;
  budgetRemaining: number;
}
