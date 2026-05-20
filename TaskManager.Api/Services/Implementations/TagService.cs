using TaskManager.Api.DTOs.Tags;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Services.Implementations;

public class TagService : ITagService
{
    private readonly ITagRepository _tagRepository;
    private readonly ITaskRepository _taskRepository;

    public TagService(
        ITagRepository tagRepository,
        ITaskRepository taskRepository)
    {
        _tagRepository = tagRepository;
        _taskRepository = taskRepository;
    }

    public async Task<List<TagDto>> GetAllAsync(int userId)
    {
        var tags = await _tagRepository.GetAllByUserIdAsync(userId);

        return tags.Select(MapToDto).ToList();
    }

    public async Task<TagDto> GetByIdAsync(int tagId, int userId)
    {
        var tag = await _tagRepository.GetByIdAndUserIdAsync(tagId, userId);

        if (tag is null)
        {
            throw new KeyNotFoundException("Tag not found.");
        }

        return MapToDto(tag);
    }

    public async Task<TagDto> CreateAsync(CreateTagDto request, int userId)
    {
        var tag = new Tag
        {
            Name = request.Name.Trim(),
            Color = request.Color?.Trim(),
            UserId = userId
        };

        var createdTag = await _tagRepository.CreateAsync(tag);

        return MapToDto(createdTag);
    }

    public async Task<TagDto> UpdateAsync(int tagId, UpdateTagDto request, int userId)
    {
        var tag = await _tagRepository.GetByIdAndUserIdAsync(tagId, userId);

        if (tag is null)
        {
            throw new KeyNotFoundException("Tag not found.");
        }

        tag.Name = request.Name.Trim();
        tag.Color = request.Color?.Trim();

        await _tagRepository.UpdateAsync(tag);

        return MapToDto(tag);
    }

    public async Task DeleteAsync(int tagId, int userId)
    {
        var tag = await _tagRepository.GetByIdAndUserIdAsync(tagId, userId);

        if (tag is null)
        {
            throw new KeyNotFoundException("Tag not found.");
        }

        await _tagRepository.DeleteAsync(tag);
    }

    public async Task AddTagToTaskAsync(int taskId, int tagId, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);

        if (task is null || task.Project.UserId != userId)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        var tag = await _tagRepository.GetByIdAndUserIdAsync(tagId, userId);

        if (tag is null)
        {
            throw new KeyNotFoundException("Tag not found.");
        }

        var exists = await _tagRepository.TaskTagExistsAsync(taskId, tagId);

        if (exists)
        {
            return;
        }

        var taskTag = new TaskTag
        {
            TaskItemId = taskId,
            TagId = tagId
        };

        await _tagRepository.AddTagToTaskAsync(taskTag);
    }

    public async Task RemoveTagFromTaskAsync(int taskId, int tagId, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);

        if (task is null || task.Project.UserId != userId)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        var tag = await _tagRepository.GetByIdAndUserIdAsync(tagId, userId);

        if (tag is null)
        {
            throw new KeyNotFoundException("Tag not found.");
        }

        var taskTag = await _tagRepository.GetTaskTagAsync(taskId, tagId);

        if (taskTag is null)
        {
            return;
        }

        await _tagRepository.RemoveTagFromTaskAsync(taskTag);
    }

    private static TagDto MapToDto(Tag tag)
    {
        return new TagDto
        {
            Id = tag.Id,
            Name = tag.Name,
            Color = tag.Color
        };
    }
}