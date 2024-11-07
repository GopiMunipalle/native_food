import React from 'react';
import {
  View,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {images} from '../assets/images';
import {colors} from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {setCoordinates} from '../redux/homeSlice';
import {LocationScreenNavigationProp} from '../types/navigationProps';

const LocationPermissionScreen = ({
  navigation,
}: {
  navigation: LocationScreenNavigationProp;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Permission',
            message: 'We need your permission to access your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: "Don't Allow",
            buttonPositive: 'Allow',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to access your location.',
          );
        }
      } else {
        getLocation();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        console.log(position, 'Position');
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude, 'Coordinates from geolocation');

        await AsyncStorage.setItem(
          'location',
          JSON.stringify({lat: latitude, long: longitude}),
        );
        dispatch(setCoordinates({lat: latitude, long: longitude}));
        navigation.replace('BottomTabs');
      },
      error => {
        Alert.alert('Error', 'Unable to fetch location. ' + error.message);
        console.error('Geolocation error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      <Image source={images.location} style={{backgroundColor: '#FFFFFF'}} />
      <Text style={styles.title}>Allow Location</Text>
      <Text style={styles.subtitle}>
        We Need Your Permission To Access Your Location
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.allowButton}
          onPress={requestLocationPermission}>
          <Text style={styles.allowButtonText}>ALLOW LOCATION</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert('Error', 'Permission Denied')}>
          <Text style={styles.denyText}>Don't Allow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.tertiary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  allowButton: {
    padding: 15,
    backgroundColor: colors.greenButton,
    borderRadius: 60,
    marginBottom: 10,
    width: '80%',
  },
  allowButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  denyText: {
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LocationPermissionScreen;
