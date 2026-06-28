import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductComment } from '../schemas/product-comment.schema';

export interface IProductCommentsDao {
  create(commentData: Partial<ProductComment>): Promise<ProductComment>;
  findByProductId(productId: string): Promise<ProductComment[]>;
}

@Injectable()
export class ProductCommentsMongooseDao implements IProductCommentsDao {
  constructor(
    @InjectModel(ProductComment.name)
    private readonly productCommentModel: Model<ProductComment>,
  ) {}

  async create(commentData: Partial<ProductComment>): Promise<ProductComment> {
    const comment = new this.productCommentModel(commentData);
    return comment.save();
  }

  async findByProductId(productId: string): Promise<ProductComment[]> {
    return this.productCommentModel
      .find({ productId: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
