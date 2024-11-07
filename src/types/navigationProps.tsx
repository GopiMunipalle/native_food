import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  OnBoarding: undefined;
  HomeScreen: undefined;
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
  BottomTabs: undefined;
  TodaySpecialsScreen: undefined;
  RestuarentNearScreen: undefined;
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
