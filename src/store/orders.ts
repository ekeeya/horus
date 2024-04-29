import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {generateError} from '../utils';
import {OrderItem} from '../models/inventory.tsx';

interface OrderState {
  adding: boolean;
  ordering: boolean;
  total: number;
  error: string | null;
  orderItems: OrderItem[];
  posId: number;
}

const initialState: OrderState = {
  adding: false,
  ordering: false,
  error: null,
  total: 0,
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
export const {setPosId, setOrderItems, clearOrderItems, removeOrderItem} = orderSlice.actions;
export default orderSlice.reducer;
