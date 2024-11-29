import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {colors} from '../colors';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {images} from '../assets/images';
import {TodaySpecialsScreenNavigationProp} from '../types/navigationProps';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {TodaySpecial} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';

export default function RestaurantTodaySpecials({
  navigation,
  route,
}: {
  navigation: TodaySpecialsScreenNavigationProp;
  route: any;
}) {
  const todaySpecials = route.params.todaySpecials;

  const renderTodaySpecials = ({item}: {item: TodaySpecial}) => {
    const handleTodaySpecialItem = (item: TodaySpecial) => {
      navigation.navigate('ProductDetailScreen', {item: item});
    };
    return (
      <TouchableOpacity
        style={styles.todaySpecialItem}
        onPress={() => handleTodaySpecialItem(item)}>
        <Image
          source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.images[0]}`}}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.discountPrice}>₹{item.discountPrice}</Text>
            <Text style={styles.originalPrice}>₹{item.price}</Text>
          </View>
          <View style={styles.detailsSubContainer}>
            <Image source={images.salver} style={{height: 25, width: 25}} />
            <Text style={styles.businessName}>
              {item.businessId.businessName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity
          style={styles.headerButtonContainer}
          onPress={() => navigation.goBack()}>
          <Image source={images.leftArrow} style={styles.leftArrowIcon} />
          <Text style={styles.profileText}>Today Special</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todaySpecials}
        contentContainerStyle={{
          alignSelf: 'center',
          width: '90%',
        }}
        renderItem={renderTodaySpecials}
        keyExtractor={item => item._id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
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
  todaySpecialItem: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFF',
    shadowColor: '#FFC268',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  image: {
    width: '30%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    width: '70%',
  },
  detailsSubContainer: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.tertiary,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DF201F',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    color: colors.primary,
  },
  businessName: {
    fontSize: 18,
    color: '#A2A3A5',
    textAlign: 'left',
    lineHeight: 40,
  },
});
