import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import fileSaver from '../../utils/fileSaver';

const initialState = {
  isLoading: false,
  data: [],
  editData: [],
  selectedDate: {},
  timeSheetId: '',
  timeSheetStatus: '',
  category: [],
  status: [],
  project: [],
  error: '',
  msg: '',
  timesheetDetails: {
    taskdetails: []
  },
  isSubmittedSuccessfully: false,
  // overTime: {
  //   overTimeTaskDetails: []
  // }
  overTime: [],
  overTimeId: '',
  overTimeStatus: '',
  managercomments: ''
};

export const createTimeSheetEntryAsync = createAsyncThunk(
  'timesheet/createTimesheetDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    console.log('🚀 => payload', payload);
    try {
      const response = await api.methods.postData('/techstep/api/Timesheet/Service/submit', payload.submitPayload);

      if (response.status === 200) {
        dispatch(getTimeSheetEntryAsync(payload.queryPayload));
      }
      return response.data;
    } catch (err) {
      console.log(err.data);
      return rejectWithValue(err.data);
    }
  }
);

export const newCreateTimeSheetEntryAsync = createAsyncThunk(
  'timesheet/newCreateTimesheetDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Timesheet/Service/submit', payload);

      if (response.status === 200) {
        dispatch(getTimeSheetEntryAsync(payload));
      }
      return response.data;
    } catch (err) {
      console.log(err.data);
      return rejectWithValue(err.data);
    }
  }
);

