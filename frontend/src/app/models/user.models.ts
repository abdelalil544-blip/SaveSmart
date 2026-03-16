export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: string;
    active: boolean;
}

export interface UserStats {
    totalIncome: number;
    totalExpense: number;
    budgetTotal: number;
    budgetCount: number;
    goalCount: number;
    activeGoals: number;
    completedGoals: number;
    cancelledGoals: number;
}

export interface UserUpdate {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    active?: boolean;
    role?: string;
}
