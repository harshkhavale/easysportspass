import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicApi, setAuthToken } from '../api';
import { ENDPOINTS } from '../constants/endpoints';

const initialState = {
  user: null,
  token: null,
  status: 'idle',
  otpStatus: 'idle',
  temp: null,
  error: null,
  resetPassMessages: {
    type: '',
    emailOrMobile: '',
  },
};

export const fetchUnauthorizedToken = createAsyncThunk('auth/fetchUnauthorizedToken', async () => {
  const response = await publicApi.get(ENDPOINTS.AUTH.INIT);
  setAuthToken(response.data.token.result);
  return response.data.token.result;
});
export const fetchUserPlan = createAsyncThunk('auth/fetchUserPlan', async (userId, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`${ENDPOINTS.MEMBERSHIP.GET_USER_PLAN}/${userId}`);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch user plan.';
    return rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await publicApi.put(ENDPOINTS.AUTH.UPDATE_USER, userData);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Update failed. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ email, mobile }, { rejectWithValue }) => {
  try {
    const endpoint = email ? ENDPOINTS.MESSAGE.SEND_EMAIL_OTP : ENDPOINTS.MESSAGE.SEND_MOBILE_OTP;
    const response = await publicApi.post(endpoint, { email, mobile });
    return response.data;
  } catch (err) {
    console.error('OTP Error:', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, mobile, verificationCode }) => {
  const endpoint = email ? ENDPOINTS.MESSAGE.VERIFY_EMAIL_OTP : ENDPOINTS.MESSAGE.VERIFY_MOBILE_OTP;
  const response = await publicApi.post(endpoint, {
    email,
    mobile,
    verificationCode,
  });
  return response.data;
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await publicApi.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await publicApi.post(ENDPOINTS.AUTH.LOGIN, userData);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
    return rejectWithValue(errorMessage);
  }
});
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
    },
    setCorporateEmail: (state, action) => {
      state.temp = action.payload;
    },
    setVerified: state => {
      if (state.user) {
        state.user.emailVerified = 1;
        state.user.mobileVerified = 1;
      }
    },
    setResetPasswordMessage(state, action) {
      state.resetPassMessages = action.payload;
    },
    setUpdateUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUnauthorizedToken.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUnauthorizedToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(fetchUnauthorizedToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendOtp.pending, state => {
        state.otpStatus = 'loading';
      })
      .addCase(sendOtp.fulfilled, state => {
        state.otpStatus = 'succeeded';
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(verifyOtp.pending, state => {
        state.status = 'loading';
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUserPlan.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserPlan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.user) {
          state.user.plan = action.payload; // Assuming the response payload is the user's plan
        }
      })
      .addCase(fetchUserPlan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout, setCorporateEmail, setVerified, setResetPasswordMessage, setUpdateUser } = authSlice.actions;
export default authSlice.reducer;
