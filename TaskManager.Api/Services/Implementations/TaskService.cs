using TaskManager.Api.DTOs.Tasks;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Services.Implementations;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectRepository _projectRepository;

    public TaskService(
        ITaskRepository taskRepository,
        IProjectRepository projectRepository)
    {
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
    }

    public async Task<List<TaskDto>> GetAllByProjectIdAsync(int projectId, int userId)
    {
        var project = await _projectRepository.GetByIdAndUserIdAsync(projectId, userId);

        if (project is null)
        {
            throw new KeyNotFoundException("Project not found.");
        }

        var tasks = await _taskRepository.GetAllByProjectIdAsync(projectId);

        return tasks.Select(MapToDto).ToList();
    }

    public async Task<TaskDto> GetByIdAsync(int taskId, int userId)
    {
        var task = await GetTaskOwnedByUserAsync(taskId, userId);

        return MapToDto(task);
    }

    public async Task<TaskDto> CreateAsync(int projectId, CreateTaskDto request, int userId)
    {
        var project = await _projectRepository.GetByIdAndUserIdAsync(projectId, userId);

        if (project is null)
        {
            throw new KeyNotFoundException("Project not found.");
        }

        var task = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Priority = request.Priority.Trim(),
            DueDate = request.DueDate,
            CategoryId = request.CategoryId,
            ProjectId = projectId,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        var createdTask = await _taskRepository.CreateAsync(task);

        return MapToDto(createdTask);
    }

    public async Task<TaskDto> UpdateAsync(int taskId, UpdateTaskDto request, int userId)
    {
        var task = await GetTaskOwnedByUserAsync(taskId, userId);

        task.Title = request.Title.Trim();
        task.Description = request.Description?.Trim();
        task.Priority = request.Priority.Trim();
        task.DueDate = request.DueDate;
        task.CategoryId = request.CategoryId;

        await _taskRepository.UpdateAsync(task);

        var updatedTask = await GetTaskOwnedByUserAsync(taskId, userId);

        return MapToDto(updatedTask);
    }

    public async Task DeleteAsync(int taskId, int userId)
    {
        var task = await GetTaskOwnedByUserAsync(taskId, userId);

        await _taskRepository.DeleteAsync(task);
    }

    public async Task<TaskDto> CompleteAsync(int taskId, int userId)
    {
        var task = await GetTaskOwnedByUserAsync(taskId, userId);

        task.IsCompleted = true;
        task.CompletedAt = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(task);

        var updatedTask = await GetTaskOwnedByUserAsync(taskId, userId);

        return MapToDto(updatedTask);
    }

    public async Task<TaskDto> ReopenAsync(int taskId, int userId)
    {
        var task = await GetTaskOwnedByUserAsync(taskId, userId);

        task.IsCompleted = false;
        task.CompletedAt = null;

        await _taskRepository.UpdateAsync(task);

        var updatedTask = await GetTaskOwnedByUserAsync(taskId, userId);

        return MapToDto(updatedTask);
    }

    private async Task<TaskItem> GetTaskOwnedByUserAsync(int taskId, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);

        if (task is null || task.Project.UserId != userId)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        return task;
    }

    private static TaskDto MapToDto(TaskItem task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            CompletedAt = task.CompletedAt,
            ProjectId = task.ProjectId,
            CategoryId = task.CategoryId,
            Tags = task.TaskTags?
                .Where(taskTag => taskTag.Tag is not null)
                .Select(taskTag => new TaskTagDto
                {
                    Id = taskTag.Tag.Id,
                    Name = taskTag.Tag.Name,
                    Color = taskTag.Tag.Color
                })
                .OrderBy(tag => tag.Name)
                .ToList() ?? new List<TaskTagDto>()
        };
    }
}