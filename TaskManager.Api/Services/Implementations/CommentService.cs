using TaskManager.Api.DTOs.Comments;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Services.Implementations;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private readonly ITaskRepository _taskRepository;

    public CommentService(
        ICommentRepository commentRepository,
        ITaskRepository taskRepository)
    {
        _commentRepository = commentRepository;
        _taskRepository = taskRepository;
    }

    public async Task<List<CommentDto>> GetAllByTaskIdAsync(int taskId, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);

        if (task is null || task.Project.UserId != userId)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        var comments = await _commentRepository.GetAllByTaskIdAsync(taskId);

        return comments.Select(MapToDto).ToList();
    }

    public async Task<CommentDto> GetByIdAsync(int commentId, int userId)
    {
        var comment = await GetCommentOwnedByUserAsync(commentId, userId);

        return MapToDto(comment);
    }

    public async Task<CommentDto> CreateAsync(int taskId, CreateCommentDto request, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);

        if (task is null || task.Project.UserId != userId)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        var comment = new Comment
        {
            Content = request.Content.Trim(),
            CreatedAt = DateTime.UtcNow,
            TaskItemId = taskId
        };

        var createdComment = await _commentRepository.CreateAsync(comment);

        return MapToDto(createdComment);
    }

    public async Task<CommentDto> UpdateAsync(int commentId, UpdateCommentDto request, int userId)
    {
        var comment = await GetCommentOwnedByUserAsync(commentId, userId);

        comment.Content = request.Content.Trim();

        await _commentRepository.UpdateAsync(comment);

        return MapToDto(comment);
    }

    public async Task DeleteAsync(int commentId, int userId)
    {
        var comment = await GetCommentOwnedByUserAsync(commentId, userId);

        await _commentRepository.DeleteAsync(comment);
    }

    private async Task<Comment> GetCommentOwnedByUserAsync(int commentId, int userId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);

        if (comment is null || comment.TaskItem.Project.UserId != userId)
        {
            throw new KeyNotFoundException("Comment not found.");
        }

        return comment;
    }

    private static CommentDto MapToDto(Comment comment)
    {
        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            TaskItemId = comment.TaskItemId
        };
    }
}