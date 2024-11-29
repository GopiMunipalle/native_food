import {configureStore} from '@reduxjs/toolkit';
import authSlice from './AuthSlice';
import categoriesSlice from './categoriesSlice';
import bestChoicesSlice from './bestChoicesSlice';
import todaySpecials from './todaySpecialSlice';
import restaurentSlice from './nearRestaurentSlice';
import homeSlice from './homeSlice';
import bestOfferSlice from './bestOffersSlice';

export const store = configureStore({
  reducer: {
    authSlice: authSlice,
    homeSlice: homeSlice,
    categoriesSlice: categoriesSlice,
    bestChoicesSlice: bestChoicesSlice,
    todaySpecialSlice: todaySpecials,
    restaurentSlice: restaurentSlice,
    bestOfferSlice: bestOfferSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
