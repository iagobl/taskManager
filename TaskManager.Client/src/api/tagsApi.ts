import axiosClient from './axiosClient'
import type { CreateTagRequest, Tag, UpdateTagRequest } from '../types/tag'

export const tagsApi = {
    async getAll(): Promise<Tag[]> {
        const response = await axiosClient.get<Tag[]>('/Tags')
        return response.data
    },

    async getById(id: number): Promise<Tag> {
        const response = await axiosClient.get<Tag>(`/Tags/${id}`)
        return response.data
    },

    async create(data: CreateTagRequest): Promise<Tag> {
        const response = await axiosClient.post<Tag>('/Tags', data)
        return response.data
    },

    async update(id: number, data: UpdateTagRequest): Promise<Tag> {
        const response = await axiosClient.put<Tag>(`/Tags/${id}`, data)
        return response.data
    },

    async remove(id: number): Promise<void> {
        await axiosClient.delete(`/Tags/${id}`)
    },

    async addToTask(taskId: number, tagId: number): Promise<void> {
        await axiosClient.post(`/tasks/${taskId}/tags/${tagId}`)
    },

    async removeFromTask(taskId: number, tagId: number): Promise<void> {
        await axiosClient.delete(`/tasks/${taskId}/tags/${tagId}`)
    },
}