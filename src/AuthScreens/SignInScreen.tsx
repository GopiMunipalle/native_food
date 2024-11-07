import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {images} from '../assets/images/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {colors} from '../colors';
import {SelectEl} from '../customComponents/selectEl';
import {OtpInput} from 'react-native-otp-entry';
import {SignInScreenNavigationProp} from '../types/navigationProps';
import axios from 'axios';
import apiConfig from '../config/apiConfig';
import countries from '../utils/Constants';
import {loginValidator} from '../validations/userValidations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCountry,
  setEmail,
  setMobileNumber,
  setPassword,
  setRole,
  setUserData,
} from '../redux/AuthSlice';

export default function SignInScreen({
  navigation,
}: {
  navigation: SignInScreenNavigationProp;
}) {
  const authState = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const validators = loginValidator({
      mobile_no: authState.mobileNumber,
      password: authState.password,
      role: authState.role,
      country_code: authState.country.code,
    });
    if (validators.length > 0) {
      Alert.alert('error', validators[0].error);
      return;
    }
    try {
      const response = await fetch(apiConfig.LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_no: authState.mobileNumber,
          country_code: authState.country.code,
          role: authState.role,
          password: authState.password,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData.data, 'data');
        // setUserData(responseData.data);
        dispatch(setUserData(responseData.data));
        await AsyncStorage.setItem('user', JSON.stringify(responseData.data));
        navigation.navigate('BottomTabs');
      } else {
        Alert.alert('Error', responseData.error.error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const onChangeCountry = (selectedCountry: any) => {
    // setCountry(selectedCountry);
    dispatch(setCountry(selectedCountry));
    console.log(selectedCountry, 'signInScreen');
  };

  const RenderSelectedCountry = () => (
    <View style={styles.textContainer}>
      {authState.country && (
        <>
          <Image style={styles.image} source={authState.country.flag} />
          <Text style={styles.text}> {authState.country.code}</Text>
        </>
      )}
    </View>
  );

  return (
    <View>
      <ImageBackground source={images.loginbg} style={styles.container}>
        <View>
          <Image source={images.loginpizza} style={styles.logo} />
        </View>
      </ImageBackground>
      <View style={styles.titleTextContainer}>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 45,
            fontFamily: 'Bai Jamjuree',
            fontWeight: '700',
          }}>
          Login
        </Text>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: '700',
            lineHeight: 27.5,
          }}>
          Welcome Back!
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <RenderSelectedCountry />
        <SelectEl countries={countries} onSelectCountry={onChangeCountry} />
        <TextInput
          style={styles.input}
          placeholder="mobile no"
          keyboardType="phone-pad"
          onChangeText={text => dispatch(setMobileNumber(text))}
          value={authState.mobileNumber}
        />
        <FontAwesome6Icon
          style={{left: -20}}
          name="phone"
          size={20}
          color={colors.lightBlack}
        />
      </View>
      <View style={styles.passcodeContainer}>
        <Text style={styles.passcodeText}>Passcode</Text>
        <OtpInput
          numberOfDigits={6}
          type="alphanumeric"
          focusColor="green"
          focusStickBlinkingDuration={500}
          onTextChange={text => dispatch(setPassword(text))}
          onFilled={text => console.log(`password is ${text}`)}
          secureTextEntry={true}
          theme={{
            containerStyle: styles.passCodeSubContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
        <Text style={styles.forgotText}>forgot Passcode</Text>
      </View>
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioButton}>
          <TouchableOpacity onPress={() => dispatch(setRole('CUSTOMER'))}>
            <Fontisto
              name="radio-btn-active"
              size={20}
              color={authState.role === 'CUSTOMER' ? 'red' : 'grey'}
            />
          </TouchableOpacity>
          <Text style={styles.radioButtonText}>Customer</Text>
        </View>
        <View style={styles.radioButton}>
          <TouchableOpacity onPress={() => dispatch(setRole('SELLER'))}>
            <Fontisto
              name="radio-btn-active"
              size={20}
              color={authState.role === 'SELLER' ? 'red' : 'grey'}
            />
          </TouchableOpacity>
          <Text style={styles.radioButtonText}>Seller</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text
          style={styles.registerText}
          onPress={() => navigation.navigate('SignUpScreen')}>
          Register now?
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(50),
    width: responsiveWidth(100),
  },
  logo: {
    top: 49,
    left: 190,
  },
  titleTextContainer: {
    top: 272,
    left: 18,
  },
  inputContainer: {
    top: 330,
    left: 20,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  input: {
    width: '70%',
    height: 50,
    color: colors.tertiary,
    fontSize: 18,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '30%',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text: {
    color: colors.tertiary,
    fontSize: 18,
  },
  passcodeContainer: {
    top: 350,
    left: 20,
    width: '90%',
  },
  pinCodeContainer: {
    // width: '90%',
  },
  passCodeSubContainer: {
    width: '90%',
    marginTop: 10,
  },
  pinCodeText: {
    fontSize: 20,
  },
  focusStick: {
    backgroundColor: 'green',
  },
  activePinCodeContainer: {
    borderColor: 'green',
  },
  passcodeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  forgotText: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 5,
  },
  radioButtonContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 390,
    left: 20,
    width: 249,
    height: 50,
    // backgroundColor: '#FFFFFF',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: 430,
    left: 20,
    width: '90%',
    height: 50,
  },
  loginButton: {
    width: '100%',
    height: 70,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  loginText: {
    fontSize: 20,
    color: 'white',
  },
  registerText: {
    marginTop: 20,
    fontSize: 20,
    color: colors.tertiary,
    fontWeight: '600',
  },
});
