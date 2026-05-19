using TaskManager.Api.DTOs.Projects;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Services.Implementations;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;

    public ProjectService(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<List<ProjectDto>> GetAllAsync(int userId)
    {
        var projects = await _projectRepository.GetAllByUserIdAsync(userId);

        return projects.Select(MapToDto).ToList();
    }

    public async Task<ProjectDto> GetByIdAsync(int projectId, int userId)
    {
        var project = await _projectRepository.GetByIdAndUserIdAsync(projectId, userId);

        if (project is null)
        {
            throw new KeyNotFoundException("Project not found.");
        }

        return MapToDto(project);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto request, int userId)
    {
        var project = new Project
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var createdProject = await _projectRepository.CreateAsync(project);

        return MapToDto(createdProject);
    }

    public async Task<ProjectDto> UpdateAsync(int projectId, UpdateProjectDto request, int userId)
    {
        var project = await _projectRepository.GetByIdAndUserIdAsync(projectId, userId);

        if (project is null)
        {
            throw new KeyNotFoundException("Project not found.");
        }

        project.Name = request.Name.Trim();
        project.Description = request.Description?.Trim();

        await _projectRepository.UpdateAsync(project);

        return MapToDto(project);
    }

    public async Task DeleteAsync(int projectId, int userId)
    {
        var project = await _projectRepository.GetByIdAndUserIdAsync(projectId, userId);

        if (project is null)
        {
            throw new KeyNotFoundException("Project not found.");
        }

        await _projectRepository.DeleteAsync(project);
    }

    private static ProjectDto MapToDto(Project project)
    {
        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            TaskCount = project.Tasks.Count
        };
    }
}