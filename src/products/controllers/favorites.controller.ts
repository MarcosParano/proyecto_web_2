import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { FavoritesService } from '../services/favorites.service';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';

@Controller('products/:productId/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async toggle(
    @Param('productId') productId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<FavoriteResponseDto> {
    return this.favoritesService.toggle(productId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMine(@CurrentUser('sub') userId: string): Promise<FavoriteResponseDto[]> {
    return this.favoritesService.findByUserId(userId);
  }
}
