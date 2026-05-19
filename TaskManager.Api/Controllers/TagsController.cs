using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.DTOs.Tags;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TagsController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagsController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TagDto>>> GetAll()
    {
        var userId = GetUserId();

        var tags = await _tagService.GetAllAsync(userId);

        return Ok(tags);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TagDto>> GetById(int id)
    {
        var userId = GetUserId();

        var tag = await _tagService.GetByIdAsync(id, userId);

        return Ok(tag);
    }

    [HttpPost]
    public async Task<ActionResult<TagDto>> Create(CreateTagDto request)
    {
        var userId = GetUserId();

        var tag = await _tagService.CreateAsync(request, userId);

        return CreatedAtAction(nameof(GetById), new { id = tag.Id }, tag);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TagDto>> Update(int id, UpdateTagDto request)
    {
        var userId = GetUserId();

        var tag = await _tagService.UpdateAsync(id, request, userId);

        return Ok(tag);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        await _tagService.DeleteAsync(id, userId);

        return NoContent();
    }

    [HttpPost("/api/tasks/{taskId:int}/tags/{tagId:int}")]
    public async Task<IActionResult> AddTagToTask(int taskId, int tagId)
    {
        var userId = GetUserId();

        await _tagService.AddTagToTaskAsync(taskId, tagId, userId);

        return NoContent();
    }

    [HttpDelete("/api/tasks/{taskId:int}/tags/{tagId:int}")]
    public async Task<IActionResult> RemoveTagFromTask(int taskId, int tagId)
    {
        var userId = GetUserId();

        await _tagService.RemoveTagFromTaskAsync(taskId, tagId, userId);

        return NoContent();
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