import axiosClient from './axiosClient'
import type {
    AuthResponse,
    CurrentUser,
    LoginRequest,
    RegisterRequest,
} from '../types/auth'

export const authApi = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await axiosClient.post<AuthResponse>('/Auth/register', data)
        return response.data
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axiosClient.post<AuthResponse>('/Auth/login', data)
        return response.data
    },

    async getCurrentUser(): Promise<CurrentUser> {
        const response = await axiosClient.get<CurrentUser>('/Users/me')
        return response.data
    },
}