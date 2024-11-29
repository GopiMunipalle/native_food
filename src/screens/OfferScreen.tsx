import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {images} from '../assets/images';
import {
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {colors} from '../colors';
import apiConfig from '../config/apiConfig';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {RestuarentT, TodaySpecial} from '../types/commonTypes';
import {OfferScreenNavigationProp} from '../types/navigationProps';

export default function OfferScreen({
  navigation,
}: {
  navigation: OfferScreenNavigationProp;
}) {
  const nearRestaurants = useSelector(
    (state: RootState) => state.restaurentSlice.restuarentNearBy,
  );
  const token = useSelector((state: RootState) => state.authSlice.jwtToken);
  const restaurantIds = nearRestaurants.map((item: RestuarentT) => item._id);
  const [restaurantOffers, setRestaurantOffers] = useState<TodaySpecial[]>([]);

  useEffect(() => {
    fetchRestaurantNearOffers();
  }, [restaurantIds]);

  const fetchRestaurantNearOffers = async () => {
    try {
      const response = await fetch(apiConfig.NEAR_RESTAURANTS_OFFERS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({
          restaurantIds: restaurantIds,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', data.error.error);
      }
      setRestaurantOffers(data.data.products);
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  const handleItem = (item: TodaySpecial) => {
    navigation.navigate('ProductDetailScreen', {item: item});
  };
  const renderProducts = ({item}: {item: TodaySpecial}) => {
    return (
      <TouchableOpacity
        style={styles.todaySpecialItem}
        onPress={() => handleItem(item)}>
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
            <Image
              source={images.salver}
              style={{height: 25, width: 25, tintColor: '#A2A3A5'}}
            />
            <Text style={styles.businessName}>
              {item.businessId.businessName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={restaurantOffers}
      contentContainerStyle={styles.scrollContainer}
      ListHeaderComponent={
        <>
          <ImageBackground source={images.bstoffer1} style={styles.bgImage}>
            <View style={styles.bgImageSubContainer}>
              <Text style={styles.bgImageTextOne}>Get 30% off</Text>
              <Text style={styles.bgImageTextTwo}>Super Veg</Text>
              <Text style={styles.bgImageTextThree}>Delicious Dish</Text>
            </View>
          </ImageBackground>
          <ImageBackground source={images.bstoffer2} style={styles.bgImage}>
            <View style={styles.bgImageSubContainer}>
              <Text style={styles.bgImageTextOne}>Get 30% off</Text>
              <Text style={styles.bgImageTextTwo}>Best Veg</Text>
              <Text style={styles.bgImageTextThree}>Hamburger</Text>
            </View>
          </ImageBackground>
          <ImageBackground source={images.bstoffer3} style={styles.bgImage}>
            <View style={styles.bgImageSubContainer}>
              <Text style={styles.bgImageTextOne}>Get 30% off</Text>
              <Text style={styles.bgImageTextTwo}>Classic Chicken</Text>
              <Text style={styles.bgImageTextThree}>Wings</Text>
            </View>
          </ImageBackground>
          <Text style={styles.offersTitle}>Nearby Restaurant Offers</Text>
        </>
      }
      renderItem={renderProducts}
      keyExtractor={item => item._id}
      horizontal={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  bgImage: {
    resizeMode: 'cover',
    height: 130,
    width: '100%',
    marginBottom: 10,
    borderRadius: 20,
    justifyContent: 'flex-start',
  },
  bgImageSubContainer: {
    padding: 20,
  },
  bgImageTextOne: {
    fontFamily: 'Montserrat Alternates',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30,
    color: colors.white,
  },
  bgImageTextTwo: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  bgImageTextThree: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  offersTitle: {
    fontSize: 24,
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
