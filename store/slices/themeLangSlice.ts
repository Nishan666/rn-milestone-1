import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeLangState {
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
}

const initialState: ThemeLangState = {
  theme: 'light',
  language: 'en',
};

const themeLangSlice = createSlice({
  name: 'themeLang',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      AsyncStorage.setItem('theme', action.payload);
    },
    setLanguage: (state, action: PayloadAction<'en' | 'fr'>) => {
      state.language = action.payload;
      AsyncStorage.setItem('language', action.payload);
    },
    loadThemeLang: (state, action: PayloadAction<ThemeLangState>) => {
      state.theme = action.payload.theme;
      state.language = action.payload.language;
    },
  },
});

export const selectTheme = (state: any) => state.themeLang.theme;
export const selectLanguage = (state: any) => state.themeLang.language;
export const { setTheme, setLanguage, loadThemeLang } = themeLangSlice.actions;
export default themeLangSlice.reducer;
