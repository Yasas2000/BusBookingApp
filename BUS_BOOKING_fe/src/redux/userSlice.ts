import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserEmailFromToken } from "src/auth/AuthUtils";

interface IUserState {
    user: IUser;
    isAuthenticated: boolean;
    loading: boolean;
}

export interface IUser {
    name: string;
    email: string;
    phone: string;
}

const initialState: IUserState = {
    user: {} as IUser,
    isAuthenticated: false,
    loading: false,
}

export const fetchWhoAmI = createAsyncThunk<IUser>(
    "user/fetchWhoAmI",
    async () => {
        const userEmail = await getUserEmailFromToken();
        const response = await axios.get(`user/whoami?email=${userEmail}`);
        return response.data as IUser;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        removeUser: () => initialState,
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWhoAmI.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
            })
            .addCase(fetchWhoAmI.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(fetchWhoAmI.rejected, (state, action) => {
                state.user = {} as IUser;
                state.isAuthenticated = false;
                state.loading = false;
            })
    }
});

export const { setUser, removeUser, setIsAuthenticated } = userSlice.actions;
export default userSlice.reducer;