import { DiscountType } from '../constants/discount-type.enum';

export class CouponResponseDto {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
