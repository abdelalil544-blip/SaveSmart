export interface IncomeCreate {
  amount: number;
  date: string;
  description?: string;
  categoryId: string;
}

export interface IncomeUpdate {
  amount?: number;
  date?: string;
  description?: string;
  categoryId?: string;
}

export interface IncomeResponse {
  id: string;
  amount: number;
  date: string;
  description?: string;
  categoryId?: string;
  userId?: string;
}

export interface MonthlyIncomeResponse {
  year: number;
  month: number;
  total: number;
}
