import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoomData, RoomState } from '../../models/types';

const initialState: RoomState = {
  data: null,
  loading: false,
  error: null,
};

export const loadRoom = createAsyncThunk(
  'room/loadRoom',
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem('roomData');
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      return rejectWithValue('Failed to load room data');
    }
  }
);

export const saveRoom = createAsyncThunk(
  'room/saveRoom',
  async (roomData: RoomData, { rejectWithValue }) => {
    try {
      const jsonValue = JSON.stringify(roomData);
      await AsyncStorage.setItem('roomData', jsonValue);
      return roomData;
    } catch (error) {
      return rejectWithValue('Failed to save room data');
    }
  }
);

export const clearRoom = createAsyncThunk(
  'room/clearRoom',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('roomData');
      return null;
    } catch (error) {
      return rejectWithValue('Failed to clear room data');
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRoom.fulfilled, (state, action: PayloadAction<RoomData | null>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveRoom.fulfilled, (state, action: PayloadAction<RoomData>) => {
        state.data = action.payload;
      })
      .addCase(clearRoom.fulfilled, (state) => {
        state.data = null;
      });
  },
});

export default roomSlice.reducer;