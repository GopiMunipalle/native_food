import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {OfferScreenNavigationProp} from '../types/navigationProps';
import {images} from '../assets/images';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {colors} from '../colors';
import {
  BestOffer,
  BusinessDetails,
  offerProductDetails,
  productT,
} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface product extends productT {
  color: string;
  business: BusinessDetails;
}

export default function OfferCarousel({
  navigation,
  route,
}: {
  navigation: OfferScreenNavigationProp;
  route: any;
}) {
  const {item}: {item: BestOffer} = route.params;
  let bgColors = ['#FFF3E5', '#FFE5E5'];
  const products = item.productDetails.map(
    (product: offerProductDetails, index: number) => {
      console.log(product.businessId);
      return {
        ...product,
        color: bgColors[index % bgColors.length],
      };
    },
  );
  console.log(item.productDetails);

  const renderProducts = ({item}: {item: offerProductDetails}) => {
    return (
      <View style={styles.bestChoiceItem}>
        <View style={styles.bestChoiceItemSubContainer}>
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
            style={{height: 25, width: 25, top: -45}}
          />
          <Text style={styles.businessName}>{item.businessName}</Text>
          <TouchableOpacity style={styles.bestChoicesItemIcon}>
            <AntDesign name="plus" size={25} color={colors.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProducts}
        keyExtractor={item => item._id}
        horizontal={false}
        numColumns={2}
        ListHeaderComponent={() => (
          <View>
            <ImageBackground
              style={styles.carouselItem}
              source={images.pizzabanner}>
              <View style={styles.carouselHeader}>
                <TouchableOpacity
                  style={styles.leftArrowContainer}
                  onPress={() => navigation.goBack()}>
                  <Image
                    source={images.leftArrow}
                    style={styles.leftArrowImage}
                    tintColor={colors.tertiary}
                  />
                </TouchableOpacity>
                <View style={styles.carouselSubContainer}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.carouselTitle}>{item.offerName}</Text>
                    <View style={styles.priceDetails}>
                      <Text style={styles.currentPrice}>
                        ${item.productDetails[0].price || 150}
                      </Text>
                      <Text style={styles.discountedPrice}>
                        ${item.productDetails[0].discountPrice || 100}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>
                      {item.description.slice(0, 3)}
                    </Text>
                    <Text style={styles.descriptionText}>
                      {item.description.slice(3)}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(100),
    width: responsiveScreenWidth(100),
  },
  carouselItem: {
    width: '100%',
    height: 200,
    borderRadius: 0,
  },
  carouselHeader: {
    marginTop: 20,
    marginLeft: 20,
  },
  carouselSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftArrowContainer: {
    backgroundColor: colors.white,
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  leftArrowImage: {
    width: 20,
    height: 20,
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
  priceContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  currentPrice: {
    color: '#DF201F',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Montserrat Alternates',
  },
  discountedPrice: {
    color: '#DF201F',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Montserrat Alternates',
    textDecorationLine: 'line-through',
  },
  descriptionContainer: {
    top: 20,
    alignSelf: 'flex-end',
    right: 100,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 35,
    borderColor: '#FFFFFF',
  },
  descriptionTitle: {
    color: '#DF201F',
    fontWeight: '800',
    fontSize: 18,
    fontFamily: 'Montserrat Alternates',
  },
  descriptionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Montserrat Alternates',
  },
  bestChoiceItem: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    width: '40%',
    height: 314,
  },
  bestChoiceItemSubContainer: {
    height: 250,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#FFD3D3',
    backgroundColor: '#FFD3D3',
  },
  bestChoicesImage: {
    height: '50%',
    width: '100%',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    top: -55,
  },
  bestChoicesText: {
    fontSize: 22,
    color: colors.tertiary,
    fontWeight: '600',
    fontFamily: 'Bai Jamjuree',
  },
  bestChoiceText: {
    top: -55,
    color: colors.tertiary,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 5,
    marginBottom: 10,
  },
  bestChoicePriceText: {
    top: -55,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
  bestChoicesItemIcon: {
    top: -30,
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
    top: -45,
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Bai Jamjuree',
    lineHeight: 20,
    textAlign: 'center',
    color: colors.tertiary,
  },
});
