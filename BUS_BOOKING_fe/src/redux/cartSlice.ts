import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Interface for a single booking fare
export interface IBookingFare {
  _id: string,
  bus_id: string;
  trip_id: string;
  departure_date: string;
  seatNumbers: string[];
  price: number;
}

// State interface
export interface CartState {
  fares: IBookingFare[];
  loading: boolean;
}

// Initial state
const initialState: CartState = {
  fares: [],
  loading: false
};


export const fetchCartData = createAsyncThunk<IBookingFare[]>(
  "cart/fetchCartData",
  async () => {
    try {
      console.log('Fetching pending bookings...');
      const response = await axios.get("/booking/pending");
      const validBookings = response.data.filter(
        (booking: any) =>
          booking.booking_status === "pending" &&
          new Date(booking.expires_at) > new Date()
      );
      return validBookings;
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addFare: (state, action: PayloadAction<IBookingFare>) => {
      state.fares.push(action.payload);
    },
    removeFare: (state, action: PayloadAction<string>) => {
      state.fares = state.fares.filter(fare => fare._id !== action.payload);
    },
    removeMultipleFares: (state, action: PayloadAction<string[]>) => {
      state.fares = state.fares.filter(fare => !action.payload.includes(fare._id));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.fares = action.payload
        state.loading = false
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.fares = []
      })
  }
})

export const { addFare, removeFare, removeMultipleFares } = cartSlice.actions;
export default cartSlice.reducer;