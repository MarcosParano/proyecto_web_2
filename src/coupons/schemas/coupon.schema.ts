import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DiscountType } from '../constants/discount-type.enum';

@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ type: String, enum: DiscountType, required: true })
  discountType: DiscountType;

  @Prop({ type: Number, required: true, min: 0.01 })
  value: number;

  @Prop({ type: Date, required: false })
  expiresAt?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
