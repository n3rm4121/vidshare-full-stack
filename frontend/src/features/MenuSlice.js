import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    isMenuOpen: false,
  },
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    openMenu: (state) => {
      state.isMenuOpen = true;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const { toggleMenu, openMenu, closeMenu } = menuSlice.actions;
export default menuSlice.reducer;
