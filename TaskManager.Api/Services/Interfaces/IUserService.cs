using TaskManager.Api.DTOs.Users;

namespace TaskManager.Api.Services.Interfaces;

public interface IUserService
{
    Task<UserProfileDto> GetCurrentUserAsync(int userId);
}