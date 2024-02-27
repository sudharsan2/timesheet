import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  isSuccess: false,
  leavePoliciesList: [],
  leavePendingList: [],
  countries: [],
  currentBalance: [],
  leaveStatuses: [],
  error: ''
};

// Get all countries
export const getAllCountriesAsync = createAsyncThunk(
  'leavemaster/getAllCountries',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Country/Service/getListOfCountries');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all Leave policy master
export const getAllLeavePolicyMasterAsync = createAsyncThunk(
  'leavemaster/getAllLeavePolicyMaster',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Leave/Service/getLeaveMaster');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all Leave Pending For a user
export const getPendingLeaveForApprovalAsync = createAsyncThunk(
  'leavemaster/getPendingLeaveForApproval',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Leave/Service/getPendingLeaveForApproval?value=user');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get leave balance list for a user
export const getAllLeaveBalanceForUserAsync = createAsyncThunk(
  'leavemaster/getAllLeaveBalanceForUser',
  async (_payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Leave/Service/getDataToApplyLeave');

      if (response.status === 200) {
        dispatch(getPendingLeaveForApprovalAsync());
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Create new leave policy
export const createNewPolicyActionAsync = createAsyncThunk(
  'leavemaster/createNewPolicy',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Leave/Service/createOrUpdateLeaveMaster', payload);
      if (response.status === 201) {
        dispatch(getAllLeavePolicyMasterAsync());
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getPendingLeaveForApproval = createAsyncThunk(
  'leaveapproval/getPendingLeaveForApproval',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        '/techstep/api/Leave/Service/getPendingLeaveForApproval?value=manager'
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getApproveorRejectLeaveApproval = createAsyncThunk(
  'leaveapproval/getApproveorRejectLeaveApproval',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData('/techstep/api/Leave/Service/approveOrRejectLeave', _payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);
// appply Leave
export const applyLeaveActionAsync = createAsyncThunk(
  'leavemaster/applyLeave',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Leave/Service/applyLeave', payload);
      if (response.status === 201) {
        dispatch(getAllLeavePolicyMasterAsync());
      }
      setTimeout(() => dispatch(setSuccess(false)), 3000);
      return response.data;
    } catch (err) {
      setTimeout(() => dispatch(setError(false)), 3000);
      return rejectWithValue(err.data);
    }
  }
);

const leaveMaster = createSlice({
  name: 'leaveMaster',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: {
    // get all countries
    [getAllCountriesAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllCountriesAsync.fulfilled]: (state, action) => {
      console.log('Countries fetched Successfully!');
      return {
        ...state,
        countries: action.payload,
        isLoading: false
      };
    },
    [getAllCountriesAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // create new policy action
    [createNewPolicyActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createNewPolicyActionAsync.fulfilled]: (state) => ({
      ...state,
      isLoading: false
    }),
    [createNewPolicyActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // get all leave policy master
    [getAllLeavePolicyMasterAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllLeavePolicyMasterAsync.fulfilled]: (state, action) => ({
      ...state,
      leavePoliciesList: action.payload,
      isLoading: false
    }),
    [getAllLeavePolicyMasterAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // get all leave pending
    [getPendingLeaveForApproval.pending]: (state) => ({ ...state, isLoading: true }),
    [getPendingLeaveForApproval.fulfilled]: (state, action) => ({
      ...state,
      leavePendingList: action.payload,
      isLoading: false
    }),
    [getPendingLeaveForApproval.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getAllLeaveBalanceForUserAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllLeaveBalanceForUserAsync.fulfilled]: (state, action) => ({
      ...state,
      currentBalance: action.payload,
      isLoading: false
    }),
    [getAllLeaveBalanceForUserAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // get all leave approval or reject
    [getApproveorRejectLeaveApproval.pending]: (state) => ({ ...state, isLoading: true }),
    [getApproveorRejectLeaveApproval.fulfilled]: (state) => ({
      ...state,
      isLoading: false
    }),
    [getApproveorRejectLeaveApproval.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [applyLeaveActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [applyLeaveActionAsync.fulfilled]: (state) => ({
      ...state,
      isSuccess: true,
      isLoading: false
    }),
    [applyLeaveActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getPendingLeaveForApprovalAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getPendingLeaveForApprovalAsync.fulfilled]: (state, action) => ({
      ...state,
      leaveStatuses: action.payload,
      isLoading: false
    }),
    [getPendingLeaveForApprovalAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default leaveMaster.reducer;
export const { startLoading, stopLoading, setSuccess, setError } = leaveMaster.actions;

// Selector
export const getIsLoadingFromLeaveMaster = (state) => state.leaveMaster.isLoading;
export const getCoutriesFromLeaveMaster = (state) => state.leaveMaster.countries;
export const getleavePoliciesListFromLeaveMaster = (state) => state.leaveMaster.leavePoliciesList;
export const getLeavePendingList = (state) => state.leaveMaster.leavePendingList;
export const getCurrentBalanceFromLeaveMaster = (state) => state.leaveMaster.currentBalance;
export const getIsAppliedSuccess = (state) => state.leaveMaster.isSuccess;
export const getErrorMessageFromLeaveMaster = (state) => state.leaveMaster.error;
export const getLeaveStatusedFromLeaveMaster = (state) => state.leaveMaster.leaveStatuses;
