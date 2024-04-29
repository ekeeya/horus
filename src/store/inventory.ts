import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  Category,
  InventoryItem,
  Order,
  OrderItem,
} from '../models/inventory.tsx';
import client from '../axios';
import {computeUrlParams, generateError} from '../utils';
import {readString} from 'react-native-csv';
import InventoryService from '../services/InventoryService.ts';
import { setPaid } from "./payment.js";

interface ServerInventoryState {
  loading: boolean;
  importError: string | null;
  importItems: InventoryItem[];
  importCategories: Category[];
}

const initialState: ServerInventoryState = {
  loading: false,
  importError: null,
  importCategories: [],
  importItems: [],
};

export const fetchInventoryData = createAsyncThunk(
  'inventory/fetchInventoryData',
  async (params, thunkAPI) => {
    try {
      // @ts-ignore
      const {type, importType, tableName, limit, lookups, searchTerm} = params;
      if (importType === 'external') {
        const url = computeUrlParams('api/v1/inventory/export/csv', params);
        const response = await client.get(url, {
          responseType: 'text',
        });
        const results = readString(response.data, {header: true});
        return {type: type, data: results.data, importType: importType};
      } else {
        let data;
        if (searchTerm) {
          data = await InventoryService.search(
            tableName,
            searchTerm.toLowerCase(),
            'frequency',
          );
        } else {
          data = await InventoryService.fetch(
            tableName,
            lookups,
            limit,
            'frequency',
          );
        }
        return {type: type, data: data, importType: 'internal'};
      }
    } catch (error) {
      thunkAPI.rejectWithValue(generateError(error));
    }
  },
);

export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async (order: Order, thunkAPI) => {
    try {
      const items: OrderItem[] = order.items;
      for (const item of items) {
        const inventoryItem = await InventoryService.getById(
          'inventory_item',
          item.id,
        );
        const category = await InventoryService.getById(
          'category',
          item.categoryId,
        );

        await InventoryService.update('inventory_item', item.id, {
          frequency: inventoryItem.frequency + 1,
          quantity: inventoryItem.quantity - 1,
        });

        await InventoryService.update('category', category.id, {
          frequency: category.frequency + 1,
        });
        thunkAPI.dispatch(
          fetchInventoryData({
            type: 'inventory_items',
            importType: 'internal',
            tableName: 'inventory_item',
          }),
        );
        thunkAPI.dispatch(setPaid(false));
      }
    } catch (error) {
      thunkAPI.rejectWithValue(generateError(error));
    }
  },
);

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInventoryData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchInventoryData.fulfilled, (state, action) => {
        state.loading = false;
        // Update state with fetched data if needed
        // @ts-ignore
        const {type, data, importType} = action.payload;
        if (type === 'categories') {
          let info = data;
          info.unshift({
            id: 0,
            name: 'Favourite',
            icon: 'favorite',
            provider: 'Fontisto',
            image: 'favorite',
            frequency: 1000000,
          });
          state.importCategories =
            importType === 'external' ? info.slice(0, -1) : info; // remember to drop the last one, it is bad for external imports
          if (importType === 'external') {
            InventoryService.save('category', info.slice(0, -1).splice(1)).then(
              _ => {
                console.log('Categories loaded to local db');
              },
            );
          }
        } else {
          let items = data;
          // @ts-ignore
          items = items.map(item => {
            const cat = state.importCategories.find(
              category => category.id === item.categoryId,
            );
            return {
              ...item,
              category: cat,
            };
          });
          state.importItems =
            importType === 'external' ? items.slice(0, -1) : items;
          if (importType === 'external') {
            InventoryService.save('inventory_item', data.slice(0, -1)).then(
              _ => {
                console.log('Inventory Items loaded to local db');
              },
            );
          }
        }
      })
      .addCase(fetchInventoryData.rejected, (state, action) => {
        state.loading = false;
        state.importError = action.error.message ?? 'Unknown error';
      });
  },
});

// Export the actions and reducer
export const {setLoading} = inventorySlice.actions;
export default inventorySlice.reducer;
