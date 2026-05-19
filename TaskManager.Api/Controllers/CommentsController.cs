using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.DTOs.Comments;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("api/tasks/{taskId:int}/comments")]
    public async Task<ActionResult<List<CommentDto>>> GetAllByTask(int taskId)
    {
        var userId = GetUserId();

        var comments = await _commentService.GetAllByTaskIdAsync(taskId, userId);

        return Ok(comments);
    }

    [HttpGet("api/comments/{id:int}")]
    public async Task<ActionResult<CommentDto>> GetById(int id)
    {
        var userId = GetUserId();

        var comment = await _commentService.GetByIdAsync(id, userId);

        return Ok(comment);
    }

    [HttpPost("api/tasks/{taskId:int}/comments")]
    public async Task<ActionResult<CommentDto>> Create(int taskId, CreateCommentDto request)
    {
        var userId = GetUserId();

        var comment = await _commentService.CreateAsync(taskId, request, userId);

        return CreatedAtAction(nameof(GetById), new { id = comment.Id }, comment);
    }

    [HttpPut("api/comments/{id:int}")]
    public async Task<ActionResult<CommentDto>> Update(int id, UpdateCommentDto request)
    {
        var userId = GetUserId();

        var comment = await _commentService.UpdateAsync(id, request, userId);

        return Ok(comment);
    }

    [HttpDelete("api/comments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        await _commentService.DeleteAsync(id, userId);

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