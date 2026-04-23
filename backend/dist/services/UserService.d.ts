import { User, CreateUserData, UpdateUserData, LoginData, AuthResponse } from '../models/User';
export declare class UserService {
    static createUser(userData: CreateUserData): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<User | null>;
    static updateUser(id: number, updateData: UpdateUserData): Promise<User | null>;
    static deleteUser(id: number): Promise<boolean>;
    static getAllUsers(): Promise<User[]>;
    static authenticateUser(loginData: LoginData): Promise<AuthResponse | null>;
    static generateToken(user: User): string;
    static verifyToken(token: string): any;
}
//# sourceMappingURL=UserService.d.ts.map