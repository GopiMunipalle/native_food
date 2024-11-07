export interface User {
  jwtToken: string;
  user: {
    _id: string;
    full_name: string;
    email: string;
    mobile_number: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
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
  sizes: [];
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
}
