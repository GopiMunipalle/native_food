import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const initialState: User = {
  jwtToken: '',
  user: {
    id: '',
    full_name: '',
    email: '',
    mobile_number: '',
    role: '',
    createdAt: '',
    updatedAt: '',
  },
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    body: {
      mobile_no: string;
      password: string;
      role: string;
      country_code: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await fetch(apiConfig.LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error.error);
      }
      await AsyncStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const initializeData = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      return JSON.parse(userData);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to load initial data');
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: state => {
      state.jwtToken = '';
      state.user = {
        id: '',
        full_name: '',
        email: '',
        mobile_number: '',
        role: '',
        createdAt: '',
        updatedAt: '',
      };
      state.isLoggedIn = false;
      AsyncStorage.removeItem('user');
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.jwtToken = action.payload.jwtToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.jwtToken = action.payload.jwtToken;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      },
    );

    builder.addCase(loginUser.rejected, (state, action) => {
      Alert.alert('Error', String(action.error.message));
      console.log('Fetching Login Failed', action.error);
    });
  },
});
export const {logoutUser, setUser} = authSlice.actions;
export default authSlice.reducer;
