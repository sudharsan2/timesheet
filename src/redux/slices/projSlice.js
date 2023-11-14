import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  projects: [],
  workedProj: [],
  wfhReq: [],
  travel: [],
  manager: [],
  statusreq: [],
  holidays: [],
  openTickets: [],
  msg: '',
  error: ''
};

export const getAllProjectsAsync = createAsyncThunk('proj/getAllProjects', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/AllProject/Service/getAllProjects');

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getOpenticketsAsync = createAsyncThunk('proj/getOpentickets', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData(`/techstep/api/Project/Service/getOpentickets/${_payload}`);

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

// travel

export const getListOfTravelDetailsByOwnerAsync = createAsyncThunk(
  'proj/getListOfTravelDetailsByOwner',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Travel/Service/getListOfTravelDetailsByOwner');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Worked Projects

export const getAllProjectsOfAnEmpAsync = createAsyncThunk(
  'proj/getAllProjectsOfAnEmp',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `https://techstephub.focusrtech.com:6060/techstep/auth/service/getAllProjectsOfAnEmp?id=${_payload}`
      );

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getDetailsofwfhAsync = createAsyncThunk('proj/getDetailsofwfh', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData(`/techstep/api/Timesheet/Service/wfh`);

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getListOfAllTravelDetailsAsync = createAsyncThunk(
  'proj/getListOfAllTravelDetails',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Travel/Service/getListOfAllTravelDetails');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const changeStatusAdminAsync = createAsyncThunk('proj/changeStatusAdmin', async ({ rejectWithValue }) => {
  try {
    const response = await api.methods.putData('/techstep/api/Travel/Service/changeStatusAdmin');

    //   dispatch(getManagerTaskAssignByAsync());

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getListOfTravelDetailsByManagerAsync = createAsyncThunk(
  'proj/getListOfTravelDetailsByManager',
  async ({ rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        'https://secure.focusrtech.com:3030/techstep/api/Travel/Service/getListOfTravelDetailsByManager'
      );

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getAllholidaysAsync = createAsyncThunk('proj/getAllholidays', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/AllProject/Service/getAllholidays');

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

const projSlice = createSlice({
  name: 'proj',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setErrorNull: (state, action) => {
      state.error = action.payload;
    },
    getUserList: (state) => {
      state.projects = [];
    },
    // getDetailsAsset: (state) => {
    //   state.tasks = [];
    // },
    editUser: (state, action) => {
      state.editUser = action.payload;
    },
    setMsgNull: (state, action) => {
      state.msg = action.payload;
    },
    setDateValue: (state, action) => {
      state.selectedDate = action.payload;
    }
  },

  extraReducers: {
    [getAllProjectsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getAllProjectsAsync.fulfilled]: (state, action) => {
      console.log('Projects fetched successfully!');
      return {
        ...state,
        projects: action.payload,
        isLoading: false
      };
    },
    [getAllProjectsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getOpenticketsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getOpenticketsAsync.fulfilled]: (state, action) => {
      console.log('Projects fetched successfully!');
      return {
        ...state,
        openTickets: action.payload,
        isLoading: false
      };
    },
    [getOpenticketsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getAllProjectsOfAnEmpAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getAllProjectsOfAnEmpAsync.fulfilled]: (state, action) => {
      console.log('Projects fetched successfully!');
      return {
        ...state,
        workedProj: action.payload,
        isLoading: false
      };
    },
    [getAllProjectsOfAnEmpAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getDetailsofwfhAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getDetailsofwfhAsync.fulfilled]: (state, action) => {
      console.log('Projects fetched successfully!');
      return {
        ...state,
        wfhReq: action.payload,
        isLoading: false
      };
    },
    [getDetailsofwfhAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfTravelDetailsByOwnerAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfTravelDetailsByOwnerAsync.fulfilled]: (state, action) => {
      console.log('Travels fetched successfully!');
      return {
        ...state,
        travel: action.payload,
        isLoading: false
      };
    },
    [getListOfTravelDetailsByOwnerAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfTravelDetailsByManagerAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfTravelDetailsByManagerAsync.fulfilled]: (state, action) => {
      console.log('Travels fetched successfully!');
      return {
        ...state,
        manager: action.payload,
        isLoading: false
      };
    },
    [getListOfTravelDetailsByManagerAsync.rejected]: (state, action) => ({
      ...state,
      // error: action.payload.message,
      isLoading: false
    }),
    [changeStatusAdminAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [changeStatusAdminAsync.fulfilled]: (state, action) => {
      console.log('Travel Details Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [changeStatusAdminAsync.rejected]: (state, action) => {
      console.log('Travel Details Successfully!', action);
      return {
        ...state,
        // error: action.payload.message,
        isLoading: false
      };
    },
    [getListOfAllTravelDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfAllTravelDetailsAsync.fulfilled]: (state, action) => {
      console.log('Travels fetched successfully!');
      return {
        ...state,
        statusreq: action.payload,
        isLoading: false
      };
    },
    [getListOfAllTravelDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getAllholidaysAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getAllholidaysAsync.fulfilled]: (state, action) => {
      console.log('Projects fetched successfully!');
      return {
        ...state,
        holidays: action.payload,
        isLoading: false
      };
    },
    [getAllholidaysAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default projSlice.reducer;
export const { startLoading, stopLoading, getUserList, getDetailsAsset, setErrorNull, setMsgNull } = projSlice.actions;

export const getIsLoadingFromUser = (state) => state.proj.isLoading;
export const getAllUsersFromUser = (state) => state.proj.projects;
export const getAllopenProjects = (state) => state.proj.openTickets;
export const getAllWorkedProjects = (state) => state.proj.workedProj;
export const getAllWfhReq = (state) => state.proj.wfhReq;
export const getAllTravelRequest = (state) => state.proj.travel;
export const getAllTravelManager = (state) => state.proj.manager;
export const getAllAdminList = (state) => state.proj.statusreq;
export const getallholiday = (state) => state.proj.holidays;
export const getMsgFromUser = (state) => state.proj.msg;
export const getErrorFromUser = (state) => state.proj.error;
