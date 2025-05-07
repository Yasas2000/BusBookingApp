import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    user: string;
    email: string;
    phone: string;
    authenticated: boolean;
}

const initialState: User = {
    user: "",
    email: "",
    phone: "",
    authenticated: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload.user;
            state.email = action.payload.email;
            state.authenticated = true;
        },
        removeUser: (state) => {
            state = initialState;
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;