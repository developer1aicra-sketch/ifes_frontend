import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategoryRequest,
  fetchCategorySuccess,
  fetchCategoryFailure,
} from "./categoriesSlice";
import { fetchCategories, fetchCategory } from "./categoriesApi";

// Handler for fetching all categories
function* handleFetchCategories() {
  try {
    const response = yield call(fetchCategories);
    yield put(fetchCategoriesSuccess(response.data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.message || "Failed to fetch categories."));
  }
}

// Handler for fetching a single category
function* handleFetchCategory(action) {
  try {
    const categoryId = action.payload;
    
    // Prevent calling category API with "razorpay" as categoryId
    if (categoryId === 'razorpay' || categoryId === 'Razorpay' || categoryId === 'RAZORPAY') {
      console.warn('⚠️ Attempted to fetch category with invalid ID: "razorpay". This is not a valid category.');
      yield put(fetchCategoryFailure('Invalid category ID: "razorpay" is not a valid category. Payment gateway names should not be used as category IDs.'));
      return;
    }
    
    // Validate categoryId before making API call
    if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
      yield put(fetchCategoryFailure('Invalid category ID: Category ID is required and must be a non-empty string.'));
      return;
    }
    
    console.log("Fetching category with ID:", categoryId);
    const response = yield call(fetchCategory, categoryId);

    if (response.data) {
      yield put(fetchCategorySuccess(response.data?.data));
    } else {
      yield put(fetchCategoryFailure(`No category found for ID: ${categoryId}`));
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    yield put(fetchCategoryFailure(error.message || "Failed to fetch category."));
  }
}

// Alternative: Handler for fetching multiple categories by IDs (if you need this)
function* handleFetchCategoriesByIds(action) {
  try {
    const { categoryIds } = action.payload;

    // Use Promise.all for concurrent execution
    const promises = categoryIds.map((id) => call(fetchCategory, id));
    const responses = yield all(promises);

    let allData = [];

    responses.forEach((response) => {
      if (response?.data) {
        allData = [...allData, response.data];
      }
    });

    if (allData.length > 0) {
      yield put(fetchCategoriesSuccess(allData));
    } else {
      yield put(fetchCategoriesFailure("No categories found for provided IDs."));
    }
  } catch (error) {
    yield put(
      fetchCategoriesFailure(error.message || "Failed to fetch categories.")
    );
  }
}

export default function* categorySaga() {
  yield takeLatest(fetchCategoriesRequest.type, handleFetchCategories);
  yield takeLatest(fetchCategoryRequest.type, handleFetchCategory);
  // Uncomment if you need to fetch multiple categories by IDs
  // yield takeLatest(fetchCategoriesByIdsRequest.type, handleFetchCategoriesByIds);
}