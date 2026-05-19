using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllByProjectIdAsync(int projectId);

    Task<TaskItem?> GetByIdAsync(int taskId);

    Task<TaskItem> CreateAsync(TaskItem task);

    Task UpdateAsync(TaskItem task);

    Task DeleteAsync(TaskItem task);
}