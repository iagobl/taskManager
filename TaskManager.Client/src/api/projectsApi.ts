import axiosClient from './axiosClient'
import type {
    CreateProjectRequest,
    Project,
    UpdateProjectRequest,
} from '../types/project'

export const projectsApi = {
    async getAll(): Promise<Project[]> {
        const response = await axiosClient.get<Project[]>('/Projects')
        return response.data
    },

    async getById(id: number): Promise<Project> {
        const response = await axiosClient.get<Project>(`/Projects/${id}`)
        return response.data
    },

    async create(data: CreateProjectRequest): Promise<Project> {
        const response = await axiosClient.post<Project>('/Projects', data)
        return response.data
    },

    async update(id: number, data: UpdateProjectRequest): Promise<Project> {
        const response = await axiosClient.put<Project>(`/Projects/${id}`, data)
        return response.data
    },

    async remove(id: number): Promise<void> {
        await axiosClient.delete(`/Projects/${id}`)
    },
}