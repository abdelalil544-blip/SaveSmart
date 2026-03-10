export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: string;
    active: boolean;
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
