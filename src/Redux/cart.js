import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: null,
  loading:false,
};

const cartCheck = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addcart: (state, action) => {
      state.cart = action.payload;
    },
    
  },
});

export const { addcart} = cartCheck.actions;

  export default cartCheck.reducer;