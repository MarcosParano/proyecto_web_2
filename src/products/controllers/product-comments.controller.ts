import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { ProductCommentsService } from '../services/product-comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ProductCommentResponseDto } from '../dto/product-comment-response.dto';

@Controller('products/:productId/comments')
export class ProductCommentsController {
  constructor(private readonly productCommentsService: ProductCommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('productId') productId: string,
    @CurrentUser('sub') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<ProductCommentResponseDto> {
    return this.productCommentsService.create(productId, userId, createCommentDto);
  }

  @Get()
  async findByProductId(
    @Param('productId') productId: string,
  ): Promise<ProductCommentResponseDto[]> {
    return this.productCommentsService.findByProductId(productId);
  }
}
