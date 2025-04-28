import {configureStore, createSlice} from '@reduxjs/toolkit';
import userSlice from 'src/redux/userSlice';

const store = configureStore({
    reducer : {
        user : userSlice
    }
});

export default store;