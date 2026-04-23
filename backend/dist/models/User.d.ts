export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
    role: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserData {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role?: string;
}
export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    role?: string;
    is_active?: boolean;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: Omit<User, 'password_hash'>;
    token: string;
}
//# sourceMappingURL=User.d.ts.map