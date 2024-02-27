/* eslint-disable object-shorthand */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  data: [],
  approvalData: [],
  taskData: [],
  status: [],
  error: '',
  wfhIdDetails: {}
};

export const getWfhListApprovalAsync = createAsyncThunk(
  'wfhApproval/approvalList',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Timesheet/Service/wfh/taskList');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getWfhTaskDeetailsAsync = createAsyncThunk(
  'wfhApproval/getWfhTaskDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.getData(`/techstep/api/Timesheet/Service/wfhtask/${payload.taskid}`);
      dispatch(setWfhDetails(payload));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const approveTaskAsync = createAsyncThunk(
  'wfhApproval/approveTask',
  async ({ taskId, comments }, { rejectWithValue }) => {
    try {
      const response = await api.methods.putData(`/techstep/api/Timesheet/Service/wfhtaskComplete/${taskId}`, {
        status: 'Reviewed',
        comments: comments
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// export const rejectTaskAsync = createAsyncThunk(
//   'wfhApproval/rejectTask',
//   async ({ taskId, comments }, { rejectWithValue }) => {
//     try {
//       const response = await api.methods.putData(`/techstep/api/Timesheet/Service/wfhtaskComplete/${taskId}`, {
//         status: 'rejected',
//         comments: comments
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

const wfhApprovalSlice = createSlice({
  name: 'wfhApproval',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setWfhDetails: (state, action) => {
      state.wfhIdDetails = action.payload;
    }
  },
  extraReducers: {
    [getWfhListApprovalAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getWfhListApprovalAsync.fulfilled]: (state, action) => {
      console.log('Fetched SuccessFully!', action.payload);
      return {
        ...state,
        approvalData: action.payload,
        isLoading: false
      };
    },
    [getWfhListApprovalAsync.rejected]: (state, action) => ({
      ...state,
      error: action.error.message,
      isLoading: false
    }),
    [getWfhTaskDeetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getWfhTaskDeetailsAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully', action.payload);
      return {
        ...state,
        taskData: action.payload,
        isLoading: false
      };
    },
    [getWfhTaskDeetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.error.message,
      isLoading: false
    }),
    [approveTaskAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [approveTaskAsync.fulfilled]: (state, action) => {
      console.log('Approved SuccessFully!', action.payload);
      return {
        ...state,
        isLoading: false
      };
    },
    [approveTaskAsync.rejected]: (state, action) => ({
      ...state,
      error: action.error.message,
      isLoading: false
    })
    // [rejectTaskAsync.pending]: (state) => ({ ...state, isLoading: true }),
    // [rejectTaskAsync.fulfilled]: (state, action) => {
    //   console.log('Rejected Successfully!', action.payload);
    //   return {
    //     ...state,
    //     isLoading: false
    //   };
    // },
    // [rejectTaskAsync.rejected]: (state, action) => ({
    //   ...state,
    //   error: action.error.message,
    //   isLoading: false
    // })
  }
});

export default wfhApprovalSlice.reducer;
export const { startLoading, stopLoading, setWfhDetails } = wfhApprovalSlice.actions;

// Selector
export const getIsLoadingFromWfhApproval = (state) => state.wfhApproval.isLoading;
export const getApprovalListFromWfh = (state) => state.wfhApproval.approvalData;
export const getTaskListFromWfh = (state) => state.wfhApproval.taskData;
export const getErrorFromWfhApproval = (state) => state.wfhApproval.error;
export const getWfhIdDetailsFromWfhApproval = (state) => state.wfhApproval.wfhIdDetails;
