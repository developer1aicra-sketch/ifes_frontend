import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    list: [],
    single: null,   // single object (used for OTP verification and signup)
    loading: 0,     // 0 = idle, 1 = loading, 2 = completed
    error: null,
    otpVerified: false, // Track if OTP is verified
    loginVerified: false, // Track if login OTP was just verified (for redirect to /roboclub)
    currentOperation: null, // Track current operation: 'sendOtp', 'verifyOtp', 'signup'
  },
  reducers: {
    signUpSendOtpRequest: (state) => {
      state.loading = 1;
      state.error = null;
      state.currentOperation = 'sendOtp';
    },
    signUpSendOtpSuccess: (state, action) => {
      state.loading = 2;
      state.list = action.payload;
      state.error = null;
      state.currentOperation = null;
    },
    signUpSendOtpFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
      state.currentOperation = null;
    },

    signUpVerifyOtpRequest: (state) => {
      state.loading = 1;
      state.error = null;
      state.currentOperation = 'verifyOtp';
    },
    signUpVerifyOtpSuccess: (state, action) => {
      state.loading = 2;
      state.single = action.payload;
      state.otpVerified = true;
      state.error = null;
      state.currentOperation = null;
    },
    signUpVerifyOtpFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
      state.otpVerified = false;
      state.currentOperation = null;
    },
    loginSendOtpRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    loginSendOtpSuccess: (state, action) => {
      state.loading = 2;
      state.list = action.payload;
    },
    loginSendOtpFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },
    loginRequest: (state) => {
      state.loading = 1;
      state.error = null;
      state.loginVerified = false;
    },
    loginSuccess: (state, action) => {
      state.loading = 2;
      state.single = action.payload;
      state.loginVerified = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
      state.loginVerified = false;
    },
    loginVerifyOtpRequest: (state) => {
      state.loading = 1;
      state.error = null;
      state.single = null;
      state.loginVerified = false;
    },
    loginVerifyOtpSuccess: (state, action) => {
      state.loading = 2;
      state.single = action.payload;
      state.loginVerified = true;
    },
    loginVerifyOtpFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    signUpRequest: (state) => {
      state.loading = 1;
      state.error = null;
      state.currentOperation = 'signup';
      // Don't clear single here - we want to preserve OTP verification state
    },
    signUpSuccess: (state, action) => {
      state.loading = 2;
      state.single = action.payload;
      state.error = null;
      state.currentOperation = null;
    },
    signUpFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
      state.currentOperation = null;
    },
    // Clear OTP verification state when needed
    clearOtpVerification: (state) => {
      state.otpVerified = false;
      state.single = null;
    },
    clearLoginVerified: (state) => {
      state.loginVerified = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  signUpSendOtpRequest,
  signUpSendOtpSuccess,
  signUpSendOtpFailure,
  signUpVerifyOtpRequest,
  signUpVerifyOtpSuccess,
  signUpVerifyOtpFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  clearOtpVerification,
  loginSendOtpRequest,
  loginSendOtpSuccess,
  loginSendOtpFailure,
  loginVerifyOtpRequest,
  loginVerifyOtpSuccess,
  loginVerifyOtpFailure,
  clearLoginVerified,
  clearAuthError,
  loginRequest,
  loginSuccess,
  loginFailure,
} = authSlice.actions;

export default authSlice.reducer;

// OTP list
export const selectOtp = (state) => state.auth.list;

// Verified OTP response (single object)
export const selectReceivedOtp = (state) => state.auth.single;

// Loading & error
export const selectOtpLoading = (state) => state.auth.loading;
export const selectOtpError = (state) => state.auth.error;

// Status helpers
export const selectIsOtpLoading = (state) =>
  state.auth.loading === 1;

export const selectHasOtpLoaded = (state) =>
  state.auth.loading === 2 && !state.auth.error;

// OTP verification status
export const selectOtpVerified = (state) => state.auth.otpVerified;

// Login just verified (redirect to /roboclub)
export const selectLoginVerified = (state) => state.auth.loginVerified;

// Current operation
export const selectCurrentOperation = (state) => state.auth.currentOperation;

// Check if OTP verification is in progress
export const selectIsVerifyingOtp = (state) => 
  state.auth.currentOperation === 'verifyOtp' && state.auth.loading === 1;

// Check if signup is in progress
export const selectIsSigningUp = (state) =>
  state.auth.currentOperation === 'signup' && state.auth.loading === 1;

