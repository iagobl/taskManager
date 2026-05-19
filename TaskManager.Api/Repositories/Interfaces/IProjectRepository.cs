using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories.Interfaces;

public interface IProjectRepository
{
    Task<List<Project>> GetAllByUserIdAsync(int userId);

    Task<Project?> GetByIdAndUserIdAsync(int projectId, int userId);

    Task<Project> CreateAsync(Project project);

    Task UpdateAsync(Project project);

    Task DeleteAsync(Project project);
}