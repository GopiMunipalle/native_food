import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import apiConfig from '../config/apiConfig';
import {BestOffer} from '../types/commonTypes';

export interface OfferData {
  bestOffers: BestOffer[];
}

const initialState: OfferData = {
  bestOffers: [],
};

// AsyncThunk to fetch best offers
export const fetchBestOffers = createAsyncThunk<
  BestOffer[],
  string,
  {rejectValue: string}
>('bestOffers/fetchAllBestOffers', async (token, {rejectWithValue}) => {
  try {
    const response = await fetch(apiConfig.GET_ALL_BEST_OFFERS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error.error);
    }
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const bestOfferSlice = createSlice({
  name: 'bestOffers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBestOffers.fulfilled, (state, action) => {
      state.bestOffers = action.payload;
    });
    builder.addCase(fetchBestOffers.rejected, (state, action) => {
      console.log('Fetch Best Offers Failed', action.error.message);
    });
  },
});

export default bestOfferSlice.reducer;
