using TaskManager.Api.DTOs.Tasks;

namespace TaskManager.Api.Services.Interfaces;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllByProjectIdAsync(int projectId, int userId);

    Task<TaskDto> GetByIdAsync(int taskId, int userId);

    Task<TaskDto> CreateAsync(int projectId, CreateTaskDto request, int userId);

    Task<TaskDto> UpdateAsync(int taskId, UpdateTaskDto request, int userId);

    Task DeleteAsync(int taskId, int userId);

    Task<TaskDto> CompleteAsync(int taskId, int userId);

    Task<TaskDto> ReopenAsync(int taskId, int userId);
}