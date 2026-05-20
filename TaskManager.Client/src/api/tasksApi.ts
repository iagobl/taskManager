import axiosClient from './axiosClient'
import type {
    CreateTaskRequest,
    TaskItem,
    UpdateTaskRequest,
} from '../types/task'

export const tasksApi = {
    async getAllByProject(projectId: number): Promise<TaskItem[]> {
        const response = await axiosClient.get<TaskItem[]>(
            `/projects/${projectId}/tasks`,
        )
        return response.data
    },

    async getById(id: number): Promise<TaskItem> {
        const response = await axiosClient.get<TaskItem>(`/tasks/${id}`)
        return response.data
    },

    async create(
        projectId: number,
        data: CreateTaskRequest,
    ): Promise<TaskItem> {
        const response = await axiosClient.post<TaskItem>(
            `/projects/${projectId}/tasks`,
            data,
        )
        return response.data
    },

    async update(id: number, data: UpdateTaskRequest): Promise<TaskItem> {
        const response = await axiosClient.put<TaskItem>(`/tasks/${id}`, data)
        return response.data
    },

    async remove(id: number): Promise<void> {
        await axiosClient.delete(`/tasks/${id}`)
    },

    async complete(id: number): Promise<TaskItem> {
        const response = await axiosClient.patch<TaskItem>(`/tasks/${id}/complete`)
        return response.data
    },

    async reopen(id: number): Promise<TaskItem> {
        const response = await axiosClient.patch<TaskItem>(`/tasks/${id}/reopen`)
        return response.data
    },
}