import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import { authApi } from '../api/authApi'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

interface AuthUser {
    userId: number
    fullName: string
    email: string
}

interface AuthContextValue {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'taskmanager_token'
const USER_KEY = 'taskmanager_user'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser) as AuthUser)
        }

        setLoading(false)
    }, [])

    const saveSession = (response: AuthResponse) => {
        const authUser: AuthUser = {
            userId: response.userId,
            fullName: response.fullName,
            email: response.email,
        }

        localStorage.setItem(TOKEN_KEY, response.token)
        localStorage.setItem(USER_KEY, JSON.stringify(authUser))

        setToken(response.token)
        setUser(authUser)
    }

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data)
        saveSession(response)
    }

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data)
        saveSession(response)
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)

        setToken(null)
        setUser(null)
    }

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token),
            loading,
            login,
            register,
            logout,
        }),
        [user, token, loading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}