import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BestChoice} from '../types/commonTypes';
import {Alert} from 'react-native';
import apiConfig from '../config/apiConfig';

const initialState: {bestChoices: BestChoice[]} = {
  bestChoices: [],
};

export const fetchBestChoices = createAsyncThunk(
  'bestChoices/fetchAllBestChoices',
  async (token: string, {rejectWithValue}) => {
    try {
      const colors = ['#FFF3E5', '#FFE5E5'];
      const response = await fetch(apiConfig.GET_ALL_BEST_CHOICE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', data.error.error);
        return rejectWithValue(data.error.error);
      }
      const bestChoices = data.data.bestChoices.map(
        (item: BestChoice, index: number) => ({
          ...item,
          color: colors[index % colors.length],
        }),
      );
      return bestChoices;
    } catch (error: any) {
      Alert.alert('Error fetching categories', error.message);
      return rejectWithValue(error.message);
    }
  },
);

const bestChoicesSlice = createSlice({
  name: 'bestChoices',
  initialState,
  reducers: {
    setBestChoices: (state, action) => {
      state.bestChoices = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBestChoices.fulfilled, (state, action) => {
        state.bestChoices = action.payload;
      })
      .addCase(fetchBestChoices.rejected, (state, action) => {
        console.log('Fetch Best Choices Failed', action.error);
      });
  },
});

export const {setBestChoices} = bestChoicesSlice.actions;
export default bestChoicesSlice.reducer;
