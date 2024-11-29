import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {images} from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import apiConfig from '../config/apiConfig';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {colors} from '../colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {offersBanners} from '../utils/Constants';
import AntDesing from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {fetchAllCategories} from '../redux/categoriesSlice';
import {setCategories} from '../redux/categoriesSlice';
import {
  categoryTypes,
  BestChoice,
  TodaySpecial,
  RestuarentT,
  BestOffer,
} from '../types/commonTypes';
import {fetchBestChoices} from '../redux/bestChoicesSlice';
import {fetchTodaySpecials} from '../redux/todaySpecialSlice';
import {fetchRestuarentNearBy} from '../redux/nearRestaurentSlice';
import {HomeScreenNavigationProp} from '../types/navigationProps';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {fetchBestOffers, OfferData} from '../redux/bestOffersSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function HomeScreen({
  navigation,
}: {
  navigation: HomeScreenNavigationProp;
}) {
  const categories = useSelector(
    (state: RootState) => state.categoriesSlice.categories,
  );
  const bestOffers = useSelector(
    (state: RootState) => state.bestOfferSlice.bestOffers,
  );
  const bestChoices = useSelector(
    (state: RootState) => state.bestChoicesSlice.bestChoices,
  );
  const todaySpecials = useSelector(
    (state: RootState) => state.todaySpecialSlice.todaySpecials,
  );
  const restuarentNearBy = useSelector(
    (state: RootState) => state.restaurentSlice.restuarentNearBy,
  );

  const coordinates = useSelector(
    (state: RootState) => state.homeSlice.coordinates,
  );
  const todaySpecialItems = [...todaySpecials].slice(0, 5);
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState<{
    jwtToken: string;
    user: {id: string; mobile_no: string; role: string; full_name: string};
  } | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    const initializeData = async () => {
      // await AsyncStorage.removeItem('location');
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await Promise.all([
            dispatch(fetchAllCategories(parsedUser.jwtToken)),
            dispatch(fetchBestOffers(parsedUser.jwtToken)),
            dispatch(fetchBestChoices(parsedUser.jwtToken)),
            dispatch(fetchTodaySpecials(parsedUser.jwtToken)),
            dispatch(
              fetchRestuarentNearBy({
                token: parsedUser.jwtToken,
                lat: Number(coordinates.lat),
                long: Number(coordinates.long),
              }),
            ),
          ]);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        Alert.alert('Error', 'Failed to load initial data');
      }
    };
    initializeData();
  }, []);

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

  const renderRestuarentNearBy = ({item}: {item: RestuarentT}) => (
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 7,
          }}>
          <Entypo name="location-pin" size={17} color={colors.primary} />
          <Text style={styles.distance}>
            {(item.distance / 1000).toFixed(2)}km
          </Text>
          <StarRatingDisplay
            starStyle={{width: 7}}
            rating={Number(item.averageRating)}
            starSize={17}
            color="#FFC107"
          />
        </View>
        <Text style={styles.restuarentAddress}>{item.businessName}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleTodaySpecialItem = (data: TodaySpecial) => {
    navigation.navigate('ProductDetailScreen', {item: data});
  };

  const renderTodaySpecials = ({item}: {item: TodaySpecial}) => {
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
            <Text style={styles.todaySpecialsbusinessName}>
              {item.businessId.businessName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBestChoices = ({item}: {item: BestChoice}) => {
    return (
      <View style={styles.bestChoiceItem}>
        <View
          style={[
            styles.bestChoiceItemSubContainer,
            {backgroundColor: item.color, shadowColor: item.color},
          ]}>
          <Image
            source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.images[0]}`}}
            style={styles.bestChoicesImage}
          />
          <Text style={styles.bestChoiceText}>{item.name}</Text>
          <View style={styles.priceDetails}>
            {item.discountPrice ? (
              <>
                <Text style={styles.bestChoicePriceText}>
                  ₹{item.discountPrice}
                </Text>
                <Text
                  style={[
                    styles.bestChoicePriceText,
                    {textDecorationLine: 'line-through'},
                  ]}>
                  ₹{item.price}
                </Text>
              </>
            ) : (
              <Text style={styles.bestChoicePriceText}>₹{item.price}</Text>
            )}
          </View>
          <Image
            source={images.salver}
            style={{height: 25, width: 25, top: -15}}
          />
          <Text style={styles.businessName}>
            {item.businessId.businessName}
          </Text>
          <TouchableOpacity style={styles.bestChoicesItemIcon}>
            <AntDesign name="plus" size={25} color={colors.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategories = ({item}: {item: categoryTypes}) => {
    return (
      <TouchableOpacity
        style={[styles.categoryItem, {backgroundColor: item.color}]}>
        <Image
          source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.image}`}}
          style={{
            width: 100,
            height: '100%',
            resizeMode: 'cover',
          }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            marginLeft: 15,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleCarousel = (item: BestOffer) => {
    navigation.navigate('offerCarouselScreen', {item});
  };

  const renderCarousel = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.carouselItem}
        onPress={() => handleCarousel(item.bestOffer)}>
        <ImageBackground
          style={{
            width: '100%',
            height: 170,
            flexDirection: 'column',
          }}
          source={images.pizzabanner}>
          <View style={{marginTop: 20, marginLeft: 20}}>
            <Text style={styles.carouselTitle}>{item.bestOffer.offerName}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: '#DF201F',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Montserrat Alternates',
                }}>
                $
                {(item.bestOffer.productDetails[0] &&
                  item.bestOffer.productDetails[0].price) ||
                  150}
              </Text>
              <Text
                style={{
                  color: '#DF201F',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Montserrat Alternates',
                  textDecorationLine: 'line-through',
                }}>
                $
                {(item.bestOffer.productDetails[0] &&
                  item.bestOffer.productDetails[0].discountPrice) ||
                  100}
              </Text>
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
                right: 100,
                borderWidth: 1,
                borderStyle: 'solid',
                padding: 10,
                borderRadius: 35,
                borderColor: '#FFFFFF',
              }}>
              <Text
                style={{
                  color: '#DF201F',
                  fontWeight: '800',
                  fontSize: 18,
                  fontFamily: 'Montserrat Alternates',
                }}>
                {item.bestOffer.description.slice(0, 3)}
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Montserrat Alternates',
                }}>
                {item.bestOffer.description.slice(3)}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const HeaderFrame = () => (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('ProfileScreen')}>
          <Image source={images.homePerson} />
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.tertiary,
              }}>
              Hi, {user?.user.full_name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo
                name="location-pin"
                size={15}
                style={{color: colors.lightGrey}}
              />
              <Text style={{color: colors.lightGrey}}>{user?.user.id}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons
            name="notifications-none"
            size={30}
            style={{color: colors.tertiary}}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const CategoryFrame = () => (
    <>
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={renderCategories}
          keyExtractor={item => item._id}
        />
      </View>
    </>
  );

  const BestOfferCarouselFrame = () => (
    <>
      <View style={styles.bestOffersContainer}>
        <Carousel
          layout={'default'}
          data={bestOffers}
          activeSlideAlignment="start"
          vertical={false}
          sliderWidth={responsiveWidth(100)}
          itemWidth={responsiveWidth(100)}
          renderItem={renderCarousel}
          onSnapToItem={index => setActiveSlide(index)}
        />
        <Pagination
          dotsLength={bestOffers.length}
          activeDotIndex={activeSlide}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={styles.paginationContainer}
          inactiveDotStyle={styles.inactiveDotStyle}
          dotStyle={styles.dotStyle}
        />
      </View>
    </>
  );

  const BestChoicesFrame = () => (
    <>
      <Text style={styles.bestChoicesText}>Best Choices</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={bestChoices}
        renderItem={renderBestChoices}
        keyExtractor={item => item._id}
        persistentScrollbar
      />
    </>
  );

  const TodaySpecialsHeadingFrame = () => (
    <>
      <View style={styles.todaySpecailContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.todaySpecailText}>Today Special</Text>
          <TouchableOpacity
            style={styles.todaySpecialItemsContainer}
            onPress={() => navigation.navigate('TodaySpecialsScreen')}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Bai Jamjuree',
                fontWeight: '600',
                color: colors.tertiary,
              }}>
              View All
            </Text>
            <AntDesing name="arrowright" size={20} color={colors.greenButton} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const TodaySpecialsListFrame = () => (
    <View style={styles.todaySpecailContainer}>
      <FlatList
        data={todaySpecialItems}
        renderItem={renderTodaySpecials}
        keyExtractor={item => item._id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const RestuarentNearByHeadingFrame = () => (
    <View style={styles.restuarentNearByContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text style={styles.todaySpecailText}>Restaurant Nearby</Text>
        <TouchableOpacity
          style={styles.todaySpecialItemsContainer}
          onPress={() => navigation.navigate('RestuarentNearScreen')}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Bai Jamjuree',
              fontWeight: '600',
              color: colors.tertiary,
            }}>
            Map
          </Text>
          <AntDesing name="arrowright" size={20} color={colors.greenButton} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const RestuarentNearByListFrame = () => (
    <>
      <View style={styles.restuarentNearByContainer}>
        <FlatList
          style={{flexDirection: 'row'}}
          data={restuarentNearBy}
          renderItem={renderRestuarentNearBy}
          keyExtractor={item => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );

  const sections = [
    {id: 'header', component: HeaderFrame},
    {id: 'categories', component: CategoryFrame},
    {id: 'carousel', component: BestOfferCarouselFrame},
    {id: 'bestChoices', component: BestChoicesFrame},
    {id: 'todayHeadingSpecials', component: TodaySpecialsHeadingFrame},
    {id: 'todaySpecialsList', component: TodaySpecialsListFrame},
    {id: 'restuarentNearByHeading', component: RestuarentNearByHeadingFrame},
    {id: 'restuarentNearByList', component: RestuarentNearByListFrame},
  ];

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={sections}
          renderItem={({item}) => <item.component />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#FFFFFF',
            paddingBottom: 10,
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  categoryContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
    height: responsiveHeight(10),
    width: responsiveWidth(50),
    borderRadius: 10,
    margin: 10,
  },
  bestOffersContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  carouselItem: {
    width: 340,
    height: 170,
    borderRadius: 10,
    backgroundColor: '#212528',
  },
  carouselTitle: {
    width: 200,
    fontFamily: 'Bai Jamjuree',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'left',
    color: 'white',
  },
  paginationContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  inactiveDotStyle: {
    height: 20,
    width: 20,
    backgroundColor: colors.white,
    borderColor: '#94CD00',
    borderWidth: 5,
    borderStyle: 'solid',
    borderRadius: 10,
  },
  bestChoiceItem: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    width: 165,
    height: 314,
  },
  bestChoiceItemSubContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFD3D3',
  },
  bestChoicesImage: {
    height: '50%',
    width: '100%',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    top: -30,
  },
  bestChoicesText: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'Bai Jamjuree',
    lineHeight: 40,
    color: colors.tertiary,
    marginLeft: 10,
  },
  bestChoiceText: {
    top: -30,
    color: colors.tertiary,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 5,
    marginBottom: 10,
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bestChoicePriceText: {
    top: -25,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
  bestChoicesItemIcon: {
    top: -10,
    backgroundColor: colors.white,
    borderRadius: 25,
    alignSelf: 'center',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD3D3',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 15,
  },
  businessName: {
    top: -15,
    width: '60%',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Bai Jamjuree',
    lineHeight: 20,
    textAlign: 'center',
    color: colors.tertiary,
  },
  todaySpecailContainer: {
    flexDirection: 'column',
    padding: 10,
  },
  todaySpecialItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  todaySpecailText: {
    fontSize: 26,
    fontFamily: 'Bai Jamjuree',
    fontWeight: '700',
    color: colors.tertiary,
  },
  todaySpecialItem: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFF',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
  todaySpecialsbusinessName: {
    fontSize: 18,
    color: '#A2A3A5',
    textAlign: 'left',
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
  restuarentNearByContainer: {
    padding: 10,
    margin: 0,
  },
  restuarentNearByItem: {
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    width: 290,
    height: 270,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: colors.white,
    shadowColor: '#000000',
    elevation: 4,
    overflow: 'hidden',
  },
  restuarentImage: {
    top: -13,
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
