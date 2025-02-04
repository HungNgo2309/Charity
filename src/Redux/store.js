import { configureStore } from '@reduxjs/toolkit';// Existing counter slice
import auth from './auth';
import cart from './cart';
 // New auth slice

export const store = configureStore({
  reducer: {
    auth: auth,
    cart:cart // Add the auth slice to the store
  },
});