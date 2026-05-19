export interface RegisterRequest {
    fullName: string
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    userId: number
    fullName: string
    email: string
    token: string
}

export interface CurrentUser {
    id: number
    fullName: string
    email: string
    createdAt: string
}