using TaskManager.Api.DTOs.Tags;

namespace TaskManager.Api.Services.Interfaces;

public interface ITagService
{
    Task<List<TagDto>> GetAllAsync(int userId);

    Task<TagDto> GetByIdAsync(int tagId, int userId);

    Task<TagDto> CreateAsync(CreateTagDto request, int userId);

    Task<TagDto> UpdateAsync(int tagId, UpdateTagDto request, int userId);

    Task DeleteAsync(int tagId, int userId);

    Task AddTagToTaskAsync(int taskId, int tagId, int userId);

    Task RemoveTagFromTaskAsync(int taskId, int tagId, int userId);
}