export interface User {
  jwtToken: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    mobile_number: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  isLoggedIn: boolean;
}

export interface categoryTypes {
  _id: string;
  description: string;
  image: string;
  name: string;
  color?: string;
}

//best choices
export interface BestChoice {
  _id: string;
  name: string;
  description: string;
  category: string;
  categoryId: {
    _id: string;
    name: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  images: string[];
  subCategory: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  units: string;
  businessId: {
    location: {
      type: string;
      coordinates: number[];
    };
    _id: string;
    ownerId: string;
    businessName: string;
    ownerName: string;
    email: string;
    image: string;
    accountCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  isActive: boolean;
  packingCharge: number;
  sizes: string[];
  isTodaySpecial: boolean;
  specialDayDate: string | null;
  isBestChoice: boolean;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

//Today Special
export interface TodaySpecial {
  _id: string;
  businessId: {
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    _id: string;
    ownerId: string;
    businessName: string;
    ownerName: string;
    email: string;
    image: string;
    accountCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  category: string;
  categoryId: string;
  createdAt: Date;
  description: string;
  discountPrice: number;
  images: string[];
  isActive: boolean;
  isBestChoice: boolean;
  isTodaySpecial: boolean;
  name: string;
  price: number;
  quantity: number;
  sizes: string[];
  specialDayDate: Date;
  subCategory: any;
  units: string;
  updatedAt: Date;
}

//Restuarent
export interface RestuarentT {
  _id: string;
  ownerId: string;
  businessName: string;
  ownerName: string;
  email: string;
  image: string;
  accountCompleted: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
  distance: number;
  averageRating?: number;
}

//products
export interface productT {
  _id: string;
  businessId: string;
  businessName?: string;
  ownerName?: string;
  category: string;
  categoryId: string;
  description: string;
  images: [string];
  isActive: boolean;
  isBestChoice: boolean;
  isTodaySpecial: boolean;
  name: string;
  packingCharge: number;
  price: number;
  quantity: number;
  sizes: [];
  specialDayDate?: null;
  subCategory?: string;
  units?: string | number;
  weight?: number;
  discountPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

//searches
export interface searchT {
  _id: string;
  search: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Location {
  coordinates: [number, number];
  type: 'Point';
}

export interface BusinessDetails {
  _id: string;
  accountCompleted: boolean;
  businessName: string;
  createdAt: string;
  email: string;
  gallery: string[];
  image: string;
  location: Location;
  ownerId: string;
  ownerName: string;
  reviews: string[];
  updatedAt: string;
}

export interface Review {
  _id: string;
  createdAt: string;
  description: string;
  images: string[];
  rating: number;
  restaurantId: string;
  reviewerName: string;
  reviewerImage: string;
  status: boolean;
  updatedAt: string;
  product?: string;
}

// Define the types for the Products object
export interface Products {
  productDetails: productT[];
}

// Define the type for the Category
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface offerProductDetails {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  businessName: string;
  categoryName: string;
  businessId: string;
  units: string;
  isActive: boolean;
  quantity: number;
  sizes: string[];
  weight: number;
  color?: string;
  images: string[];
}

export interface BestOffer {
  _id: string;
  image: string;
  offerName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  productDetails: offerProductDetails[];
}

interface BestOffersResponse {
  bestOffers: BestOffer[];
}
