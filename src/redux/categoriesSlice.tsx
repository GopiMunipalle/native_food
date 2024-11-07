import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {categoryTypes} from '../types/commonTypes';
import apiConfig from '../config/apiConfig';
import {Alert} from 'react-native';

const initialState: {categories: categoryTypes[]} = {
  categories: [],
};

export const fetchAllCategories = createAsyncThunk<categoryTypes[], string>(
  'categories/fetchAllCategories',
  async (token: string, {rejectWithValue}) => {
    try {
      const colors = ['#FE5656', '#34A85A', '#FFC107', '#8E24AA', '#4CAF50'];
      const response = await fetch(`${apiConfig.GET_ALL_CATEGORIES_URL}`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', data.error.error);
        return rejectWithValue(data.error.error);
      }
      return data.data.categories.map(
        (category: categoryTypes, index: number) => ({
          ...category,
          color: colors[index % colors.length],
        }),
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error fetching categories', error.message);
      return rejectWithValue(error.message);
    }
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<categoryTypes[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        console.log('Fetch Categories Failed', action.payload);
      });
  },
});

export const {setCategories} = categoriesSlice.actions;
export default categoriesSlice.reducer;
