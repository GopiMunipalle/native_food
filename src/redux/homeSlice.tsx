import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: {coordinates: {lat: number | null; long: number | null}} = {
  coordinates: {
    lat: null,
    long: null,
  },
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setCoordinates: (
      state,
      action: PayloadAction<{lat: number; long: number}>,
    ) => {
      console.log(action.payload, 'coordinates');
      state.coordinates = {
        lat: action.payload.lat,
        long: action.payload.long,
      };
    },
  },
});

export const {setCoordinates} = homeSlice.actions;
export default homeSlice.reducer;
