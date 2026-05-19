using TaskManager.Api.DTOs.Comments;

namespace TaskManager.Api.Services.Interfaces;

public interface ICommentService
{
    Task<List<CommentDto>> GetAllByTaskIdAsync(int taskId, int userId);

    Task<CommentDto> GetByIdAsync(int commentId, int userId);

    Task<CommentDto> CreateAsync(int taskId, CreateCommentDto request, int userId);

    Task<CommentDto> UpdateAsync(int commentId, UpdateCommentDto request, int userId);

    Task DeleteAsync(int commentId, int userId);
}