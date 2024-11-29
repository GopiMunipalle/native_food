import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState, store} from './src/redux/store';

import SplashScreen from './src/splashScreens/SplashScreen';
import OnBoardingScreen from './src/OnBoardings/OnBoardingScreen';
import SignInScreen from './src/AuthScreens/SignInScreen';
import SignUpScreen from './src/AuthScreens/SignUpScreen';
import OtpVerification from './src/screens/OtpVerification';
import BottomTabs from './src/bottomScreens/BottomTabs';
import LocationPermissionScreen from './src/screens/LocationScreen';
import TodaySpecialsScreen from './src/screens/TodaySpecialsScreen';
import RestuarentNearScreen from './src/screens/RestuarentNearScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetails from './src/screens/productDetailsScreen';
import RestaurantNearItemScreen from './src/screens/RestaurantNearItemScreen';
import RestaurantTodaySpecials from './src/screens/RestaurantTodaySpecials';
import ReviewsScreen from './src/screens/ReviewsScreen';
import {initializeData, setUser} from './src/redux/AuthSlice';
import OfferCarousel from './src/screens/OfferCarousel';

const Stack = createNativeStackNavigator();

const options = {
  gestureEnabled: true,
  transitionSpec: {
    open: {animation: 'timing', config: {duration: 300}},
    close: {animation: 'timing', config: {duration: 300}},
  },
};

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen
        name="TodaySpecialsScreen"
        component={TodaySpecialsScreen}
        options={options}
      />
      <Stack.Screen
        name="RestuarentNearScreen"
        component={RestuarentNearScreen}
        options={options}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetails} />
      <Stack.Screen
        name="RestaurantNearItemScreen"
        component={RestaurantNearItemScreen}
      />
      <Stack.Screen
        name="RestaurantTodaySpecialsScreen"
        component={RestaurantTodaySpecials}
      />
      <Stack.Screen name="ReviewScreen" component={ReviewsScreen} />
      <Stack.Screen name="offerCarouselScreen" component={OfferCarousel} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
    </Stack.Navigator>
  );
};

const RootNavigation = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.authSlice.jwtToken);
  useEffect(() => {
    const initializeState = async () => {
      const data = await initializeData();
      if (data) {
        dispatch(setUser(data));
      }
      setLoading(false);
    };
    initializeState();
  }, [dispatch]);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {token === '' ? <AuthStack /> : <MyStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
