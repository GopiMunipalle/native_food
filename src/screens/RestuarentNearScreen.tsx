import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {colors} from '../colors';
import {
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {images} from '../assets/images';
import {RestuarentNearScreenNavigationProp} from '../types/navigationProps';
import {RestuarentT} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';
import Entypo from 'react-native-vector-icons/Entypo';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

export default function RestuarentNearScreen({
  navigation,
}: {
  navigation: RestuarentNearScreenNavigationProp;
}) {
  const nearRestaurents = useSelector(
    (state: RootState) => state.restaurentSlice.restuarentNearBy,
  );

  const handleRestaurantNearby = ({
    id,
    distance,
    rating,
  }: {
    id: string;
    distance: number;
    rating: number;
  }) => {
    navigation.navigate('RestaurantNearItemScreen', {
      id: id,
      distance: distance,
      rating: rating,
    });
  };

  const renderRestaurantNearBy = ({item}: {item: RestuarentT}) => (
    <TouchableOpacity
      style={styles.restuarentNearByItem}
      onPress={() =>
        handleRestaurantNearby({
          id: item._id,
          distance: item.distance,
          rating: Number(item.averageRating),
        })
      }>
      <Image
        source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.image}`}}
        style={styles.restuarentImage}
      />
      <View style={styles.restuarentDetailsContainer}>
        <Text style={styles.restuarentName}>{item.businessName}</Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 7}}>
          <Entypo name="location-pin" size={17} color={colors.primary} />
          <Text style={styles.distance}>
            {(item.distance / 1000).toFixed(2)}km
          </Text>
          <StarRatingDisplay
            starStyle={{width: 7}}
            rating={3}
            starSize={17}
            color="#FFC107"
          />
        </View>
        <Text style={styles.restuarentAddress}>{item.businessName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity
          style={styles.headerButtonContainer}
          onPress={() => navigation.goBack()}>
          <Image source={images.leftArrow} style={styles.leftArrowIcon} />
          <Text style={styles.profileText}>Restaurant Nearby</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={nearRestaurents}
        renderItem={renderRestaurantNearBy}
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
    backgroundColor: colors.white,
    height: responsiveHeight(100),
    width: responsiveScreenWidth(100),
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
  restuarentName: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 40,
    color: colors.tertiary,
  },
  distance: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.red,
    marginRight: 20,
  },
  restuarentAddress: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: '#A2A3A5',
  },
  restuarentNearByItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    height: 270,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: colors.white,
    shadowColor: '#000000',
    elevation: 4,
  },
  restuarentImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: colors.green,
  },
  restuarentDetailsContainer: {
    paddingHorizontal: 10,
  },
});
