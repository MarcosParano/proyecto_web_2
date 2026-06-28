import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from '../schemas/coupon.schema';

export interface ICouponsDao {
  create(couponData: Partial<Coupon>): Promise<Coupon>;
  findByCode(code: string): Promise<Coupon | null>;
  findAll(): Promise<Coupon[]>;
  findById(id: string): Promise<Coupon | null>;
  update(id: string, updateData: Partial<Coupon>): Promise<Coupon | null>;
}

@Injectable()
export class CouponsMongooseDao implements ICouponsDao {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<Coupon>,
  ) {}

  async create(couponData: Partial<Coupon>): Promise<Coupon> {
    const coupon = new this.couponModel(couponData);
    return coupon.save();
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.couponModel.findOne({ code }).exec();
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().exec();
  }

  async findById(id: string): Promise<Coupon | null> {
    return this.couponModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<Coupon>): Promise<Coupon | null> {
    return this.couponModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}
