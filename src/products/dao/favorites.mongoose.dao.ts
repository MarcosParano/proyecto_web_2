import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from '../schemas/favorite.schema';

export interface IFavoritesDao {
  create(favoriteData: Partial<Favorite>): Promise<Favorite>;
  findByUserAndProduct(userId: string, productId: string): Promise<Favorite | null>;
  findByUserId(userId: string): Promise<Favorite[]>;
  deleteByUserAndProduct(userId: string, productId: string): Promise<boolean>;
}

@Injectable()
export class FavoritesMongooseDao implements IFavoritesDao {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<Favorite>,
  ) {}

  async create(favoriteData: Partial<Favorite>): Promise<Favorite> {
    const favorite = new this.favoriteModel(favoriteData);
    return favorite.save();
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Favorite | null> {
    return this.favoriteModel
      .findOne({
        userId: new Types.ObjectId(userId),
        productId: new Types.ObjectId(productId),
      })
      .exec();
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteByUserAndProduct(userId: string, productId: string): Promise<boolean> {
    const result = await this.favoriteModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    return result !== null;
  }
}
