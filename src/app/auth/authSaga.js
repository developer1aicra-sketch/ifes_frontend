import { call, put, takeLatest } from 'redux-saga/effects';
import { signUpSendOtp, signUpVerifyOtp, signUp, loginSendOtp, loginVerifyOtp, login } from './authApi';
import { setAuthToken, setRoboclubAuthToken } from '../../api/authToken';
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
  loginRequest,
  loginSuccess,
  loginFailure,
} from './authSlice';

/** Extract token from verify OTP / signup response (handles data.data.token, data.token, etc.) */
function extractToken(response) {
  if (!response?.data) return null;
  const d = response.data;
  const inner = d?.data;
  return inner?.token ?? inner?.accessToken ?? d?.token ?? d?.accessToken ?? null;
}

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

function* handleSignUpVerifyOtp({ payload }) {
  try {
    const response = yield call(signUpVerifyOtp, payload);

    if (response && response.data) {
      const responseData = response.data?.data ?? response.data;
      const token = extractToken(response);

      if (token) {
        setAuthToken(token);
        console.log('Token from verify OTP saved; will be sent as Bearer to /signup');
      } else {
        console.warn('No token in verify OTP response:', response.data);
      }

      yield put(signUpVerifyOtpSuccess(responseData));
    } else {
      yield put(signUpVerifyOtpFailure('Invalid OTP or expired. Please request a new OTP.'));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to verify signup OTP.';
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

function* handleLoginVerifyOtp({ payload }) {
  try {
    const response = yield call(loginVerifyOtp, payload);

    if (response && response.data) {
      const responseData = response.data?.data ?? response.data;
      const token = extractToken(response);
      if (token) setRoboclubAuthToken(token);
      yield put(loginVerifyOtpSuccess(responseData));
    } else {
      yield put(loginVerifyOtpFailure('No data found for login OTP verification'));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to verify login OTP.';
    yield put(loginVerifyOtpFailure(errorMessage));
  }
}

function* handleSignUp({ payload }) {
  try {
    // POST /signup — Bearer token from verify OTP is attached by axios interceptor
    const response = yield call(signUp, payload);

    if (response && response.data) {
      const responseData = response.data?.data ?? response.data;
      const token = extractToken(response);
      if (token) {
        setAuthToken(token);
        console.log('Token from /signup updated for subsequent requests');
      }
      yield put(signUpSuccess(responseData));
    } else {
      yield put(signUpFailure('Invalid response from server'));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to complete signup.';
    yield put(signUpFailure(errorMessage));
  }
}
function* handleLogin({ payload }) {
  try {
    // POST /auth/login with { email, password }
    const response = yield call(login, payload);

    if (response && response.data) {
      const responseData = response.data?.data ?? response.data;

      const token =
        responseData?.token ??
        responseData?.accessToken ??
        response.data?.token ??
        response.data?.accessToken;

      if (token) {
        setRoboclubAuthToken(token);
      } else {
        console.warn('No token in login response:', responseData);
      }

      yield put(loginSuccess(responseData));
    } else {
      yield put(loginFailure('No data in login response'));
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ?? error.message ?? 'Login failed. Please try again.';
    yield put(loginFailure(errorMessage));
  }
}
export default function* authSaga() {
  yield takeLatest(signUpSendOtpRequest.type, handleSignUpSendOtp);
  yield takeLatest(signUpVerifyOtpRequest.type, handleSignUpVerifyOtp);
  yield takeLatest(signUpRequest.type, handleSignUp);
  yield takeLatest(loginSendOtpRequest.type, handleLoginSendOtp);
  yield takeLatest(loginVerifyOtpRequest.type, handleLoginVerifyOtp);
  yield takeLatest(loginRequest.type, handleLogin);

}