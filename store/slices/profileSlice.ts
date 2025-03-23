import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileData, ProfileState } from '../../models/types';

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

export const loadProfile = createAsyncThunk(
  'profile/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem('profileData');
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      return rejectWithValue('Failed to load profile data');
    }
  }
);

export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async (profileData: ProfileData, { rejectWithValue }) => {
    try {
      const jsonValue = JSON.stringify(profileData);
      await AsyncStorage.setItem('profileData', jsonValue);
      return profileData;
    } catch (error) {
      return rejectWithValue('Failed to save profile data');
    }
  }
);

export const clearProfile = createAsyncThunk(
  'profile/clearProfile',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('profileData');
      return null;
    } catch (error) {
      return rejectWithValue('Failed to clear profile data');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action: PayloadAction<ProfileData | null>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.data = action.payload;
      })
      .addCase(clearProfile.fulfilled, (state) => {
        state.data = null;
      });
  },
});

export default profileSlice.reducer;