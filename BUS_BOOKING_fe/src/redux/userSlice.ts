import { createSlice } from "@reduxjs/toolkit";

interface User {
    username: string;
    email: string
}

const initialState: User = {
    username: "",
    email: ""
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;