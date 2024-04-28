import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import InventoryService from '../services/InventoryService.ts';
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
    setOrderItems: (state, action) => {
      const data = action.payload;
      let existingIndex = state.orderItems.findIndex(obj => obj.id === data.id);
      console.log(existingIndex);
      if (existingIndex !== -1) {
        state.orderItems[existingIndex] = {
          ...state.orderItems[existingIndex],
          ...data,
        };
      } else {
        const x =  state.orderItems;
        console.log(JSON.stringify(x))
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
export const {setPosId, setOrderItems} = orderSlice.actions;
export default orderSlice.reducer;
