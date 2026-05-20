import axiosClient from './axiosClient'
import type {
    Comment,
    CreateCommentRequest,
    UpdateCommentRequest,
} from '../types/comment'

export const commentsApi = {
    async getAllByTask(taskId: number): Promise<Comment[]> {
        const response = await axiosClient.get<Comment[]>(
            `/tasks/${taskId}/comments`,
        )

        return response.data
    },

    async getById(id: number): Promise<Comment> {
        const response = await axiosClient.get<Comment>(`/comments/${id}`)
        return response.data
    },

    async create(
        taskId: number,
        data: CreateCommentRequest,
    ): Promise<Comment> {
        const response = await axiosClient.post<Comment>(
            `/tasks/${taskId}/comments`,
            data,
        )

        return response.data
    },

    async update(id: number, data: UpdateCommentRequest): Promise<Comment> {
        const response = await axiosClient.put<Comment>(`/comments/${id}`, data)
        return response.data
    },

    async remove(id: number): Promise<void> {
        await axiosClient.delete(`/comments/${id}`)
    },
}