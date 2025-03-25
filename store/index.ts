import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import roomReducer from './slices/roomSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    room: roomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;