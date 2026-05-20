import axiosClient from './axiosClient'
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from '../types/category'

export const categoriesApi = {
    async getAll(): Promise<Category[]> {
        const response = await axiosClient.get<Category[]>('/Categories')
        return response.data
    },

    async getById(id: number): Promise<Category> {
        const response = await axiosClient.get<Category>(`/Categories/${id}`)
        return response.data
    },

    async create(data: CreateCategoryRequest): Promise<Category> {
        const response = await axiosClient.post<Category>('/Categories', data)
        return response.data
    },

    async update(id: number, data: UpdateCategoryRequest): Promise<Category> {
        const response = await axiosClient.put<Category>(`/Categories/${id}`, data)
        return response.data
    },

    async remove(id: number): Promise<void> {
        await axiosClient.delete(`/Categories/${id}`)
    },
}