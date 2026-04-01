import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalLoadingCount: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startGlobalLoading(state) {
      state.globalLoadingCount += 1;
    },
    stopGlobalLoading(state) {
      state.globalLoadingCount = Math.max(0, state.globalLoadingCount - 1);
    },
    resetGlobalLoading(state) {
      state.globalLoadingCount = 0;
    },
  },
});

export const { startGlobalLoading, stopGlobalLoading, resetGlobalLoading } = uiSlice.actions;

export const selectGlobalLoadingCount = (state) => state.ui?.globalLoadingCount ?? 0;
export const selectIsGlobalLoading = (state) => (state.ui?.globalLoadingCount ?? 0) > 0;

export default uiSlice.reducer;

