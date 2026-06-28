import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ProductsController } from './controllers/products.controller';
import { PublicProductsController } from './controllers/public-products.controller';
import { ProductCommentsController } from './controllers/product-comments.controller';
import { FavoritesController } from './controllers/favorites.controller';
import { ProductsMongooseDao } from './dao/products.mongoose.dao';
import { ProductCommentsMongooseDao } from './dao/product-comments.mongoose.dao';
import { FavoritesMongooseDao } from './dao/favorites.mongoose.dao';
import { ProductsRepository } from './repositories/products.repository';
import { ProductCommentsRepository } from './repositories/product-comments.repository';
import { FavoritesRepository } from './repositories/favorites.repository';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductComment, ProductCommentSchema } from './schemas/product-comment.schema';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { ProductsService } from './services/products.service';
import { ProductCommentsService } from './services/product-comments.service';
import { FavoritesService } from './services/favorites.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductComment.name, schema: ProductCommentSchema },
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  controllers: [
    ProductsController,
    PublicProductsController,
    ProductCommentsController,
    FavoritesController,
  ],
  providers: [
    ProductsService,
    ProductCommentsService,
    FavoritesService,
    {
      provide: 'IProductsDao',
      useClass: ProductsMongooseDao,
    },
    {
      provide: 'IProductsRepository',
      useClass: ProductsRepository,
    },
    {
      provide: 'IProductCommentsDao',
      useClass: ProductCommentsMongooseDao,
    },
    {
      provide: 'IProductCommentsRepository',
      useClass: ProductCommentsRepository,
    },
    {
      provide: 'IFavoritesDao',
      useClass: FavoritesMongooseDao,
    },
    {
      provide: 'IFavoritesRepository',
      useClass: FavoritesRepository,
    },
  ],
  exports: [ProductsService, ProductCommentsService, FavoritesService],
})
export class ProductsModule {}