import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

import SplashScreen from './src/splashScreens/SplashScreen';
import OnBoardingScreen from './src/OnBoardings/OnBoardingScreen';
import SignInScreen from './src/AuthScreens/SignInScreen';
import SignUpScreen from './src/AuthScreens/SignUpScreen';
import OtpVerification from './src/screens/OtpVerification';
import BottomTabs from './src/bottomScreens/BottomTabs';
import LocationPermissionScreen from './src/screens/LocationScreen';
import TodaySpecialsScreen from './src/screens/TodaySpecialsScreen';
import RestuarentNearScreen from './src/screens/RestuarentNearScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasLocation, setHasLocation] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const user = await AsyncStorage.getItem('user');
      const location = await AsyncStorage.getItem('location');
      const parsedUser = user ? JSON.parse(user) : null;
      const parsedLocation = location ? JSON.parse(location) : null;
      setIsAuthenticated(!!parsedUser?.jwtToken);
      setHasLocation(!!parsedLocation?.latitude && !!parsedLocation.longitude);
      setLoading(false);
    };

    initializeApp();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isAuthenticated ? (
            hasLocation ? (
              <Stack.Screen name="BottomTabs" component={BottomTabs} />
            ) : (
              <>
                <Stack.Screen
                  name="LocationPermissionScreen"
                  component={LocationPermissionScreen}
                />
                <Stack.Screen name="BottomTabs" component={BottomTabs} />
                <Stack.Screen
                  name="TodaySpecialsScreen"
                  component={TodaySpecialsScreen}
                />
                <Stack.Screen
                  name="RestuarentNearScreen"
                  component={RestuarentNearScreen}
                />
              </>
            )
          ) : (
            <>
              <Stack.Screen
                name="OnBoardingScreen"
                component={OnBoardingScreen}
              />
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen
                name="OtpVerification"
                component={OtpVerification}
              />
              <Stack.Screen name="BottomTabs" component={BottomTabs} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
