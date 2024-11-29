import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {images} from '../assets/images';
import {colors} from '../colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {logoutUser} from '../redux/AuthSlice';
import {ProfileScreenNavigationProp} from '../types/navigationProps';

export default function ProfileScreen({
  navigation,
}: {
  navigation: ProfileScreenNavigationProp;
}) {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const dispatch: AppDispatch = useDispatch();
  const [route, setRoute] = React.useState('Home');

  const HeaderFrame = () => (
    <>
      <View style={styles.headerContainer}>
        <Image source={images.homePerson} style={{height: 140, width: 140}} />
        <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.tertiary,
            }}>
            Hi, {user.full_name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo name="location-pin" size={15} color={colors.lightGrey} />
            <Text style={{color: colors.lightGrey}}>{user.id}</Text>
          </View>
        </View>
      </View>
    </>
  );

  const handleHome = () => {
    setRoute('Home');
    navigation.navigate({
      name: 'BottomTabs',
      params: {screen: 'HomeScreen'},
    });
  };

  const handleOffers = () => {
    setRoute('Offers');
    navigation.navigate({
      name: 'BottomTabs',
      params: {screen: 'Offers'},
    });
  };

  const handlePrivacy = () => {
    setRoute('Privacy');
  };
  const handleTerms = () => {
    setRoute('Terms');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity
          style={styles.headerButtonContainer}
          onPress={() => navigation.goBack()}>
          <Image source={images.leftArrow} style={styles.leftArrowIcon} />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <HeaderFrame />
      <View style={styles.middleContainer}>
        <TouchableOpacity style={styles.middleCardSubContainer}>
          <Image source={images.shoppingBag} style={{height: 34, width: 34}} />
          <Text style={styles.middleContainerItemText}>Order</Text>
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity style={styles.middleCardSubContainer}>
          <Image source={images.profilelogo} style={{height: 34, width: 34}} />
          <Text style={styles.middleContainerItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity style={styles.middleCardSubContainer}>
          <Image
            source={images.favouriteslogo}
            style={{height: 34, width: 34}}
          />
          <Text style={styles.middleContainerItemText}>Favourite</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomContainerItem}
          onPress={handleHome}>
          <View
            style={
              route === 'Home'
                ? styles.bottomContainerItemIconActive
                : styles.bottomContainerItemIcon
            }>
            <MaterialIcons
              name="home"
              size={25}
              color={route === 'Home' ? colors.white : colors.tertiary}
            />
          </View>
          <Text
            style={[
              route === 'Home'
                ? styles.bottomContainerItemTextActive
                : styles.bottomContainerItemText,
            ]}>
            Home
          </Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity
          style={styles.bottomContainerItem}
          onPress={handleOffers}>
          <View
            style={
              route === 'Offers'
                ? styles.bottomContainerItemIconActive
                : styles.bottomContainerItemIcon
            }>
            <MaterialCommunityIcons
              name="brightness-percent"
              size={25}
              color={route === 'Offers' ? colors.white : colors.tertiary}
            />
          </View>
          <Text
            style={
              route === 'Offers'
                ? styles.bottomContainerItemTextActive
                : styles.bottomContainerItemText
            }>
            Offers
          </Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity
          style={styles.bottomContainerItem}
          onPress={handlePrivacy}>
          <View
            style={
              route === 'Privacy'
                ? styles.bottomContainerItemIconActive
                : styles.bottomContainerItemIcon
            }>
            <MaterialCommunityIcons
              name="message-alert"
              size={25}
              color={route === 'Privacy' ? colors.white : colors.tertiary}
            />
          </View>
          <Text
            style={
              route === 'Privacy'
                ? styles.bottomContainerItemTextActive
                : styles.bottomContainerItemText
            }>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity
          style={styles.bottomContainerItem}
          onPress={handleTerms}>
          <View
            style={
              route === 'Terms'
                ? styles.bottomContainerItemIconActive
                : styles.bottomContainerItemIcon
            }>
            <Fontisto
              name="file-1"
              size={25}
              color={route === 'Terms' ? colors.white : colors.tertiary}
            />
          </View>
          <Text
            style={
              route === 'Terms'
                ? styles.bottomContainerItemTextActive
                : styles.bottomContainerItemText
            }>
            Term And Conditions
          </Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine}></View>
        <TouchableOpacity
          style={styles.bottomContainerItem}
          onPress={handleLogout}>
          <View style={styles.bottomContainerItemIcon}>
            <MaterialIcons name="logout" size={25} color={colors.tertiary} />
          </View>
          <Text style={styles.bottomContainerItemText}>Logout</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: responsiveHeight(9),
    marginBottom: 20,
    shadowColor: '#FFC268',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: colors.white,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftArrowIcon: {
    height: 27,
    width: 27,
    color: colors.tertiary,
  },
  profileText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.tertiary,
    lineHeight: 40,
  },
  middleContainer: {
    height: 100,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    shadowColor: '#FFC268',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  middleCardSubContainer: {
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  verticleLine: {
    height: '80%',
    width: 1,
    backgroundColor: '#303235',
  },
  middleContainerItemText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
    color: '#303235',
    marginTop: 5,
  },
  bottomContainer: {
    padding: 20,
  },
  bottomContainerItemText: {
    fontSize: 21,
    fontWeight: '600',
    lineHeight: 80,
    color: colors.tertiary,
  },
  bottomContainerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomContainerItemIcon: {
    backgroundColor: '#FFE5E5',
    borderRadius: 50,
    padding: 15,
    alignSelf: 'center',
  },
  bottomContainerItemIconActive: {
    backgroundColor: colors.red,
    borderRadius: 50,
    padding: 15,
    alignSelf: 'center',
  },
  bottomContainerItemTextActive: {
    fontSize: 21,
    fontWeight: '600',
    lineHeight: 80,
    color: colors.red,
  },
  horizontalLine: {
    height: 1,
    // width: '80%',
    backgroundColor: '#C4C4C4',
  },
});
