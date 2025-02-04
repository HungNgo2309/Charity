import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoggedIn: false,
  userInfo: null, // Will store user information after login
  error: null,
  token:null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload; // Payload will contain user info
      state.error = null;
    },
    updatePoint: (state, action) => {
      if (state.userInfo) {
        state.userInfo.point = action.payload; // Only update the point field
      }
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.error = action.payload; // Store any error messages
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload; // Store any error messages
    },
  },
});

export const { loginSuccess, loginFailure, logout,setToken,updatePoint } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  try {
    console.log("Starting")
    const url = 'https://desktop-fakfvcn.tailaff69d.ts.net/login';
    const response = await axios.get(url, {
      params: {
        Email: email,  // Make sure to use the correct case for your API parameters
        password: password,
      },
    });
    console.log("checking")
    //console.log("Bearer "+response.data.token)
    if (response.data && response.data.user && response.data.token) {
      
      dispatch(loginSuccess(response.data.user));
        // Store user data
      await  AsyncStorage.setItem('@user_token', response.data.token);
      console.log(response.data.token)
      dispatch(setToken("Bearer "+response.data.token));
    } else {
      dispatch(loginFailure('Invalid login credentials'));
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

  
  export default authSlice.reducer;