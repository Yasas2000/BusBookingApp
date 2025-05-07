import {configureStore, createSlice} from '@reduxjs/toolkit';
import userSlice from 'src/redux/userSlice';

const store = configureStore({
    reducer : {
        user : userSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;