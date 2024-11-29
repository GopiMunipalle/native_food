import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {TodaySpecial} from '../types/commonTypes';
import {Alert} from 'react-native';
import apiConfig from '../config/apiConfig';

const initialState: {todaySpecials: TodaySpecial[]} = {
  todaySpecials: [],
};

export const fetchTodaySpecials = createAsyncThunk(
  'todaySpecials/fetchAllTodaySpecials',
  async (token: string, {rejectWithValue}) => {
    try {
      const response = await fetch(apiConfig.GET_ALL_TODAY_SPECAILS_URL, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error TodaySpecials', data.error.error);
        return rejectWithValue(data.error.error);
      }
      // let products;
      // if (data.data.product.length < 5) {
      //   products = data.data.product;
      // }
      // products = data.data.product.slice(0, 5);
      return data.data.product;
    } catch (error: any) {
      Alert.alert('Error', error.message);
      return rejectWithValue(error.message);
    }
  },
);

const todaySpecialSlice = createSlice({
  name: 'todaySpecials',
  initialState,
  reducers: {
    setTodaySpecials: (state, action) => {
      state.todaySpecials = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodaySpecials.fulfilled, (state, action) => {
        state.todaySpecials = action.payload;
      })
      .addCase(fetchTodaySpecials.rejected, (state, action) => {
        console.log('Error Fetching Today Specials', action.error);
      });
  },
});

export const {setTodaySpecials} = todaySpecialSlice.actions;
export default todaySpecialSlice.reducer;
