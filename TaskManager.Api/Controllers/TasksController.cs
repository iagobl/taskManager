using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.DTOs.Tasks;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet("api/projects/{projectId:int}/tasks")]
    public async Task<ActionResult<List<TaskDto>>> GetAllByProject(int projectId)
    {
        var userId = GetUserId();

        var tasks = await _taskService.GetAllByProjectIdAsync(projectId, userId);

        return Ok(tasks);
    }

    [HttpGet("api/tasks/{id:int}")]
    public async Task<ActionResult<TaskDto>> GetById(int id)
    {
        var userId = GetUserId();

        var task = await _taskService.GetByIdAsync(id, userId);

        return Ok(task);
    }

    [HttpPost("api/projects/{projectId:int}/tasks")]
    public async Task<ActionResult<TaskDto>> Create(int projectId, CreateTaskDto request)
    {
        var userId = GetUserId();

        var task = await _taskService.CreateAsync(projectId, request, userId);

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("api/tasks/{id:int}")]
    public async Task<ActionResult<TaskDto>> Update(int id, UpdateTaskDto request)
    {
        var userId = GetUserId();

        var task = await _taskService.UpdateAsync(id, request, userId);

        return Ok(task);
    }

    [HttpDelete("api/tasks/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        await _taskService.DeleteAsync(id, userId);

        return NoContent();
    }

    [HttpPatch("api/tasks/{id:int}/complete")]
    public async Task<ActionResult<TaskDto>> Complete(int id)
    {
        var userId = GetUserId();

        var task = await _taskService.CompleteAsync(id, userId);

        return Ok(task);
    }

    [HttpPatch("api/tasks/{id:int}/reopen")]
    public async Task<ActionResult<TaskDto>> Reopen(int id)
    {
        var userId = GetUserId();

        var task = await _taskService.ReopenAsync(id, userId);

        return Ok(task);
    }

    private int GetUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token.");
        }

        return userId;
    }
}