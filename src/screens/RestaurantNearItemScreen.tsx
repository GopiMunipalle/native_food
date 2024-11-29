import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  RestaurantNearItemScreenNavigationProp,
  RestaurantNearItemScreenRouteProp,
} from '../types/navigationProps';
import apiConfig from '../config/apiConfig';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {
  BestChoice,
  BusinessDetails,
  categoryTypes,
  Review,
  TodaySpecial,
} from '../types/commonTypes';
import {images} from '../assets/images';
import {colors} from '../colors';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

export default function RestaurantNearItemScreen({
  navigation,
  route,
}: {
  navigation: RestaurantNearItemScreenNavigationProp;
  route: any;
}) {
  const token = useSelector((state: RootState) => state.authSlice.jwtToken);
  const categories = useSelector(
    (state: RootState) => state.categoriesSlice.categories,
  );
  const [businessDoc, setBusinessDoc] = useState<BusinessDetails>(
    {} as BusinessDetails,
  );
  const [todaySpecials, setTodaySpecials] = useState<TodaySpecial[]>([]);
  const [bestChoices, setBestChoices] = useState<BestChoice[]>([]);
  const [foodReviews, setFoodReviews] = useState<Review[]>([]);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [carouselData, setCarouselData] = useState<string[]>([]);
  const {id, distance, rating} = route.params;

  useEffect(() => {
    if (id === '') {
      Alert.alert('Error', 'No id provided');
      return;
    }
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const colors = ['#FFF3E5', '#FFE5E5'];
      const response = await fetch(apiConfig.GET_BUSINESS_BY_ID_URL + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', 'Failed to fetch business details');
      }
      let coloredBestChoices = data.data.bestChoices.map(
        (item: BestChoice, index: number) => {
          return {...item, color: colors[index % colors.length]};
        },
      );
      setBusinessDoc(data.data.business);
      setBestChoices(coloredBestChoices);
      setTodaySpecials(data.data.todaySpecials);
      setFoodReviews(data.data.foodReviews);
      setCarouselData(data.data.business.gallery.slice(0, 4));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch business details');
    }
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
          <Text style={styles.bestChoicePriceText}>₹{item.price}</Text>
          <TouchableOpacity
            style={[styles.bestChoicesItemIcon, {shadowColor: item.color}]}>
            <AntDesign name="plus" size={30} color={colors.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
            <Text style={styles.businessName}>
              {item.businessId.businessName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGallery = ({item}: {item: string}) => {
    return (
      <Image
        source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item}`}}
        style={styles.galleryImage}
      />
    );
  };

  const HeaderFrame = () => (
    <View style={styles.headerTitleContainer}>
      <TouchableOpacity
        style={styles.headerButtonContainer}
        onPress={() => navigation.goBack()}>
        <Image source={images.leftArrow} style={styles.leftArrowIcon} />
        <Text style={styles.profileText}>Nearby Restaurant</Text>
      </TouchableOpacity>
    </View>
  );

  const CarousalFrame = () => (
    <View style={styles.carouselContainer}>
      <Carousel
        data={carouselData}
        activeSlideAlignment="center"
        vertical={false}
        sliderWidth={responsiveWidth(100)}
        itemWidth={responsiveWidth(100)}
        renderItem={({item}) => (
          <Image
            source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item}`}}
            style={styles.carouselImage}
          />
        )}
        onSnapToItem={index => setActiveDotIndex(index)}
      />
      <Pagination
        dotsLength={carouselData.length}
        activeDotIndex={activeDotIndex}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: colors.red,
        }}
        inactiveDotStyle={{
          width: 14,
          height: 14,
          borderRadius: 5,
          marginHorizontal: 0,
          borderColor: colors.greenButton,
          borderWidth: 2,
          backgroundColor: colors.white,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );

  const RestaurantDetailsFrame = () => (
    <View style={styles.restuarentDetailsContainer}>
      <Text style={styles.restuarentName}>{businessDoc.businessName}</Text>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 7}}>
        <Entypo name="location-pin" size={17} color={colors.primary} />
        <Text style={styles.distance}>{(distance / 1000).toFixed(2)}km</Text>
        <StarRatingDisplay
          starStyle={{width: 7}}
          rating={Number(rating)}
          starSize={17}
          color="#FFC107"
        />
      </View>
      <Text style={styles.restuarentAddress}>{businessDoc.businessName}</Text>
    </View>
  );

  const handleFoodReviews = () => {
    navigation.navigate('ReviewScreen', {
      reviews: foodReviews,
    });
  };

  const FoodReviewsFrame = () => (
    <View style={styles.foodReviewsAndFavaritesContainer}>
      <TouchableOpacity style={styles.favaritesContainer}>
        <Text style={styles.favaritesText}>Favorite</Text>
        <Text style={styles.favaritesIcon}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.foodReviewsContainer}
        onPress={handleFoodReviews}>
        <Text style={styles.foodReviewsText}>Food Reviews</Text>
      </TouchableOpacity>
    </View>
  );

  const Categories = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryText}>Category</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={renderCategories}
        keyExtractor={item => item._id}
      />
    </View>
  );

  const BestChoicesFrame = () => (
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
            onPress={() =>
              navigation.navigate('RestaurantTodaySpecialsScreen', {
                todaySpecials: todaySpecials,
              })
            }>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Bai Jamjuree',
                fontWeight: '600',
                color: colors.tertiary,
              }}>
              View All
            </Text>
            <AntDesign name="arrowright" size={20} color={colors.greenButton} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const TodaySpecialsListFrame = () => (
    <View style={styles.todaySpecailContainer}>
      <FlatList
        data={todaySpecials.slice(0, 5)}
        renderItem={renderTodaySpecials}
        keyExtractor={item => item._id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const RestaurantTeamFrame = () => (
    <>
      <Text style={styles.teamTitleText}>Team</Text>
      <View style={styles.teamContainer}>
        <View style={styles.teamSubContainer}>
          <Image
            source={images.ceoImg}
            style={{height: 90, width: 90, top: -40, alignSelf: 'center'}}
          />
          <Text style={styles.teamNameText}>Prasad Singh</Text>
          <Text style={styles.teamRoleText}>Manager</Text>
        </View>
      </View>
    </>
  );

  const GalleryFrame = () => (
    <View style={styles.galleryContainer}>
      <Text style={styles.galleryText}>Gallery</Text>
      <FlatList
        data={businessDoc.gallery}
        renderItem={renderGallery}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const sections = [
    {id: 'header', component: HeaderFrame},
    {id: 'carousel', component: CarousalFrame},
    {id: 'restaurantDetails', component: RestaurantDetailsFrame},
    {id: 'foodReviews', component: FoodReviewsFrame},
    {id: 'categoris', component: Categories},
    {id: 'bestChoices', component: BestChoicesFrame},
    {id: 'todaySpecialsHeading', component: TodaySpecialsHeadingFrame},
    {id: 'todaySpecialsList', component: TodaySpecialsListFrame},
    {id: 'team', component: RestaurantTeamFrame},
    {id: 'gallery', component: GalleryFrame},
  ];

  return (
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
  carouselContainer: {
    height: responsiveHeight(30),
    width: responsiveWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    alignSelf: 'center',
    height: '100%',
    width: '90%',
    resizeMode: 'cover',
    marginBottom: 0,
    borderRadius: 10,
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
    height: 40,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: '#A2A3A5',
    overflow: 'hidden',
  },
  foodReviewsAndFavaritesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
    gap: 15,
  },
  favaritesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: colors.red,
    borderRadius: 8,
    width: '45%',
    height: 60,
  },
  foodReviewsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: '45%',
    height: 60,
    backgroundColor: colors.green,
    borderRadius: 8,
  },
  favaritesText: {
    fontFamily: 'Bai Jamjuree',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    color: colors.white,
    alignSelf: 'center',
  },
  favaritesIcon: {
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 45,
    color: colors.white,
    alignSelf: 'center',
  },
  foodReviewsText: {
    fontFamily: 'Bai Jamjuree',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.white,
  },
  categoryContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  categoryText: {
    fontFamily: 'Bai Jamjuree',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 40,
    color: colors.tertiary,
    marginLeft: 10,
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
  bestChoicesContainer: {
    paddingLeft: 20,
  },
  bestChoiceItem: {
    // backgroundColor: colors.red,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 20,
    width: responsiveWidth(30),
    height: 240,
  },
  bestChoiceItemSubContainer: {
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2.1,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 10,
  },
  bestChoicesImage: {
    height: '50%',
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
    top: -35,
  },
  bestChoicesText: {
    fontSize: 22,
    color: colors.tertiary,
    fontWeight: '600',
    fontFamily: 'Bai Jamjuree',
  },
  bestChoiceText: {
    top: -25,
    color: colors.tertiary,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 5,
    marginBottom: 10,
  },
  bestChoicePriceText: {
    top: -25,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
  bestChoicesItemIcon: {
    top: -15,
    backgroundColor: colors.white,
    borderRadius: 25,
    alignSelf: 'center',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
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
  businessName: {
    fontSize: 18,
    color: '#A2A3A5',
    textAlign: 'left',
    lineHeight: 40,
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
  teamContainer: {
    height: 140,
    width: 190,
    marginTop: 20,
    marginLeft: 20,
  },
  teamTitleText: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 40,
    color: colors.tertiary,
    marginLeft: 10,
  },
  teamSubContainer: {
    width: '100%',
    backgroundColor: '#FFF3E5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamNameText: {
    top: -40,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 40,
    color: colors.tertiary,
  },
  teamRoleText: {
    top: -40,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    color: colors.primary,
  },
  galleryContainer: {
    padding: 10,
  },
  galleryText: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 40,
    color: colors.tertiary,
  },
  galleryImage: {
    height: 116,
    width: '47%',
    margin: 5,
    borderRadius: 10,
  },
});
