import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  signUpSendOtp, 
  signUpVerifyOtp,
  signUp,
  loginSendOtp, 
  loginVerifyOtp 
} from "./authApi";
import { 
  signUpSendOtpRequest,
  signUpSendOtpSuccess,
  signUpSendOtpFailure,
  signUpVerifyOtpRequest,
  signUpVerifyOtpSuccess,
  signUpVerifyOtpFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  loginSendOtpRequest,
  loginSendOtpSuccess,
  loginSendOtpFailure,
  loginVerifyOtpRequest,
  loginVerifyOtpSuccess,
  loginVerifyOtpFailure,
} from "./authSlice";

function* handleSignUpSendOtp({payload}) {
  console.log("signup send otp payload", payload);
  try {
    const response = yield call(signUpSendOtp, payload);
    if (response && response.data) {
      yield put(signUpSendOtpSuccess(response.data));
    } else {
      yield put(signUpSendOtpFailure("Invalid response from server"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to send signup OTP.";
    yield put(signUpSendOtpFailure(errorMessage));
  }
}

function* handleSignUpVerifyOtp({payload}) {
  try {
    const otp = payload;
    console.log("signup verify otp", otp);
    const response = yield call(signUpVerifyOtp, otp);

    if (response && response.data) {
      const responseData = response.data?.data || response.data;
      
      // Extract and save token to localStorage
      // Token might be in responseData.token, responseData.accessToken, responseData.data.token, etc.
      const token = responseData?.token || 
                    responseData?.accessToken || 
                    responseData?.data?.token ||
                    responseData?.data?.accessToken ||
                    response.data?.token ||
                    response.data?.accessToken;
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');
      } else {
        console.warn('No token found in OTP verification response:', responseData);
      }
      
      yield put(signUpVerifyOtpSuccess(responseData));
    } else {
      yield put(signUpVerifyOtpFailure("Invalid OTP or expired. Please request a new OTP."));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to verify signup OTP.";
    yield put(signUpVerifyOtpFailure(errorMessage));
  }
}

function* handleLoginSendOtp({payload}) {
  console.log("login send otp payload", payload);
  try {
    const response = yield call(loginSendOtp, payload);
    yield put(loginSendOtpSuccess(response.data));
  } catch (error) {
    yield put(loginSendOtpFailure(error.message || "Failed to send login OTP."));
  }
}

function* handleLoginVerifyOtp({payload}) {
  try {
    console.log("login verify otp payload", payload);
    const response = yield call(loginVerifyOtp, payload);

    if (response && response.data) {
      const responseData = response.data?.data || response.data;
      
      // Extract and save token to localStorage for login as well
      const token = responseData?.token || 
                    responseData?.accessToken || 
                    responseData?.data?.token ||
                    responseData?.data?.accessToken ||
                    response.data?.token ||
                    response.data?.accessToken;
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');
      } else {
        console.warn('No token found in login OTP verification response:', responseData);
      }
      
      yield put(loginVerifyOtpSuccess(responseData));
    } else {
      yield put(loginVerifyOtpFailure(`No data found for login OTP verification`));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to verify login OTP.";
    yield put(loginVerifyOtpFailure(errorMessage));
  }
}

function* handleSignUp({payload}) {
  try {
    console.log("signup payload", payload);
    const response = yield call(signUp, payload);

    if (response && response.data) {
      const responseData = response.data?.data || response.data;
      
      // Extract token from various possible response structures
      // Check multiple possible locations for the token
      const token = responseData?.token || 
                    responseData?.accessToken || 
                    responseData?.data?.token ||
                    responseData?.data?.accessToken ||
                    response.data?.token ||
                    response.data?.accessToken ||
                    response.data?.data?.token ||
                    response.data?.data?.accessToken;
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('✅ Token saved to localStorage from /api/signup:', token.substring(0, 20) + '...');
        console.log('Token will be automatically used in Authorization header for subsequent API calls');
      } else {
        console.warn('⚠️ No token found in signup response. Response structure:', {
          responseData,
          fullResponse: response.data
        });
      }
      
      yield put(signUpSuccess(responseData));
    } else {
      yield put(signUpFailure("Invalid response from server"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to complete signup.";
    yield put(signUpFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(signUpSendOtpRequest.type, handleSignUpSendOtp);
  yield takeLatest(signUpVerifyOtpRequest.type, handleSignUpVerifyOtp);
  yield takeLatest(signUpRequest.type, handleSignUp);
  yield takeLatest(loginSendOtpRequest.type, handleLoginSendOtp);
  yield takeLatest(loginVerifyOtpRequest.type, handleLoginVerifyOtp);
}