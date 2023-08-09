import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  data: [],
  approvalData: [],
  taskData: [],
  status: [],
  error: '',
  timesheetIdDetails: {},
  overTimeData: [],
  filterAppr: ''
};

export const getTimeSheetApprovalAsync = createAsyncThunk(
  'timesheetApproval/approvalTimesheetApprovalDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Timesheet/Service/getTimesheetsForApproval');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getTaskDetailsAsync = createAsyncThunk(
  'timesheetApproval/getTaskDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.getData(
        `/techstep/api/Timesheet/Service/getSingleTimeSheetById/${payload.id}`
      );
      dispatch(setTimesheetDetails(payload));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const postBulkApproveDetailsAsync = createAsyncThunk(
  'timesheetApproval/postBulkDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData(`/techstep/api/Timesheet/Service/bulkApprove`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const postSingleApproveDetailsAsync = createAsyncThunk(
  'timesheetApproval/postSingleDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData(`/techstep/api/Timesheet/Service/complete`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getOverTimeApprovalAsync = createAsyncThunk(
  'overTime/getOverTimeApproval',
  async (__payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/OverTime/Service/getOverTimeForApproval');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const timesheetApprovalSlice = createSlice({
  name: 'timesheetApproval',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setTimesheetDetails: (state, action) => {
      state.timesheetIdDetails = action.payload;
    },
    setFilterAppr: (state, action) => {
      state.filterAppr = action.payload;
    }
  },
  extraReducers: {
    [getTimeSheetApprovalAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getTimeSheetApprovalAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        approvalData: action.payload,
        isLoading: false
      };
    },
    [getTimeSheetApprovalAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getTaskDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getTaskDetailsAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        taskData: action.payload,
        isLoading: false
      };
    },
    [getTaskDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  },
  [postBulkApproveDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
  [postBulkApproveDetailsAsync.fulfilled]: (state, action) => {
    console.log('Fetched Successfully! - ', action.payload);
    return {
      ...state,
      isLoading: false
    };
  },
  [postBulkApproveDetailsAsync.rejected]: (state, action) => ({
    ...state,
    error: action.payload.message,
    isLoading: false
  }),
  [postSingleApproveDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
  [postSingleApproveDetailsAsync.fulfilled]: (state, action) => {
    console.log('Posted Successfully! - ', action.payload);
    return {
      ...state,
      isLoading: false
    };
  },
  [postSingleApproveDetailsAsync.rejected]: (state, action) => ({
    ...state,
    error: action.payload.message,
    isLoading: false
  }),
  [getOverTimeApprovalAsync.pending]: (state) => ({ ...state, isLoading: true }),
  [getOverTimeApprovalAsync.fulfilld]: (state, action) => {
    console.log('Fetched Successfully! - ', action.payload);
    return {
      ...state,
      overTimeData: action.payload,
      isLoading: false
    };
  },
  [getOverTimeApprovalAsync.rejected]: (state, action) => ({
    ...state,
    error: action.payload.message,
    isLoading: false
  })
});

export default timesheetApprovalSlice.reducer;
export const { startLoading, stopLoading, setTimesheetDetails, setFilterAppr } = timesheetApprovalSlice.actions;

// Selector
export const getIsLoadingFromTSAppr = (state) => state.timesheetApproval.isLoading;
export const getApprovalListFromTSAppr = (state) => state.timesheetApproval.approvalData;
export const getTaskListFromTSAppr = (state) => state.timesheetApproval.taskData;
export const getErrorFromTSAppr = (state) => state.timesheetApproval.error;
export const getTimesheetIdDetailsFromTSAppr = (state) => state.timesheetApproval.timesheetIdDetails;
export const getOverTimeListFromTSAppr = (state) => state.timesheetApproval.overTimeData;
export const getFilterTimesheetAppr = (state) => state.timesheetApproval.filterAppr;
