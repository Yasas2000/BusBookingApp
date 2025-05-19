import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
    user: IUser;
    isAuthenticated: boolean;
}

export interface IUser {
    user: string;
    email: string;
    phone: string;
}

const initialState: IUserState = {
    user: {} as IUser,
    isAuthenticated: false
}

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
    }
});

export const { setUser, removeUser, setIsAuthenticated } = userSlice.actions;
export default userSlice.reducer;