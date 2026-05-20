export interface Project {
    id: number
    name: string
    description?: string | null
    createdAt: string
    taskCount: number
}

export interface CreateProjectRequest {
    name: string
    description?: string
}

export interface UpdateProjectRequest {
    name: string
    description?: string
}