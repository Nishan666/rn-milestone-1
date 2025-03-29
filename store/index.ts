import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import roomReducer from './slices/roomSlice';
import authReducer from './slices/authSlice';
import themeLangReducer from './slices/themeLangSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    room: roomReducer,
    themeLang: themeLangReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;