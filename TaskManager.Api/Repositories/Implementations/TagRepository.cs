using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;

namespace TaskManager.Api.Repositories.Implementations;

public class TagRepository : ITagRepository
{
    private readonly AppDbContext _context;

    public TagRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tag>> GetAllByUserIdAsync(int userId)
    {
        return await _context.Tags
            .Where(t => t.UserId == userId)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Tag?> GetByIdAndUserIdAsync(int tagId, int userId)
    {
        return await _context.Tags
            .FirstOrDefaultAsync(t => t.Id == tagId && t.UserId == userId);
    }

    public async Task<Tag> CreateAsync(Tag tag)
    {
        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return tag;
    }

    public async Task UpdateAsync(Tag tag)
    {
        _context.Tags.Update(tag);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Tag tag)
    {
        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> TaskTagExistsAsync(int taskId, int tagId)
    {
        return await _context.TaskTags
            .AnyAsync(tt => tt.TaskItemId == taskId && tt.TagId == tagId);
    }

    public async Task AddTagToTaskAsync(TaskTag taskTag)
    {
        _context.TaskTags.Add(taskTag);
        await _context.SaveChangesAsync();
    }

    public async Task<TaskTag?> GetTaskTagAsync(int taskId, int tagId)
    {
        return await _context.TaskTags
            .FirstOrDefaultAsync(tt => tt.TaskItemId == taskId && tt.TagId == tagId);
    }

    public async Task RemoveTagFromTaskAsync(TaskTag taskTag)
    {
        _context.TaskTags.Remove(taskTag);
        await _context.SaveChangesAsync();
    }
}