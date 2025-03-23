import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import roomReducer from './slices/roomSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    room: roomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;