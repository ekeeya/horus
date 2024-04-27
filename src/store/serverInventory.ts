import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Category, InventoryItem} from '../models/inventory.tsx';
import client from '../axios';
import {computeUrlParams, generateError} from '../utils';
import {readString} from 'react-native-csv';
import InventoryService from '../services/InventoryService.ts';

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

export const fetchServerInventoryData = createAsyncThunk(
  'serverInventory/fetchServerInventory',
  async (params, thunkAPI) => {
    try {
      // @ts-ignore
      const {type} = params;
      const url = computeUrlParams('api/v1/inventory/export/csv', params);
      const response = await client.get(url, {
        responseType: 'text',
      });
      const results = readString(response.data, {header: true});
      console.log(type);
      return {type: type, data: results.data, importType: 'external'};
    } catch (error) {
      thunkAPI.rejectWithValue(generateError(error));
    }
  },
);

export const serverInventorySlice = createSlice({
  name: 'serverInventory',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServerInventoryData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchServerInventoryData.fulfilled, (state, action) => {
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
          state.importItems = 'external' ? items.slice(0, -1) : items;
          if (importType === 'external') {
            InventoryService.save('inventory_item', data.slice(0, -1)).then(
              _ => {
                console.log('Inventory Items loaded to local db');
              },
            );
          }
        }
      })
      .addCase(fetchServerInventoryData.rejected, (state, action) => {
        state.loading = false;
        state.importError = action.error.message ?? 'Unknown error';
      });
  },
});

// Export the actions and reducer
export const {setLoading} = serverInventorySlice.actions;
export default serverInventorySlice.reducer;