export const getTimeSheetEntryAsync = createAsyncThunk(
  'timesheet/fetchTimesheetDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(
        setTimesheetDetails({
          taskdetails: []
        })
      );
      const response = await api.methods.postData('/techstep/api/Timesheet/Service/initiate', payload);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getCategoryLOVAsync = createAsyncThunk(
  'timesheet/getCategoryLOV',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Timesheet/Service/getListOfCategory');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getStatusLOVAsync = createAsyncThunk('timesheet/getStatusLOV', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/Timesheet/Service/getListOfStatus');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const editTimesheetAsync = createAsyncThunk('timesheet/editTimesheet', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData(`/techstep/api/Timesheet/Service/getSingleTaskById/${payload}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getProjectLOVAsync = createAsyncThunk('timesheet/getProjectLOV', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/Timesheet/Service/getListOfProjects');
    // const response = await api.methods.getData('/techstep/api/Project/Service/getAllProjects');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getOverTimeAsync = createAsyncThunk('timesheet/getOverTimeAsync', async (payload, { rejectWithValue }) => {
  try {
    // dispatch(
    //   setOverTimeDetails({
    //     overTimeTaskDetails: []
    //   })
    // );
    const response = await api.methods.postData('/techstep/api/OverTime/Service/initiate', payload);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const overTimeEntryAsync = createAsyncThunk(
  'timesheet/overTimeEntryAsync',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      console.log(payload);
      const response = await api.methods.postData('/techstep/api/OverTime/Service/submit', payload);
      console.log(response);
      if (response.status === 200) {
        dispatch(getOverTimeAsync(payload));
      }
      return response.data;
    } catch (err) {
      console.log(err.data);
      return rejectWithValue(err.data);
    }
  }
);

// Download the excel template for bulk upload
export const downloadTimesheetTemplateActionAsync = createAsyncThunk(
  'timesheet/downloadTimesheetTemplateAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getDataWithOptions('/techstep/api/Timesheet/Service/download/samplefile', {
        responseType: 'blob' // **don't forget to add this**
      });
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], {
        type: contentType
      });
      const filename = response.headers['content-disposition'].split('filename=')[1];
      fileSaver(blob, filename);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// uploadTimesheetAction
export const uploadTimesheetActionAsync = createAsyncThunk(
  'timesheet/uploadTimesheetActionAsync',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Timesheet/Service/upload/file', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setDateValue: (state, action) => {
      state.selectedDate = action.payload;
    },
    setTimeSheetEmptyValue: (state, action) => {
      console.log(action.payload);
      state.data = action.payload;
      state.timesheetDetails = {
        taskdetails: []
      };
    },
    setErrorNull: (state, action) => {
      state.error = action.payload;
    },
    setTimesheetDetails: (state, action) => {
      state.timesheetDetails = action.payload;
    },
    addRowsInTaskDetails: (state, action) => {
      if (Object.keys(state.timesheetDetails).length) {
        const temp = [...state.timesheetDetails.taskdetails];
        temp.push(action.payload);
        console.log('🚀 => temp', temp);
        state.timesheetDetails.taskdetails = temp;
      }
    },
    editRowsInTaskDetails: (state, action) => {
      if (Object.keys(state.timesheetDetails).length) {
        state.timesheetDetails.taskdetails = action.payload;
      }
    },
    setOverTimeDetails: (state, action) => {
      state.overTime = action.payload;
    },
    addOverTimeInTaskDetails: (state, action) => {
      // if (Object.keys(state.overTime).length) {
      const temp = [...state.overTime];
      temp.push(action.payload);
      console.log('🚀 => temp', temp);
      state.overTime = temp;
    },
    editRowsInOverTimeDetails: (state, action) => {
      if (Object.keys(state.timesheetDetails).length) {
        state.overTime = action.payload;
      }
    },
    setMsgNull: (state, action) => {
      state.msg = action.payload;
    }
  },
  extraReducers: {
    [createTimeSheetEntryAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createTimeSheetEntryAsync.fulfilled]: (state) => {
      console.log('Posted Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [createTimeSheetEntryAsync.rejected]: (state, action) => {
      console.log('error');
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [newCreateTimeSheetEntryAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [newCreateTimeSheetEntryAsync.fulfilled]: (state) => {
      console.log('Posted Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [newCreateTimeSheetEntryAsync.rejected]: (state, action) => {
      console.log('error');
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [getTimeSheetEntryAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getTimeSheetEntryAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully!', action.payload);
      return {
        ...state,
        data: action.payload.responseData.taskdetails,
        timeSheetId: action.payload.responseData.timesheetId,
        timeSheetStatus: action.payload.responseData.status,
        timesheetDetails: action.payload.responseData,
        isLoading: false
      };
    },
    [getTimeSheetEntryAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getCategoryLOVAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getCategoryLOVAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        category: action.payload,
        isLoading: false
      };
    },
    [getCategoryLOVAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getStatusLOVAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getStatusLOVAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        status: action.payload,
        isLoading: false
      };
    },
    [getStatusLOVAsync.rejected]: (state, action) => ({
      ...state,
      isAuthenticated: false,
      error: action.payload.message,
      isLoading: false
    }),
    [editTimesheetAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [editTimesheetAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        editData: action.payload,
        isLoading: false
      };
    },
    [editTimesheetAsync.rejected]: (state, action) => ({
      ...state,
      isAuthenticated: false,
      error: action.payload.message,
      isLoading: false
    }),

    [getProjectLOVAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getProjectLOVAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        project: action.payload,
        isLoading: false
      };
    },
    [getProjectLOVAsync.rejected]: (state, action) => ({
      ...state,
      isAuthenticated: false,
      error: action.payload.message,
      isLoading: false
    }),
    [getOverTimeAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getOverTimeAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload.responseData);
      return {
        ...state,
        isAuthenticated: true,
        overTimeId: action.payload.responseData.overtimeId,
        overTime: action.payload.responseData.taskdetails,
        overTimeStatus: action.payload.responseData.status,
        managercomments: action.payload.responseData.managercomments,
        isLoading: false
      };
    },
    [getOverTimeAsync.rejected]: (state, action) => ({
      ...state,
      isAuthenticated: false,
      error: action.payload.message,
      isLoading: false
    }),

    // downloadTimesheetTemplateActionAsync
    [downloadTimesheetTemplateActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [downloadTimesheetTemplateActionAsync.fulfilled]: (state) => {
      console.log('Updated Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [downloadTimesheetTemplateActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // uploadTimesheetActionAsync
    [uploadTimesheetActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [uploadTimesheetActionAsync.fulfilled]: (state, action) => {
      console.log('Uploaded Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [uploadTimesheetActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default timesheetSlice.reducer;
export const {
  startLoading,
  stopLoading,
  setDateValue,
  setTimeSheetEmptyValue,
  setErrorNull,
  addRowsInTaskDetails,
  editRowsInTaskDetails,
  setTimesheetDetails,
  addOverTimeInTaskDetails,
  setOverTimeDetails,
  editRowsInOverTimeDetails,
  setMsgNull
} = timesheetSlice.actions;

// Selector
export const getIsLoadingFromTS = (state) => state.timesheet.isLoading;
export const getTimesheetListFromTS = (state) => state.timesheet.data;
export const getEditTimesheetListFromTS = (state) => state.timesheet.editData;
export const getTimesheetIdFromTS = (state) => state.timesheet.timeSheetId;
export const getTimesheetStatusFromTS = (state) => state.timesheet.timeSheetStatus;
export const getDateFromTS = (state) => state.timesheet.selectedDate;
export const getMsgFromTS = (state) => state.timesheet.msg;
export const getCategoryLOVFromTS = (state) => state.timesheet.category;
export const getStatusLOVFromTS = (state) => state.timesheet.status;
export const getProjectLOVFromTS = (state) => state.timesheet.project;
export const getErrorFromTS = (state) => state.timesheet.error;
export const getTimesheetDetails = (state) => state.timesheet.timesheetDetails;
export const getOverTimeDetails = (state) => state.timesheet.overTime;
export const getOverTimeIdFromTS = (state) => state.timesheet.overTimeId;
export const getOverTimeStatusFromTS = (state) => state.timesheet.overTimeStatus;
export const getOverTimeManagerCommentsFromTS = (state) => state.timesheet.managercomments;
