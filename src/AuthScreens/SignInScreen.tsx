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
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/AuthSlice';

export default function SignInScreen({
  navigation,
}: {
  navigation: SignInScreenNavigationProp;
}) {
  const [country, setCountry] = useState(countries[0]);
  const [mobile_no, setMobile_no] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');

  const dispatch: AppDispatch = useDispatch();
  const handleLogin = async () => {
    const validators = loginValidator({
      mobile_no: mobile_no,
      password: password,
      role: role,
      country_code: country.code,
    });
    if (validators.length > 0) {
      Alert.alert('error', validators[0].error);
      return;
    }
    await dispatch(
      loginUser({
        mobile_no,
        password,
        role,
        country_code: country.code,
      }),
    );

    const token = useSelector((state: RootState) => state.authSlice.jwtToken);

    if (token) {
      navigation.navigate({name: 'BottomTabs', params: {screen: 'HomeScreen'}});
    } else {
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  // const onChangeCountry = (selectedCountry: any) => {
  // console.log(selectedCountry, 'signInScreen');
  // };

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
        <SelectEl countries={countries} onSelectCountry={setCountry} />
        <TextInput
          style={styles.input}
          placeholder="mobile no"
          keyboardType="phone-pad"
          onChangeText={text => setMobile_no(text)}
          value={mobile_no}
          placeholderTextColor={colors.tertiary}
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
          onTextChange={text => setPassword(text)}
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
          <TouchableOpacity
            onPress={() => setRole('CUSTOMER')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Fontisto
              name="radio-btn-active"
              size={20}
              color={role === 'CUSTOMER' ? 'red' : 'grey'}
            />
            <Text style={styles.radioButtonText}>Customer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.radioButton}>
          <TouchableOpacity
            onPress={() => setRole('SELLER')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Fontisto
              name="radio-btn-active"
              size={20}
              color={role === 'SELLER' ? 'red' : 'grey'}
            />
            <Text style={styles.radioButtonText}>Seller</Text>
          </TouchableOpacity>
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
    color: colors.tertiary,
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
    color: colors.tertiary,
  },
  forgotText: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 390,
    left: 20,
    width: 249,
    height: 50,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: colors.tertiary,
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
