import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  isSuccess: false,
  overTimeList: [],
  overTimeSingleList: [],
  overTimeDetails: {},
  error: ''
};

// Get all list of overtime
export const getOverTimeListAsync = createAsyncThunk(
  'overTimeApproval/getOverTimeList',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/OverTime/Service/getOverTimeForApproval');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// get single overTime
export const getOverTimeTaskDetailsAsync = createAsyncThunk(
  'overTimeApproval/getOverTimeTaskDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.getData(`/techstep/api/OverTime/Service/getSingleOverTimeById/${payload.id}`);
      dispatch(setOverTimeDetails(payload));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const postSingleOTApproveDetailsAsync = createAsyncThunk(
  'overTimeApproval/postSingleOTDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData(`/techstep/api/OverTime/Service/complete`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const postBulkApproveOTDetailsAsync = createAsyncThunk(
  'overTimeApproval/postBulkOTDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData(`/techstep/api/OverTime/Service/bulkApprove`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const overTimeApproval = createSlice({
  name: 'overTimeApproval',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setOverTimeDetails: (state, action) => {
      state.overTimeDetails = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: {
    // get all overtime list
    [getOverTimeListAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getOverTimeListAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        overTimeList: action.payload,
        isLoading: false
      };
    },
    [getOverTimeListAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getOverTimeTaskDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getOverTimeTaskDetailsAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        overTimeSingleList: action.payload,
        isLoading: false
      };
    },
    [getOverTimeTaskDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default overTimeApproval.reducer;
export const { startLoading, stopLoading, setSuccess, setError, setOverTimeDetails } = overTimeApproval.actions;

// Selector
export const getIsLoadingFromOverTimeAppr = (state) => state.overTimeApproval.isLoading;
export const getOverTimeListFromOverTimeAppr = (state) => state.overTimeApproval.overTimeList;
export const getOverTimeSingleListFromOverTimeAppr = (state) => state.overTimeApproval.overTimeSingleList;
export const getOverTimeDetailsFromOverTimeAppr = (state) => state.overTimeApproval.overTimeDetails;
export const getErrorMessageFromOverTimeAppr = (state) => state.overTimeApproval.error;
