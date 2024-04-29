import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {generateError} from '../utils';
import { Order, OrderItem } from "../models/inventory.tsx";

interface OrderState {
  adding: boolean;
  ordering: boolean;
  total: number;
  error: string | null;
  orderItems: OrderItem[];
  posId: number;
  order: Order | null;
}

const initialState: OrderState = {
  adding: false,
  ordering: false,
  error: null,
  total: 0,
  order: null,
  orderItems: [],
  posId: 0,
};

export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (data, thunkAPI) => {
    try {
    } catch (error) {
      thunkAPI.rejectWithValue(generateError(error));
    }
  },
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPosId: (state, action) => {
      state.posId = action.payload;
    },
    clearOrderItems: (state, action) => {
      state.orderItems = [];
      state.total = 0;
    },
    removeOrderItem: (state, {payload}) => {
      state.orderItems = state.orderItems.filter(
        item => item.id !== payload.id,
      );
      // recalculate the total
      state.total = 0;
      state.orderItems.forEach(item => {
        state.total += item.price * item.quantity;
      });
    },
    setOrderItems: (state, action) => {
      const data = action.payload;
      let existingIndex = state.orderItems.findIndex(obj => obj.id === data.id);
      if (existingIndex !== -1) {
        state.orderItems[existingIndex] = {
          ...state.orderItems[existingIndex],
          ...data,
        };
      } else {
        state.orderItems.unshift(data);
      }
      state.total = 0;
      state.orderItems.forEach(item => {
        state.total += item.price * item.quantity;
      });
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitOrder.pending, state => {
        state.ordering = true;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.ordering = false;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.ordering = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

// Export the actions and reducer
export const {setPosId, setOrderItems, clearOrderItems, removeOrderItem, setOrder} =
  orderSlice.actions;
export default orderSlice.reducer;
