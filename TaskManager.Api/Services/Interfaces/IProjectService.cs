using TaskManager.Api.DTOs.Projects;

namespace TaskManager.Api.Services.Interfaces;

public interface IProjectService
{
    Task<List<ProjectDto>> GetAllAsync(int userId);

    Task<ProjectDto> GetByIdAsync(int projectId, int userId);

    Task<ProjectDto> CreateAsync(CreateProjectDto request, int userId);

    Task<ProjectDto> UpdateAsync(int projectId, UpdateProjectDto request, int userId);

    Task DeleteAsync(int projectId, int userId);
}