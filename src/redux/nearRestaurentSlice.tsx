import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import apiConfig from '../config/apiConfig';
import {RestuarentT} from '../types/commonTypes';

const initialState: {restuarentNearBy: RestuarentT[]} = {
  restuarentNearBy: [],
};

export const fetchRestuarentNearBy = createAsyncThunk(
  'nearRestuarents/fetchAllRestaurents',
  async (
    {token, lat, long}: {token: string; lat: number; long: number},
    {rejectWithValue},
  ) => {
    try {
      const response = await fetch(
        apiConfig.GET_ALL_RESTUARENTS_NEAR_BY_URL +
          `lat=${Number(lat)}&long=${Number(long)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', data);
        return rejectWithValue(data.error);
      }
      return data;
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  },
);

const nearByRestuarentsSlice = createSlice({
  name: 'nearByRestaurents',
  initialState,
  reducers: {
    setNearRestuarents: (state, action) => {
      state.restuarentNearBy = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRestuarentNearBy.fulfilled, (state, action) => {
      state.restuarentNearBy = action.payload;
    });
  },
});

export const {setNearRestuarents} = nearByRestuarentsSlice.actions;
export default nearByRestuarentsSlice.reducer;
