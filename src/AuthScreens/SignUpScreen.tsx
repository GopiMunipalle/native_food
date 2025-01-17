import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {images} from '../assets/images';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {colors} from '../colors';
import {SelectEl} from '../customComponents/selectEl';
import countries, {states} from '../utils/Constants';
import {OtpInput} from 'react-native-otp-entry';
import CustomDropdown from '../customComponents/Dropdown';
import CheckBox from 'react-native-check-box';
import {SignUpScreenNavigationProp} from '../types/navigationProps';
import Fontisto from 'react-native-vector-icons/Fontisto';
import apiConfig from '../config/apiConfig';
import {signUpValidator} from '../validations/userValidations';
import OtpVerification from '../screens/OtpVerification';

interface Country {
  code: string;
  flag: any;
  name: string;
}

interface SignUpFormData {
  name: string;
  mobile_no: string;
  email: string;
  passcode: string;
  confirmPasscode?: string;
  state: string;
  agreedToTerms: boolean;
  role: string;
  otp?: string;
}

interface props {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({navigation}: props) {
  const [authState, setAuthState] = useState<SignUpFormData>({
    name: '',
    mobile_no: '',
    email: '',
    passcode: '',
    confirmPasscode: '',
    state: '',
    agreedToTerms: false,
    role: 'CUSTOMER',
    otp: '',
  });
  const [country, setCountry] = useState<Country>(countries[0]);

  const fetchSendOtp = async () => {
    try {
      const response = await fetch(apiConfig.SEND_OTP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_no: authState.mobile_no,
          country_code: country.code,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // dispatch(setOtp(data.data.otp));
        return data.data.otp;
      } else {
        const responseData = await response.json();
        Alert.alert('error', responseData.error.error);
      }
    } catch (error: any) {
      Alert.alert('error at otp', 'Something went wrong');
    }
  };

