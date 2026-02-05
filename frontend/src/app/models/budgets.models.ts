export interface BudgetCreate {
  budgetAmount: number;
  month: number;
  year: number;
  categoryId?: string;
  isGlobal?: boolean;
}

export interface BudgetUpdate {
  budgetAmount?: number;
  month?: number;
  year?: number;
  categoryId?: string;
  isGlobal?: boolean;
}

export interface BudgetResponse {
  id: string;
  budgetAmount: number;
  month: number;
  year: number;
  categoryId?: string;
  isGlobal?: boolean;
  userId?: string;
}
