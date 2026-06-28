import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from '../../users/services/users.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ProductCommentResponseDto } from '../dto/product-comment-response.dto';
import { ProductsService } from './products.service';
import type { IProductCommentsRepository } from '../repositories/product-comments.repository';
import { ProductComment } from '../schemas/product-comment.schema';

@Injectable()
export class ProductCommentsService {
  constructor(
    @Inject('IProductCommentsRepository')
    private readonly productCommentsRepository: IProductCommentsRepository,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    productId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<ProductCommentResponseDto> {
    await this.productsService.findActiveEntityOrThrow(productId);

    const comment = await this.productCommentsRepository.create({
      productId: new Types.ObjectId(productId),
      authorId: new Types.ObjectId(userId),
      message: createCommentDto.message,
    } as Partial<ProductComment>);

    return this.toCommentResponse(comment);
  }

  async findByProductId(productId: string): Promise<ProductCommentResponseDto[]> {
    await this.productsService.findActiveEntityOrThrow(productId);

    const comments = await this.productCommentsRepository.findByProductId(productId);

    return Promise.all(comments.map((comment) => this.toCommentResponse(comment)));
  }

  private async toCommentResponse(
    comment: ProductComment,
  ): Promise<ProductCommentResponseDto> {
    const author = await this.usersService.findById(comment.authorId.toString());

    if (!author) {
      throw new NotFoundException('Comment author not found');
    }

    return {
      id: comment._id.toString(),
      productId: comment.productId.toString(),
      authorId: comment.authorId.toString(),
      message: comment.message,
      author: {
        id: author.id,
        name: author.name,
        surname: author.surname,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
