using TaskManager.Api.DTOs.Categories;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories.Interfaces;
using TaskManager.Api.Services.Interfaces;

namespace TaskManager.Api.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<CategoryDto>> GetAllAsync(int userId)
    {
        var categories = await _categoryRepository.GetAllByUserIdAsync(userId);

        return categories.Select(MapToDto).ToList();
    }

    public async Task<CategoryDto> GetByIdAsync(int categoryId, int userId)
    {
        var category = await _categoryRepository.GetByIdAndUserIdAsync(categoryId, userId);

        if (category is null)
        {
            throw new KeyNotFoundException("Category not found.");
        }

        return MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto request, int userId)
    {
        var category = new Category
        {
            Name = request.Name.Trim(),
            Color = request.Color?.Trim(),
            UserId = userId
        };

        var createdCategory = await _categoryRepository.CreateAsync(category);

        return MapToDto(createdCategory);
    }

    public async Task<CategoryDto> UpdateAsync(int categoryId, UpdateCategoryDto request, int userId)
    {
        var category = await _categoryRepository.GetByIdAndUserIdAsync(categoryId, userId);

        if (category is null)
        {
            throw new KeyNotFoundException("Category not found.");
        }

        category.Name = request.Name.Trim();
        category.Color = request.Color?.Trim();

        await _categoryRepository.UpdateAsync(category);

        return MapToDto(category);
    }

    public async Task DeleteAsync(int categoryId, int userId)
    {
        var category = await _categoryRepository.GetByIdAndUserIdAsync(categoryId, userId);

        if (category is null)
        {
            throw new KeyNotFoundException("Category not found.");
        }

        await _categoryRepository.DeleteAsync(category);
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Color = category.Color
        };
    }
}