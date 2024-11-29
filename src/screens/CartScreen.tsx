import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {productT} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {colors} from '../colors';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

interface Product {
  cartItem: productT;
  quantity: number;
  _id: string;
}

interface CartT {
  _id: string;
  products: Product[] | undefined;
  totalPrice: number;
}

export default function CartScreen() {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartT | undefined>(undefined);
  const token = useSelector((state: RootState) => state.authSlice.jwtToken);

  useEffect(() => {
    fetchAllCartItems();
  }, []);

  const fetchAllCartItems = async () => {
    try {
      const response = await fetch(apiConfig.GET_ALL_CART_ITEMS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', 'Fetching Failed at Get All CartItems');
      }
      setTotalPrice(data.cart.totalPrice);
      setCartItems(data.cart);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error at fetch get all cartItems');
    }
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateProductQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateProductQuantity(itemId, currentQuantity + 1);
  };

  const updateProductQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prevCartItems => {
      if (!prevCartItems || !prevCartItems.products) return prevCartItems;

      const updatedProducts = prevCartItems.products.map(product => {
        if (product.cartItem._id === itemId) {
          return {
            ...product,
            quantity: newQuantity,
          };
        }
        return product;
      });

      const updatedCart = {
        ...prevCartItems,
        products: updatedProducts,
        totalPrice: calculateTotalPrice(updatedProducts),
      };

      return updatedCart;
    });
  };

  const calculateTotalPrice = (products: Product[]) => {
    return products.reduce((total, product) => {
      const price = product.cartItem.discountPrice
        ? product.cartItem.discountPrice
        : product.cartItem.price;
      return total + price * product.quantity;
    }, 0);
  };

  const updateCartItems = async () => {
    try {
      if (!cartItems || !cartItems.products) return;

      const response = await fetch(apiConfig.UPDATE_CART_ITEM_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({
          products: cartItems.products.map(product => ({
            productId: product.cartItem._id,
            quantity: product.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        Alert.alert('Error', 'Error at update cartItems');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error at catch update cartItems');
    }
  };

  const handleCheckout = async () => {
    console.log(cartItems, 'cartItems');
  };

  const renderCartItem = ({item}: {item: Product}) => {
    return (
      <View style={styles.cartItemContainer}>
        <Image
          source={{
            uri: `${apiConfig.GET_IMAGES_BY_ID}/${item.cartItem.images[0]}`,
          }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{item.cartItem.name}</Text>
          <View style={styles.pricesContainer}>
            {item.cartItem.discountPrice ? (
              <>
                <Text style={styles.discountPrice}>
                  ₹{item.cartItem.discountPrice}
                </Text>
                <Text
                  style={[styles.price, {textDecorationLine: 'line-through'}]}>
                  ₹{item.cartItem.price}
                </Text>
              </>
            ) : (
              <Text style={styles.discountPrice}>₹{item.cartItem.price}</Text>
            )}
          </View>
          <View style={styles.quantityButtonsContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleDecreaseQuantity(item.cartItem._id, item.quantity)
              }>
              <Text style={styles.sizesQuantityContainerText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quantityButton}>
              <Text style={styles.sizesQuantityContainerText}>
                {item.quantity}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleIncreaseQuantity(item.cartItem._id, item.quantity)
              }>
              <Text style={styles.sizesQuantityContainerText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => console.log(item.cartItem._id)}>
              <MaterialCommunity
                style={{
                  alignItems: 'center',
                }}
                name="delete"
                size={25}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const CartItemsFrame = () => (
    <>
      <FlatList
        data={cartItems?.products}
        renderItem={renderCartItem}
        keyExtractor={item => item._id}
      />
    </>
  );

  const renderSections = ({
    item,
  }: {
    item: {id: string; component: JSX.Element};
  }) => <View key={item.id}>{item.component}</View>;

  const sections = [{id: 'cart', component: <CartItemsFrame />}];

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderSections}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    padding: 10,
  },
  productImage: {
    height: 100,
    width: 90,
  },
  pricesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  productName: {
    fontFamily: 'Montserrat Alternates',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    color: colors.tertiary,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#FF5733',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    padding: 10,
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
  quantityContainer: {
    flexDirection: 'column',
  },
  quantityButtonsContainer: {
    flexDirection: 'row',
  },
  quantityButton: {
    backgroundColor: '#FFE5E5',
    borderRadius: 3,
    height: 40,
    width: 40,
    color: colors.tertiary,
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
  deleteButton: {
    height: 38,
    width: 45,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.red,
    borderRadius: 5,
  },
  checkoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    marginBottom: 20,
    width: '100%',
    backgroundColor: colors.greenButton,
    padding: 15,
    borderRadius: 60,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
    color: colors.white,
  },
});