  const handleSubmit = async () => {
    try {
      const validationResponse = signUpValidator({
        name: authState.name,
        mobile_no: authState.mobile_no,
        email: authState.email,
        password: authState.passcode,
        confirmPassword: authState.confirmPasscode as string,
        state: authState.state || '',
        country_code: country.code,
        role: authState.role,
      });
      if (validationResponse.length > 0) {
        Alert.alert('error', validationResponse[0].error);
        return;
      }

      const response = await fetch(apiConfig.SIGNUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: authState.name,
          mobile_no: authState.mobile_no,
          email: authState.email,
          password: authState.passcode,
          state: authState.state,
          country_code: country.code,
          role: authState.role,
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        const otp = await fetchSendOtp();
        const otpData = {
          country_code: country.code,
          mobile_no: authState.mobile_no,
          otp: otp,
          email: authState.email as string,
          name: authState.name as string,
        };

        navigation.navigate('OtpVerification', {otpData});
      } else if (
        responseData.error.error === 'User Already Exists with this email' ||
        responseData.error.error ===
          'User Already Exists with this mobile number'
      ) {
        const otp = await fetchSendOtp();
        const otpData = {
          country_code: country.code,
          mobile_no: authState.mobile_no,
          otp: otp,
          email: authState.email as string,
          name: authState.name as string,
        };
        navigation.navigate('OtpVerification', {otpData});
      } else {
        console.log('responseData', responseData.error);
        Alert.alert('Error', responseData.error.error);
      }
    } catch (error) {
      console.log('catch-error', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={images.signUpbg} style={styles.bgPattern}>
        <View style={styles.registerTextContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <FontAwesome6Icon
              name="angle-left"
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>
          <Text style={styles.registerText}>Register</Text>
        </View>
      </ImageBackground>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Name"
            style={styles.input}
            onChangeText={text => setAuthState({...authState, name: text})}
            value={authState.name}
            placeholderTextColor={colors.tertiary}
          />
          <FontAwesome6Icon name="user" size={24} color={colors.tertiary} />
        </View>

        <View style={styles.inputWrapper}>
          <SelectEl
            countries={countries}
            onSelectCountry={(selectedCountry: Country) =>
              setCountry(selectedCountry)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            onChangeText={text => setAuthState({...authState, mobile_no: text})}
            value={authState.mobile_no}
            placeholderTextColor={colors.tertiary}
          />
          <FontAwesome6Icon name="phone" size={20} color={colors.tertiary} />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email Id"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text => setAuthState({...authState, email: text})}
            value={authState.email}
            placeholderTextColor={colors.tertiary}
          />
          <MaterialCommunityIcons
            name="email"
            size={20}
            color={colors.tertiary}
          />
        </View>

        <View style={styles.passcodeContainer}>
          <Text style={styles.passcodeText}>Passcode</Text>
          <OtpInput
            numberOfDigits={6}
            type="alphanumeric"
            focusColor={colors.tertiary}
            focusStickBlinkingDuration={500}
            onTextChange={text => setAuthState({...authState, passcode: text})}
            secureTextEntry={true}
            theme={{
              containerStyle: styles.passCodeSubContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
          <Text style={styles.passcodeText}>Confirm Passcode</Text>
          <OtpInput
            numberOfDigits={6}
            type="alphanumeric"
            focusColor={colors.tertiary}
            focusStickBlinkingDuration={500}
            onTextChange={text =>
              setAuthState({...authState, confirmPasscode: text})
            }
            secureTextEntry={true}
            theme={{
              containerStyle: styles.passCodeSubContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
        </View>
        <View style={styles.inputWrapper}>
          <CustomDropdown
            options={states}
            placeholder="Select State"
            onChange={selectedState =>
              setAuthState({...authState, state: selectedState})
            }
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButton}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => setAuthState({...authState, role: 'CUSTOMER'})}>
              <Fontisto
                name="radio-btn-active"
                size={20}
                color={authState.role === 'CUSTOMER' ? 'red' : 'grey'}
              />
              <Text style={styles.radioButtonText}>Customer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.radioButton}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => setAuthState({...authState, role: 'SELLER'})}>
              <Fontisto
                name="radio-btn-active"
                size={20}
                color={authState.role === 'SELLER' ? 'red' : 'grey'}
              />
              <Text style={styles.radioButtonText}>Seller</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.termsContainer}>
          <CheckBox
            style={styles.checkbox}
            onClick={() =>
              setAuthState({
                ...authState,
                agreedToTerms: !authState.agreedToTerms,
              })
            }
            rightTextView={
              <Text style={styles.checkboxText}>Agree Terms & Conditions</Text>
            }
            isChecked={authState.agreedToTerms}
            checkBoxColor={
              authState.agreedToTerms ? colors.red : colors.tertiary
            }
          />
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!authState.agreedToTerms}>
          <Text style={styles.submitButtonText}>REGISTER NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  bgPattern: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
    marginBottom: 15,
  },
  backBtn: {
    padding: 10,
  },
  registerText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
  },
  registerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 65,
    paddingLeft: 20,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.tertiary,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  text: {
    color: colors.tertiary,
    fontSize: 18,
  },
  passcodeContainer: {
    marginBottom: 20,
  },
  passcodeText: {
    color: colors.tertiary,
    fontSize: 18,
    marginBottom: 10,
  },
  passCodeSubContainer: {
    marginBottom: 20,
  },
  pinCodeContainer: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: colors.lightTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeText: {
    color: colors.tertiary,
    fontSize: 18,
  },
  focusStick: {
    width: 2,
    height: 45,
    backgroundColor: colors.tertiary,
  },
  activePinCodeContainer: {
    borderColor: colors.tertiary,
    borderWidth: 1,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 249,
    // height: 50,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: colors.tertiary,
  },
  termsContainer: {
    marginVertical: 20,
  },
  checkbox: {
    padding: 10,
  },
  checkboxText: {
    color: colors.tertiary,
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: colors.greenButton,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    // marginTop: 10,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
