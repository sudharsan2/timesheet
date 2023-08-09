// import { map, filter } from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  isAssetDetailsCaptured: false,
  userDetails: null,
  error: '',
  assetRefObj: null,
  isAssetDataCaptured: false
};

const handleTokenExpired = (exp) => {
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  console.log(timeLeft);
  expiredTimer = window.setTimeout(() => {
    console.log('Session expired');
    // You can do what ever you want here, like show a notification
  }, timeLeft);
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    // This function below will handle when token is expired
    const { exp, role, username } = jwtDecode(accessToken);
    localStorage.setItem('role', role);
    localStorage.setItem('empId', username);

    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
  }
};

// Login action
export const fetchLoginDetailsAsync = createAsyncThunk(
  'auth/fetchLoginDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/auth/signin', payload);

      setSession(response.data.accessToken);
      await dispatch(getAssetRefObj());
      await dispatch(setIsAssetDetailsCaptured(response.data));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Logout action
export const logoutAction = () => (dispatch) => {
  dispatch(setIsAuthenticated(false));
  dispatch({ type: 'USER_LOGOUT' });
};

// Asset Ref Object
export const getAssetRefObj = createAsyncThunk('auth/getAssetRefObj', async (_, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/Assets/Service/getLaptopLOVList');

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

// Capture asset action captureAssetDetailsAction

export const captureAssetDetailsAction = createAsyncThunk(
  'auth/captureAssetDetailsAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Assets/Service/createLaptopDetails', payload);
      setTimeout(() => dispatch(setStatus()), 5000);
      return response.data;
    } catch (err) {
      setTimeout(() => dispatch(resetError()), 5000);
      return rejectWithValue(err.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsAssetDetailsCaptured: (state, action) => {
      state.isAssetDetailsCaptured = action.payload.is_laptop_details_submitted !== 'Y';
    },
    setStatus: (state) => {
      state.isAssetDataCaptured = false;
    },
    resetError: (state) => {
      state.error = '';
    }
  },
  extraReducers: {
    [fetchLoginDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [fetchLoginDetailsAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully!', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        userDetails: action.payload,
        isLoading: false
      };
    },
    [fetchLoginDetailsAsync.rejected]: (state, action) => ({
      ...state,
      isAuthenticated: false,
      error: action.payload.message,
      isLoading: false
    }),
    [getAssetRefObj.pending]: (state) => ({
      ...state,
      isLoading: true
    }),
    [getAssetRefObj.fulfilled]: (state, action) => ({
      ...state,
      assetRefObj: action.payload,
      isLoading: false
    }),
    [getAssetRefObj.rejected]: (state) => ({
      ...state,
      isLoading: false
    }),
    [captureAssetDetailsAction.pending]: (state) => ({
      ...state,
      isLoading: true
    }),
    [captureAssetDetailsAction.fulfilled]: (state) => ({
      ...state,
      isAssetDataCaptured: true,
      isLoading: false
    }),
    [captureAssetDetailsAction.rejected]: (state, action) => ({
      ...state,
      isLoading: false,
      error: action.payload.message
    })
  }
});

export default authSlice.reducer;
export const { startLoading, stopLoading, setIsAuthenticated, setIsAssetDetailsCaptured, setStatus, resetError } =
  authSlice.actions;

// Selector
export const getIsLoadingFromAuth = (state) => state.auth.isLoading;
export const getIsAuthenticatedFromAuth = (state) => state.auth.isAuthenticated;
export const getErrorFromAuth = (state) => state.auth.error;
export const getUserDetailsFromAuth = (state) => state.auth.userDetails;
export const getIsAssetDetailsCaptured = (state) => state.auth.isAssetDetailsCaptured;
export const getAssetRefObjState = (state) => state.auth.assetRefObj;
export const getIsAssetDataCaptured = (state) => state.auth.isAssetDataCaptured;
