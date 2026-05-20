using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;

namespace TaskManager.Api.Repositories.Implementations;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItem>> GetAllByProjectIdAsync(int projectId)
    {
        return await _context.Tasks
            .AsSplitQuery()
            .Include(task => task.Project)
            .Include(task => task.TaskTags)
                .ThenInclude(taskTag => taskTag.Tag)
            .Where(task => task.ProjectId == projectId)
            .OrderBy(task => task.IsCompleted)
            .ThenBy(task => task.DueDate)
            .ThenByDescending(task => task.CreatedAt)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(int taskId)
    {
        return await _context.Tasks
            .AsSplitQuery()
            .Include(task => task.Project)
            .Include(task => task.TaskTags)
                .ThenInclude(taskTag => taskTag.Tag)
            .FirstOrDefaultAsync(task => task.Id == taskId);
    }

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(task.Id) ?? task;
    }

    public async Task UpdateAsync(TaskItem task)
    {
        _context.Tasks.Update(task);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(TaskItem task)
    {
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
    }
}