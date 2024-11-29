import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BestOffer, productT, Review, TodaySpecial} from './commonTypes';

export type RootStackParamList = {
  OnBoarding: undefined;
  HomeScreen: undefined;
  offerCarouselScreen: {item: BestOffer};
  SignInScreen: undefined;
  SignUpScreen: undefined;
  OtpVerification: {
    otpData: {
      country_code: string;
      mobile_no: string;
      otp: string;
      email: string;
      name: string;
    };
  };
  LocationPermissionScreen: undefined;
  BottomTabs: {
    screen:
      | 'HomeScreen'
      | 'searchScreen'
      | 'Offers'
      | 'cartScreen'
      | 'BottomTabs';
  };
  // BottomTabs: undefined;
  TodaySpecialsScreen: undefined;
  ProductDetailScreen: {
    item: TodaySpecial;
  };
  RestuarentNearScreen: undefined;
  ProfileScreen: undefined;
  RestaurantNearItemScreen: {
    id: string;
    distance: number;
    rating: number;
  };
  RestaurantTodaySpecialsScreen: {
    todaySpecials: TodaySpecial[];
  };
  ReviewScreen: {
    reviews: Review[];
  };
  searchScreen: undefined;
};

export type OnBoardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnBoarding'
>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;
export type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignInScreen'
>;

export type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUpScreen'
>;

export type OtpVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OtpVerification'
>;
export type OtpVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OtpVerification'
>;

export type LocationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LocationPermissionScreen'
>;

export type BottomTabsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BottomTabs'
>;

export type TodaySpecialsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TodaySpecialsScreen'
>;

export type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

export type TodaySpecialItemScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetailScreen'
>;
export type TodaySpecialItemRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetailScreen'
>;

export type RestuarentNearScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RestuarentNearScreen'
>;

export type RestaurantNearItemScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RestaurantNearItemScreen'
>;

export type RestaurantNearItemScreenRouteProp = RouteProp<
  RootStackParamList,
  'RestaurantNearItemScreen'
>;

export type RestaurantTodaySpecialsScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    'RestaurantTodaySpecialsScreen'
  >;

export type FoodReviewsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ReviewScreen'
>;

export type OfferScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'offerCarouselScreen'
>;

export type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'searchScreen'
>;
