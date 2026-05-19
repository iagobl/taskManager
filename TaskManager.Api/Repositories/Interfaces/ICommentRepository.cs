using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories.Interfaces;

public interface ICommentRepository
{
    Task<List<Comment>> GetAllByTaskIdAsync(int taskId);

    Task<Comment?> GetByIdAsync(int commentId);

    Task<Comment> CreateAsync(Comment comment);

    Task UpdateAsync(Comment comment);

    Task DeleteAsync(Comment comment);
}