import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    list: [],
    single: null,   // ✅ single object, not array
    loading: 0,     // 0 = idle, 1 = loading, 2 = completed
    error: null,
  },
  reducers: {
    fetchCategoriesRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = 2;
      state.list = action.payload;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    fetchCategoryRequest: (state) => {
      state.loading = 1;
      state.error = null;
      state.single = null;
    },
    fetchCategorySuccess: (state, action) => {
      state.loading = 2;
      state.single = action.payload; // ✅ correct
    },
    fetchCategoryFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategoryRequest,
  fetchCategorySuccess,
  fetchCategoryFailure,
} = categorySlice.actions;

export default categorySlice.reducer;


// === Selectors ===
export const selectCategories = (state) => state.category.list;

// Single category selector
export const selectSingleCategory = (state) => state.category.single;

// Loading & error
export const selectCategoriesLoading = (state) => state.category.loading;
export const selectCategoriesError = (state) => state.category.error;

export const selectIsCategoriesLoading = (state) =>
  state.category.loading === 1;

export const selectHasCategoriesLoaded = (state) =>
  state.category.loading === 2 && !state.category.error;