import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductsService } from './products.service';
import type { IFavoritesRepository } from '../repositories/favorites.repository';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('IFavoritesRepository')
    private readonly favoritesRepository: IFavoritesRepository,
    private readonly productsService: ProductsService,
  ) {}

  async toggle(productId: string, userId: string): Promise<FavoriteResponseDto> {
    const product = await this.productsService.findActiveEntityOrThrow(productId);
    const existing = await this.favoritesRepository.findByUserAndProduct(
      userId,
      productId,
    );

    if (existing) {
      await this.favoritesRepository.deleteByUserAndProduct(userId, productId);
      return {
        favoriteId: existing._id.toString(),
        productId,
        savedAt: existing.createdAt,
        product: {
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          paymentOptions: product.paymentOptions,
          imagesBase64: product.imagesBase64,
          isActive: product.isActive,
        },
      };
    }

    const favorite = await this.favoritesRepository.create({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
    });

    return {
      favoriteId: favorite._id.toString(),
      productId,
      savedAt: favorite.createdAt,
      product: {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        paymentOptions: product.paymentOptions,
        imagesBase64: product.imagesBase64,
        isActive: product.isActive,
      },
    };
  }

  async findByUserId(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoritesRepository.findByUserId(userId);

    return Promise.all(
      favorites.map(async (favorite) => {
        const product = await this.productsService.findActiveEntityOrThrow(
          favorite.productId.toString(),
        );

        return {
          favoriteId: favorite._id.toString(),
          productId: favorite.productId.toString(),
          savedAt: favorite.createdAt,
          product: {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            paymentOptions: product.paymentOptions,
            imagesBase64: product.imagesBase64,
            isActive: product.isActive,
          },
        };
      }),
    );
  }
}
