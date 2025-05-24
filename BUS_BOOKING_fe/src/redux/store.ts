import { configureStore, createSlice } from '@reduxjs/toolkit';
import userSlice from 'src/redux/userSlice';
import cartSlice from 'src/redux/cartSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        cart: cartSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;