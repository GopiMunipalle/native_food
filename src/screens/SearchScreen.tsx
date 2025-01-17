import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../colors';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import apiConfig from '../config/apiConfig';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {SearchScreenNavigationProp} from '../types/navigationProps';
import {TodaySpecial} from '../types/commonTypes';

interface productT {
  _id: string;
  businessId: string;
  category: string;
  categoryId: string;
  description: string;
  images: [string];
  isActive: boolean;
  isBestChoice: boolean;
  isTodaySpecial: boolean;
  name: string;
  packingCharge: number;
  price: number;
  quantity: number;
  sizes: [];
  specialDayDate?: null;
  subCategory?: string;
  units?: string | number;
  weight?: number;
  discountPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function SearchScreen({
  navigation,
}: {
  navigation: SearchScreenNavigationProp;
}) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<TodaySpecial[]>([]);
  const [searchList, setSearchList] = useState<[]>([]);
  const token = useSelector((state: RootState) => state.authSlice.jwtToken);
  const handleClearSearch = () => {
    setSearch('');
  };

  useEffect(() => {
    getAllProducts();
    fetchRecentSearches();
    setSearch('');
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const response = await fetch(apiConfig.GET_RECENT_SEARCH_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('error', data.error.error);
      }
      const {recentSearches} = data.data;
      setSearchList(recentSearches);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        apiConfig.CREATE_SEARCH_URL + `?search=${search}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('error', data.error.error);
      }
      console.log(data, 'data');
      getAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await fetch(
        apiConfig.GET_ALL_PRODUCTS_URL + `/?findByName=${search}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('error', data.error.error);
      }
      setProducts(data.data.products || data.data.filterProduct);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}: {item: {search: string; _id: string}}) => {
    return (
      <View style={styles.searchItem}>
        <Text style={styles.searchItemText}>{item.search}</Text>
      </View>
    );
  };

  const handleProduct = (item: TodaySpecial) => {
    navigation.navigate('ProductDetailScreen', {item: item});
  };
  const renderProducts = ({item}: {item: TodaySpecial}) => {
    return (
      <>
        {item.images[0] && (
          <TouchableOpacity
            style={styles.productListContainer}
            onPress={() => handleProduct(item)}>
            <Image
              source={{
                uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.images[0]}`,
              }}
              style={styles.productImage}
              resizeMode="stretch"
            />
            <Text style={styles.productName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
            <AntDesign name="search1" size={24} color={colors.tertiary} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.tertiary}
            onChangeText={text => setSearch(text)}
            value={search}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.crossIcon}
              onPress={handleClearSearch}>
              <Entypo name="cross" size={24} color={colors.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchList.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyText}>History</Text>
          <FlatList
            style={styles.flatList}
            data={searchList}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.productsWrapper}>
        <FlatList
          data={products}
          renderItem={renderProducts}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.productListContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    zIndex: 1,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7E7E9',
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.tertiary,
    padding: 0,
    height: '100%',
  },
  crossIcon: {
    padding: 4,
  },
  historyContainer: {
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    maxHeight: 150,
    marginBottom: 8,
  },
  historyText: {
    fontSize: 18,
    fontFamily: 'Bai Jamjuree',
    fontWeight: '600',
    color: '#161A1D',
    marginBottom: 8,
  },
  flatList: {
    width: '100%',
  },
  searchItem: {
    backgroundColor: '#EDEDED',
    margin: 4,
    padding: 8,
    borderRadius: 5,
  },
  searchItemText: {
    fontSize: 14,
    color: '#A2A3A5',
  },
  productsWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 8,
  },
  productListContent: {
    padding: 16,
  },
  productListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 90,
    width: 90,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#161A1D',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.tertiary,
  },
  bestChoiceTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bestChoiceText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 20,
  },
});
