export interface Category {
    id: number
    name: string
    color?: string | null
}

export interface CreateCategoryRequest {
    name: string
    color?: string
}

export interface UpdateCategoryRequest {
    name: string
    color?: string
}