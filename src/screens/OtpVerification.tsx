import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {images} from '../assets/images';
import {colors} from '../colors';
import {OtpInput} from 'react-native-otp-entry';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  OtpVerificationScreenNavigationProp,
  OtpVerificationScreenRouteProp,
} from '../types/navigationProps';
import apiConfig from '../config/apiConfig';

interface Props {
  params: {
    otpData: {
      country_code: string;
      mobile_no: string;
      otp: string;
      email?: string;
      name?: string;
    };
  };
}

export default function OtpVerification({
  route,
  navigation,
}: {
  route: any;
  navigation: OtpVerificationScreenNavigationProp;
}) {
  const [otp, setOtp] = useState<string | null>('');

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(apiConfig.VERIFY_OTP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
          mobile_no: route.params.otpData.mobile_no,
          country_code: route.params.otpData.country_code,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        Alert.alert('success', data.data.message);
        navigation.navigate('SignInScreen');
      } else {
        const responseData = await response.json();
        Alert.alert('error', responseData.error.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(apiConfig.SEND_OTP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_no: route.params.otpData.mobile_no,
          country_code: route.params.otpData.country_code,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data, 'data');
        const otpData = {
          country_code: route.params.otpData.country_code,
          mobile_no: route.params.otpData.mobile_no,
          otp: data.data.otp,
          email: route.params.otpData.email as string,
          name: route.params.otpData.name as string,
        };
        navigation.navigate('OtpVerification', {
          otpData,
        });
      } else {
        const responseData = await response.json();
        console.log(responseData);
        Alert.alert('error', responseData.error.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={images.verifyotpbg}
          style={[styles.backgroundImage, {opacity: 0.1}]}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={{
            fontFamily: 'Bai Jamjuree',
            color: colors.white,
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 40,
          }}>
          OTP Verification
        </Text>
        <Image style={styles.emailImage} source={images.emailpng} />
        <Text style={styles.otpVerificationText}>Enter The OTP Sent To</Text>
        <Text
          style={{
            fontFamily: 'Bai Jamjuree',
            color: colors.white,
            fontSize: 26,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 25,
          }}>
          {`${route.params.otpData.country_code} ${route.params.otpData.mobile_no}`}
        </Text>
        <OtpInput
          numberOfDigits={4}
          type="numeric"
          focusColor={colors.tertiary}
          focusStickBlinkingDuration={500}
          onTextChange={text => setOtp(text)}
          secureTextEntry={true}
          theme={{
            containerStyle: styles.passCodeSubContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResendOtp}>
          <Text style={styles.resendText}>Resend OTP</Text>
          <TouchableOpacity style={styles.reloadIcon}>
            <AntDesign name="reload1" size={20} color={colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleVerifyOtp}>
          <Text
            style={{
              fontFamily: 'Bai Jamjuree',
              color: colors.white,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 27.5,
              textAlign: 'center',
            }}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: responsiveHeight(7),
    // zIndex: 1,
    // marginBottom: 120,
  },
  otpVerificationText: {
    fontFamily: 'Bai Jamjuree',
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
  },
  emailImage: {
    height: 126,
    width: 126,
    marginBottom: 40,
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
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeContainer: {
    width: 60,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.lightTextColor,
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
    // borderColor: colors.tertiary,
    borderWidth: 1,
  },
  resendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reloadIcon: {
    backgroundColor: '#be0605',
    borderRadius: 60,
    padding: 10,
  },
  resendText: {
    fontFamily: 'Montserrat Alternates',
    fontWeight: '600',
    fontSize: 18,
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.greenButton,
    borderRadius: 60,
    height: 75,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
    top: 150,
  },
});
