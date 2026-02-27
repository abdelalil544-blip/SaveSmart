export interface TransactionResponse {
    id: string;
    amount: number;
    date: string;
    description: string;
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    type: 'INCOME' | 'EXPENSE';
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
