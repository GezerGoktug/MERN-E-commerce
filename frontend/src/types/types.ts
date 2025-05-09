export type SizeType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "XXLARGE";

export interface CartProductType {
  _id: string;
  size: SizeType;
  price: number;
  quantity: number;
  name: string;
  image: string;
}

export type ProductType = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export type ReviewType = {
  _id: string;
  content: string;
  rating: number;
  createdAt: Date;
  user: {
    _id: string;
    email: string;
    name: string;
    image: string;
  };
};

export type ProductDetailContentType = {
  _id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  description: string;
  reviewsCount: number;
  category: "Kids" | "Women" | "Men";
  subCategory: "Topwear" | "Bottomwear" | "Winterwear";
  __v: number;
  totalRating: number;
};

export type DataType = ProductDetailContentType & {
  comments: ReviewType[];
  relatedProducts: ProductType[];
  subImages: string[];
};

export interface IOrder {
  locationInfo: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  payment: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  totalPrice: number;
  paymentMethod: "STRIPE" | "CASH_ON_DELIVERY";
  createdAt: Date;
  products: (CartProductType & { product: string })[];
  __v: number;
}

export interface IPaginationResult<T> {
  totalPage: number;
  pageSize: number;
  current: number;
  hasNext: boolean;
  hasPrev: boolean;
  content: T[];
}
