export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface SavingGoalCreate {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
  description?: string;
  status?: GoalStatus;
}

export interface SavingGoalUpdate {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  description?: string;
  status?: GoalStatus;
}

export interface SavingGoalResponse {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  description?: string;
  status: GoalStatus;
  userId?: string;
}

export interface GoalProgressResponse {
  total: number;
  percent: number;
  remaining: number;
  status: GoalStatus;
}
