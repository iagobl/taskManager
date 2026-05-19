namespace TaskManager.Api.DTOs.Comments;

public class CommentDto
{
    public int Id { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public int TaskItemId { get; set; }
}