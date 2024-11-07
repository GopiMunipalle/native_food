import {StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import React from 'react';
import {images} from '../assets/images/index';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export default function SplashScreen() {
  return (
    <ImageBackground
      style={styles.container}
      source={images.splashScreenBgImage}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={images.splashlogo} />
        <Text style={styles.text}>Food Delivery</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    fontFamily: 'Aladin',
  },
  logoContainer: {
    height: 170,
    width: 358,
  },
  logo: {
    top: 250,
    left: 76,
    resizeMode: 'contain',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Aladin',
    color: 'white',
    top: 280,
    left: 40,
    fontSize: 30,
    fontWeight: 'bold',
  },
});
