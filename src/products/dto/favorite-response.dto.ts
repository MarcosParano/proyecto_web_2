import { PaymentOption } from '../constants/payment-option.enum';
import { ProductCategory } from '../constants/product-category.enum';

export class FavoriteResponseDto {
  favoriteId: string;
  productId: string;
  savedAt: Date;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    paymentOptions: PaymentOption[];
    imagesBase64: string[];
    isActive: boolean;
  };
}
