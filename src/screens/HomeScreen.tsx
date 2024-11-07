import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
} from '../types/commonTypes';
import {fetchBestChoices} from '../redux/bestChoicesSlice';
import {fetchTodaySpecials} from '../redux/todaySpecialSlice';
import {fetchRestuarentNearBy} from '../redux/nearRestaurentSlice';
import {HomeScreenNavigationProp} from '../types/navigationProps';

export default function HomeScreen({
  navigation,
}: {
  navigation: HomeScreenNavigationProp;
}) {
  const categories = useSelector(
    (state: RootState) => state.categoriesSlice.categories,
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
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState<{
    jwtToken: string;
    user: {id: string; mobile_no: string; role: string; full_name: string};
  } | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    const initializeData = async () => {
      // await AsyncStorage.removeItem('user');
      // await AsyncStorage.removeItem('location');
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await Promise.all([
            dispatch(fetchAllCategories(parsedUser.jwtToken)),
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

  const renderRestuarentNearBy = ({item}: {item: RestuarentT}) => {
    console.log('item..................', item);
    return (
      <View>
        <Image
          source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.image}`}}
          style={{
            width: '100%',
            height: 100,
          }}
        />
        <Text>{item.businessName}</Text>
        <Text>{item.distance}</Text>
        <Text>{item.ownerName}</Text>
      </View>
    );
  };
  const renderTodaySpecials = ({item}: {item: TodaySpecial}) => {
    return (
      <View style={styles.todaySpecialItem}>
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
      </View>
    );
  };

  const renderBestChoices = ({item}: {item: BestChoice}) => {
    return (
      <View style={[styles.bestChoiceItem, {backgroundColor: item.color}]}>
        <View
          style={{
            width: '100%',
            height: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.images[0]}`}}
            style={{
              height: '90%',
              width: '90%',
              resizeMode: 'contain',
              borderRadius: 10,
              marginBottom: 0,
            }}
          />

          <View
            style={{
              width: '100%',
              height: '50%',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginTop: 0,
            }}>
            <Text
              style={[
                styles.bestChoiceText,
                {
                  fontSize: 20,
                  marginVertical: 5,
                  fontWeight: '600',
                  marginBottom: 10,
                  marginTop: 0,
                },
              ]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.bestChoicePriceText,
                {
                  fontSize: 18,
                  marginBottom: 5,
                },
              ]}>
              ₹{item.price}
            </Text>
            <Image source={images.salver} style={{height: 25, width: 25}} />
            <Text
              style={[
                styles.bestChoiceText,
                {
                  fontSize: 18,
                  color: colors.tertiary,
                },
              ]}>
              {item.businessId.businessName}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            backgroundColor: colors.white,
            borderRadius: 25,
            bottom: -15,
            alignSelf: 'center',
            shadowColor: '#000000',
            elevation: 5,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.26,
            shadowRadius: 3.84,
          }}>
          <AntDesing name="plus" size={30} color={colors.tertiary} />
        </TouchableOpacity>
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

  const renderCarousel = ({
    item,
  }: {
    item: {
      id: number;
      image: any;
      title: string;
      price: number;
      discountPrice: number;
      description: {firstPart: string; secondPart: string};
    };
  }) => {
    return (
      <TouchableOpacity
        style={styles.carouselItem}
        onPress={() => console.log('clicked offer carousel')}>
        <ImageBackground
          style={{
            width: '100%',
            height: 170,
            flexDirection: 'column',
          }}
          source={item.image}>
          <View style={{marginTop: 20, marginLeft: 20}}>
            <Text style={styles.carouselTitle}>{item.title}</Text>
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
                ${item.discountPrice}
              </Text>
              <Text
                style={{
                  color: '#DF201F',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Montserrat Alternates',
                  textDecorationLine: 'line-through',
                }}>
                ${item.price}
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
                {item.description.firstPart}
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Montserrat Alternates',
                }}>
                {item.description.secondPart}
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
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
              <Entypo name="location-pin" size={15} />
              <Text>{user?.user.id}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="notifications-none" size={30} />
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
          data={offersBanners}
          activeSlideAlignment="start"
          vertical={false}
          sliderWidth={responsiveWidth(100)}
          itemWidth={responsiveWidth(100)}
          renderItem={renderCarousel}
          onSnapToItem={index => setActiveSlide(index)}
        />
        <Pagination
          dotsLength={offersBanners.length}
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
      <View style={styles.bestChoicesContainer}>
        <Text style={styles.bestChoicesText}>Best Choices</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={bestChoices}
          renderItem={renderBestChoices}
          keyExtractor={item => item._id}
          persistentScrollbar
        />
      </View>
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
        data={todaySpecials}
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
          data={restuarentNearBy}
          renderItem={renderRestuarentNearBy}
          keyExtractor={item => item._id}
          horizontal={false}
          showsVerticalScrollIndicator={false}
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
    // flex: 1,
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
    // justifyContent: 'center',
    // alignItems: 'center',
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
  bestChoicesContainer: {
    paddingLeft: 20,
  },
  bestChoiceItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 15,
    marginBottom: 20,
    position: 'relative',
    width: responsiveWidth(35),
    height: responsiveHeight(30),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'visible',
  },
  bestChoicesText: {
    fontSize: 22,
    color: colors.tertiary,
    fontWeight: '600',
    fontFamily: 'Bai Jamjuree',
  },
  bestChoiceText: {
    color: colors.tertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  bestChoicePriceText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
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
  businessName: {
    fontSize: 18,
    color: '#A2A3A5',
    marginTop: 5,
    textAlign: 'left',
    lineHeight: 40,
  },
  restuarentNearByContainer: {},
});
