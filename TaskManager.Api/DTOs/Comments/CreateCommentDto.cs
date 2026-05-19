using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs.Comments;

public class CreateCommentDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;
}