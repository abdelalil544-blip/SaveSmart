export type CategoryType = 'INCOME' | 'EXPENSE';

export interface CategoryCreate {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}

export interface CategoryUpdate {
  name?: string;
  type?: CategoryType;
  icon?: string;
  color?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}
