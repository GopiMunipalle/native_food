import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import countries from '../utils/Constants';
import {User} from '../types/commonTypes';

interface Country {
  code: string;
  flag: any;
  name: string;
}
interface AuthState {
  country: Country;
  mobileNumber: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  email?: string;
  state?: string;
  role: string;
  otp?: string;
  agreedToTerms: boolean;
  userData: User | null;
}

const initialState: AuthState = {
  country: countries[0],
  mobileNumber: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  state: '',
  role: 'CUSTOMER',
  otp: '',
  agreedToTerms: false,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload;
    },
    setMobileNumber: (state, action: PayloadAction<string>) => {
      state.mobileNumber = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setAgreedToTerms: (state, action: PayloadAction<boolean>) => {
      state.agreedToTerms = action.payload;
    },
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    setState: (state, action: PayloadAction<string>) => {
      state.state = action.payload;
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
  },
});

export const {
  setCountry,
  setMobileNumber,
  setPassword,
  setConfirmPassword,
  setName,
  setEmail,
  setRole,
  setAgreedToTerms,
  setUserData,
  setState,
  setOtp,
} = authSlice.actions;

export default authSlice.reducer;
