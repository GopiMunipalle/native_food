import {images} from '../assets/images';

const countries = [
  {
    code: '+91',
    name: 'India',
    flag: require('../assets/images/flags/indiaflag.png'),
  },
  {
    code: '+1',
    name: 'United States',
    flag: require('../assets/images/flags/usflag.png'),
  },
  {
    code: '+44',
    name: 'United Kingdom',
    flag: require('../assets/images/flags/ukflag.png'),
  },
];

export default countries;

export const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const offersBanners = [
  {
    id: 1,
    title: 'Super Veg Delicious Pizza',
    image: images.pizzabanner,
    description: {
      firstPart: '50%',
      secondPart: ' OFF',
    },
    discountPrice: 100,
    price: 200,
  },
  {
    id: 2,
    title: 'Super Veg Delicious Burger',
    image: images.pizzabanner,
    description: {
      firstPart: '50%',
      secondPart: ' OFF',
    },
    discountPrice: 100,
    price: 200,
  },
  {
    id: 3,
    title: 'Delicious French Fries',
    image: images.pizzabanner,
    description: {
      firstPart: '50%',
      secondPart: ' OFF',
    },
    discountPrice: 100,
    price: 200,
  },
  {
    id: 4,
    title: 'Delicious Fried Chicken',
    image: images.pizzabanner,
    description: {
      firstPart: '50%',
      secondPart: ' OFF',
    },
    discountPrice: 100,
    price: 200,
  },
];
