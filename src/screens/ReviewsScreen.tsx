import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FoodReviewsScreenNavigationProp} from '../types/navigationProps';
import {colors} from '../colors';
import {images} from '../assets/images';
import {Review} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

export default function ReviewsScreen({
  navigation,
  route,
}: {
  navigation: FoodReviewsScreenNavigationProp;
  route: any;
}) {
  const reviews: Review[] = route.params.reviews;

  const renderReviews = ({item}: {item: Review}) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewSubContainer}>
        {item.reviewerImage === undefined ? (
          <Image source={images.homePerson} />
        ) : (
          <Image
            source={{
              uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.reviewerImage}`,
            }}
          />
        )}
        <View style={styles.reviewerContainer}>
          <Text style={styles.reviewerName}>{item.reviewerName}</Text>
          <StarRatingDisplay
            rating={item.rating}
            starSize={17}
            starStyle={{width: 14, marginLeft: -2}}
            color="#FFC107"
          />
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              item.images && item.images.length > 0
                ? {uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.images[0]}`}
                : undefined
            }
            style={styles.image}
          />
        </View>
        {item.images && item.images.length > 1 && (
          <TouchableOpacity style={styles.imageWrapper} onPress={() => {}}>
            <Image
              source={{uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.images[1]}`}}
              style={[
                styles.image,
                {
                  opacity: 0.5,
                  width: 110,
                  marginLeft: 10,
                },
              ]}
            />
            <Text style={styles.overlayText}>{item.images.length - 1}+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity
          style={styles.headerButtonContainer}
          onPress={() => navigation.goBack()}>
          <Image source={images.leftArrow} style={styles.leftArrowIcon} />
          <Text style={styles.profileText}>Reviews</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={reviews}
        renderItem={renderReviews}
        keyExtractor={item => item._id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 15}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    backgroundColor: colors.grey,
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
  reviewContainer: {
    padding: 10,
    marginBottom: 30,
    backgroundColor: colors.white,
    shadowColor: '#FFC268',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  reviewSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  reviewerName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.tertiary,
    lineHeight: 20,
  },
  description: {
    fontFamily: '#A2A3A5',
    fontSize: 16,
    fontWeight: '600',
    color: '#A2A3A5',
    lineHeight: 26,
    marginBottom: 10,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: 270,
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'grey',
  },
  overlayText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -10}, {translateY: -10}],
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
});
