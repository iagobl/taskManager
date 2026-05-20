export interface TaskItem {
    id: number
    title: string
    description?: string | null
    isCompleted: boolean
    priority: string
    dueDate?: string | null
    createdAt: string
    completedAt?: string | null
    projectId: number
    categoryId?: number | null
}

export interface CreateTaskRequest {
    title: string
    description?: string
    priority: string
    dueDate?: string | null
    categoryId?: number | null
}

export interface UpdateTaskRequest {
    title: string
    description?: string
    priority: string
    dueDate?: string | null
    categoryId?: number | null
}