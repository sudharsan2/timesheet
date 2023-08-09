import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  data: [],
  editData: [],
  selectedDate: {},
  timeSheetId: '',
  category: [],
  status: [],
  error: ''
};

export const resetPasswordAsync = createAsyncThunk(
  'resetpassword/resetPasswordDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/auth/forgetPassword', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const resetPasswordAction = createAsyncThunk(
  'resetpassword/resetPasswordDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData('/techstep/api/auth/updateNewPassword', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const updatePasswordAction = createAsyncThunk(
  'resetpassword/updatePasswordDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData('/techstep/api/auth/updateNewPasswordForUser', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const resetpasswordSlice = createSlice({
  name: 'resetpassword',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    }
  },
  extraReducers: {
    [resetPasswordAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [resetPasswordAsync.fulfilled]: (state) => {
      console.log('Posted Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [resetPasswordAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default resetpasswordSlice.reducer;
export const { startLoading, stopLoading } = resetpasswordSlice.actions;

// Selector
export const getIsLoadingFromResetPassword = (state) => state.resetpassword.isLoading;
export const getTimesheetListFromResetPassword = (state) => state.resetpassword.data;
export const getErrorFromResetPassword = (state) => state.resetpassword.error;
