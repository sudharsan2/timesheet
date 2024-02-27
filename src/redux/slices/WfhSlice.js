/* eslint-disable no-else-return */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  isApproving: false, // Add this
  isRejecting: false, // Add this
  wfhRequest: [],
  wfhRequestApprove: [],
  wfhTasks: [],
  msg: '',
  error: ''
};

export const createWorkFromRequestAsync = createAsyncThunk(
  'wfh/createWorkFromRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Timesheet/Service/wfhrequest', payload);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const updateWorkFromRequestAsync = createAsyncThunk(
  'wfh/updateWorkFromRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Timesheet/Service/update/wfhrequest', payload);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getWorkFromHomeRequestAsync = createAsyncThunk(
  'wfh/getWorkFromHomeRequest',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Timesheet/Service/mywfh/request');
      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getWorkFromHomeRequestApproveAsync = createAsyncThunk(
  'wfh/getWorkFromHomeRequestApprove',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Timesheet/Service/wfh/requestList');
      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const approveOrRejectRequestAsync = createAsyncThunk(
  'wfh/approveOrRejectRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData('/techstep/api/Timesheet/Service/wfhComplete', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const WfhSlice = createSlice({
  name: 'wfh',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    approving: (state) => {
      state.isApproving = false;
    },
    getRequestList: (state) => {
      state.wfhRequest = [];
    },
    setErrorNull: (state, action) => {
      state.error = action.payload;
    },
    setMsgNull: (state, action) => {
      state.msg = action.payload;
    }
  },

  extraReducers: {
    [createWorkFromRequestAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createWorkFromRequestAsync.fulfilled]: (state, action) => {
      console.log('Work From Requested Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createWorkFromRequestAsync.rejected]: (state, action) => {
      console.log('Failed to work from request', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },

    [updateWorkFromRequestAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [updateWorkFromRequestAsync.fulfilled]: (state, action) => {
      console.log('Work From Requested Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [updateWorkFromRequestAsync.rejected]: (state, action) => {
      console.log('Failed to work from request', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },

    [getWorkFromHomeRequestAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getWorkFromHomeRequestAsync.fulfilled]: (state, action) => {
      console.log('All Requests Fetched SuccessFully!');
      return {
        ...state,
        wfhRequest: action.payload,
        isLoading: false
      };
    },
    [getWorkFromHomeRequestAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getWorkFromHomeRequestApproveAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getWorkFromHomeRequestApproveAsync.fulfilled]: (state, action) => {
      console.log('All Requests Fetched SuccessFully!');
      return {
        ...state,
        wfhRequestApprove: action.payload,
        isLoading: false
      };
    },
    [getWorkFromHomeRequestApproveAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [approveOrRejectRequestAsync.pending]: (state) => ({
      ...state,
      isLoading: true,
      isApproving: true, // Set isApproving to true
      isRejecting: false // Set isRejecting to false
    }),
    [approveOrRejectRequestAsync.fulfilled]: (state, action) => {
      console.log('Action Success', action.payload);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false,
        isApproving: false, // Reset isApproving
        isRejecting: false // Reset isRejecting
      };
    },
    [approveOrRejectRequestAsync.rejected]: (state, action) => {
      console.log('Rejected Action:', action);
      if (action.payload && action.payload.message) {
        return {
          ...state,
          error: action.payload.message,
          isLoading: false,
          isApproving: false, // Reset isApproving
          isRejecting: false // Reset isRejecting
        };
      } else {
        return {
          ...state,
          error: 'An error occurred',
          isLoading: false,
          isApproving: false, // Reset isApproving
          isRejecting: false // Reset isRejecting
        };
      }
    }
  }
});

export default WfhSlice.reducer;
export const { startLoading, stopLoading, setErrorNull, getRequestList, setMsgNull, approving } = WfhSlice.actions;

// Selector
export const selectIsWfhLoading = (state) => state.wfh.isLoading;
export const selectIsWfhApproved = (state) => state.wfh.isApproving;
export const selectWfhData = (state) => state.wfh.msg;
export const selectWfhError = (state) => state.wfh.error;
export const getAllRequest = (state) => state.wfh.wfhRequest;
export const getAllRequestApprove = (state) => state.wfh.wfhRequestApprove;
