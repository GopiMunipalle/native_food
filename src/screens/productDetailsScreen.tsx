import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  TodaySpecialItemRouteProp,
  TodaySpecialItemScreenNavigationProp,
} from '../types/navigationProps';
import {images} from '../assets/images';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {colors} from '../colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import apiConfig from '../config/apiConfig';
import {TodaySpecial} from '../types/commonTypes';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

export default function TodaySpecialItem({
  navigation,
  route,
}: {
  navigation: TodaySpecialItemScreenNavigationProp;
  route: any;
}) {
  const {item}: {item: TodaySpecial} = route.params;
  const token = useSelector((state: RootState) => state.authSlice.jwtToken);
  const bgColors = ['#FFF3E5', '#FFE5E5'];
  const [favorite, setFavorite] = useState<boolean>(false);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [quantity, setQuantity] = useState<string | number>('01');
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const handleAddToCart = async () => {
    try {
      const response = await fetch(apiConfig.ADD_TO_CART_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({
          productId: item._id,
          quantity: Number(quantity),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        Alert.alert('Error', 'Error fetching add to cart');
      }
      Alert.alert('Success', 'Item Added To Cart');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const handleDecreaseQuantity = (quantity: string | number) => {
    if (Number(quantity) > 1) {
      setQuantity(Number(quantity) - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          {backgroundColor: bgColors[activeDotIndex % bgColors.length]},
        ]}>
        <View style={styles.topIconsContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.leftArrow} style={styles.topIconLogo} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topIconLogo}
            onPress={() => setFavorite(!favorite)}>
            {favorite ? (
              <MaterialIcons name="favorite" size={20} color={colors.red} />
            ) : (
              <MaterialIcons
                name="favorite-outline"
                size={20}
                color={colors.tertiary}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            data={item.images}
            activeSlideAlignment="start"
            vertical={false}
            sliderWidth={responsiveWidth(100)}
            itemWidth={responsiveWidth(95)}
            renderItem={({item}) => (
              <Image
                source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item}`}}
                style={styles.carouselImage}
              />
            )}
            onSnapToItem={index => setActiveDotIndex(index)}
          />
          <Pagination
            dotsLength={item.images.slice(0, 4).length}
            activeDotIndex={activeDotIndex}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: colors.red,
            }}
            inactiveDotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: colors.white,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.pricesContainer}>
          {item.discountPrice ? (
            <>
              <Text style={styles.discountPrice}>₹{item.discountPrice}</Text>
              <Text
                style={[styles.price, {textDecorationLine: 'line-through'}]}>
                ₹{item.price}
              </Text>
            </>
          ) : (
            <Text style={styles.discountPrice}>₹{item.price}</Text>
          )}
        </View>
        <View style={styles.sizesQuantityContainer}>
          <View style={[styles.sizesContainer]}>
            <Text style={styles.sizesHeading}>Size</Text>
            <View style={styles.sizesSubContainer}>
              <TouchableOpacity
                style={
                  selectedSize === item.sizes[0]
                    ? styles.selectedSizeButton
                    : styles.sizeButton
                }
                onPress={() => setSelectedSize(item.sizes[0])}>
                <Text
                  style={
                    selectedSize === item.sizes[0]
                      ? styles.selectedSizeQuantityContainerText
                      : styles.sizesQuantityContainerText
                  }>
                  {item.sizes[0]}
                </Text>
              </TouchableOpacity>
              {item.sizes[1] && (
                <TouchableOpacity
                  style={
                    selectedSize === item.sizes[1]
                      ? styles.selectedSizeButton
                      : styles.sizeButton
                  }
                  onPress={() => setSelectedSize(item.sizes[1])}>
                  <Text
                    style={
                      selectedSize === item.sizes[1]
                        ? styles.selectedSizeQuantityContainerText
                        : styles.sizesQuantityContainerText
                    }>
                    {item.sizes[1]}
                  </Text>
                </TouchableOpacity>
              )}
              {item.sizes[2] && (
                <TouchableOpacity
                  style={
                    selectedSize === item.sizes[2]
                      ? styles.selectedSizeButton
                      : styles.sizeButton
                  }
                  onPress={() => setSelectedSize(item.sizes[2])}>
                  <Text
                    style={
                      selectedSize === item.sizes[2]
                        ? styles.selectedSizeQuantityContainerText
                        : styles.sizesQuantityContainerText
                    }>
                    {item.sizes[2]}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.sizesHeading}>Quantity</Text>
            <View style={styles.quantityButtonsContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleDecreaseQuantity(quantity)}>
                <Text style={styles.sizesQuantityContainerText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quantityButton}>
                <Text style={styles.sizesQuantityContainerText}>
                  {quantity}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Number(quantity) + 1)}>
                <Text style={styles.sizesQuantityContainerText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={styles.descriptionHeading}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartButtonText}>ADD TO CART</Text>
          <Text style={styles.plus}>+</Text>
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
    backgroundColor: colors.white,
  },
  headerContainer: {
    height: responsiveHeight(40),
    width: responsiveWidth(100),
    flexDirection: 'column',
    padding: 10,
  },
  topIconsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topIconLogo: {
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 10,
  },
  carouselContainer: {
    height: responsiveHeight(30),
  },
  carouselImage: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 0,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
  title: {
    fontFamily: 'Bai Jamjuree',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'left',
    color: colors.tertiary,
  },
  pricesContainer: {
    flexDirection: 'row',
    gap: 7,
  },
  price: {
    fontFamily: 'Montserrat Alternates',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.primary,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontFamily: 'Montserrat Alternates',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.primary,
  },
  sizesQuantityContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sizesContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  sizesSubContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  sizesHeading: {
    fontFamily: 'Bai Jamjuree',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.tertiary,
    marginBottom: 5,
  },
  sizeButton: {
    backgroundColor: colors.white,
    borderRadius: 3,
    height: 40,
    width: 40,
    color: colors.tertiary,
    shadowColor: '#FF5733',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  selectedSizeButton: {
    color: colors.white,
    borderRadius: 3,
    height: 40,
    width: 40,
    shadowColor: '#FF5733',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: colors.primary,
  },
  sizesQuantityContainerText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
    color: colors.tertiary,
  },
  selectedSizeQuantityContainerText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
    color: colors.white,
  },
  quantityContainer: {
    flexDirection: 'column',
  },
  quantityButtonsContainer: {
    flexDirection: 'row',
  },
  quantityButton: {
    backgroundColor: colors.white,
    borderRadius: 3,
    height: 40,
    width: 40,
    color: colors.tertiary,
    shadowColor: '#FF5733',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  descriptionHeading: {
    marginTop: 30,
    fontFamily: 'Bai Jamjuree',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    color: colors.tertiary,
  },
  description: {
    fontFamily: 'Montserrat Alternates',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.lightGrey,
    marginBottom: 20,
    overflow: 'hidden',
    height: 150,
  },
  cartButton: {
    backgroundColor: colors.red,
    width: '90%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 15,
    borderRadius: 60,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: 22,
    alignSelf: 'center',
  },
  plus: {
    color: colors.white,
    fontSize: 32,
    alignSelf: 'center',
  },
});
