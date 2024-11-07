import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {images} from '../assets/images';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {OnBoardingScreenNavigationProp} from '../types/navigationProps';

interface props {
  navigation: OnBoardingScreenNavigationProp;
}

const data = [
  {
    id: 1,
    title: 'We have Quality Chef',
    subtitle: 'It Is A Long Established Fact That A Reader Will Be Distracted',
    image: images.onBoarding1personImg,
  },
  {
    id: 2,
    title: 'Swift Delivery',
    subtitle: 'It Is A Long Established Fact That A Reader Will Be Distracted',
    image: images.onboarding2,
  },
  {
    id: 3,
    title: 'Choose your Tasty Food',
    subtitle: 'It Is A Long Established Fact That A Reader Will Be Distracted',
    image: images.onboarding3,
  },
  {
    id: 4,
    title: '10% Discount On First Order',
    subtitle: 'It Is A Long Established Fact That A Reader Will Be Distracted',
    image: images.onboarding4,
  },
];

export default function OnBoardingScreen({navigation}: props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<any>(null);

  const handleNextSlide = () => {
    if (activeIndex < data.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      carouselRef.current?.snapToItem(nextIndex);
    } else {
      navigation.navigate('SignInScreen');
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {id: number; title: string; subtitle: string; image: any};
  }) => {
    return (
      <View style={styles.slideContainer}>
        <ImageBackground
          source={item.image}
          style={styles.bgPattern}
          resizeMode="cover">
          {activeIndex !== data.length - 1 && (
            <TouchableOpacity
              style={styles.skipContainer}
              onPress={() => navigation.navigate('SignInScreen')}>
              <FontAwesome6 name="forward-step" size={20} color="black" />
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={data}
        //@ts-ignore
        renderItem={renderItem}
        onSnapToItem={setActiveIndex}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        loop={false}
        inactiveSlideOpacity={0.5}
        inactiveSlideScale={0.9}
        activeSlideAlignment="center"
      />

      <View style={styles.bottomContainer}>
        <View style={styles.bottomCircle}>
          <TouchableOpacity onPress={handleNextSlide}>
            <AntDesign
              name="right"
              size={24}
              color="#FFFFFF"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{data[activeIndex].title}</Text>
            <Text style={styles.subtitle}>{data[activeIndex].subtitle}</Text>
          </View>
          <Pagination
            dotsLength={data.length}
            activeDotIndex={activeIndex}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.dotStyle}
            inactiveDotStyle={styles.inactiveDotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideContainer: {
    flex: 1,
    width: '100%',
  },
  bgPattern: {
    height: responsiveHeight(75),
    width: '100%',
  },
  skipContainer: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#161A1D',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: responsiveHeight(40),
  },
  bottomCircle: {
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
    zIndex: 2,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  arrowIcon: {
    alignSelf: 'center',
  },
  bottomSection: {
    width: '120%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 360,
    borderTopRightRadius: 360,
    overflow: 'hidden',
    marginHorizontal: -50,
    paddingHorizontal: 50,
  },
  textContainer: {
    flex: 1,
    marginTop: 90,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Bai Jamjuree',
    fontSize: 24,
    fontWeight: '700',
    color: '#161A1D',
    marginBottom: 15,
  },
  subtitle: {
    width: 326,
    fontSize: 16,
    color: '#A2A3A5',
    fontWeight: '600',
    lineHeight: 24,
  },
  paginationContainer: {
    paddingVertical: 8,
    paddingBottom: 30,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: colors.primary,
  },
  inactiveDotStyle: {
    backgroundColor: '#A2A3A5',
  },
});
