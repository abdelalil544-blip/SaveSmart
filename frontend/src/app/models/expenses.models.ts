export interface ExpenseCreate {
  amount: number;
  date: string;
  description?: string;
  note?: string;
  categoryId: string;
}

export interface ExpenseUpdate {
  amount?: number;
  date?: string;
  description?: string;
  note?: string;
  categoryId?: string;
}

export interface ExpenseResponse {
  id: string;
  amount: number;
  date: string;
  description?: string;
  note?: string;
  categoryId?: string;
  userId?: string;
}
