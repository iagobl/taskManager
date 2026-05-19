using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories.Interfaces;

public interface ITagRepository
{
    Task<List<Tag>> GetAllByUserIdAsync(int userId);

    Task<Tag?> GetByIdAndUserIdAsync(int tagId, int userId);

    Task<Tag> CreateAsync(Tag tag);

    Task UpdateAsync(Tag tag);

    Task DeleteAsync(Tag tag);

    Task<bool> TaskTagExistsAsync(int taskId, int tagId);

    Task AddTagToTaskAsync(TaskTag taskTag);

    Task<TaskTag?> GetTaskTagAsync(int taskId, int tagId);

    Task RemoveTagFromTaskAsync(TaskTag taskTag);
}