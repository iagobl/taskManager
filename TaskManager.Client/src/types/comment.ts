export interface Comment {
    id: number
    content: string
    createdAt: string
    taskItemId: number
}

export interface CreateCommentRequest {
    content: string
}

export interface UpdateCommentRequest {
    content: string
}