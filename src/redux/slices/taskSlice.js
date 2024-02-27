import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  tasks: [],
  types: [],
  client: [],
  names: [],
  priority: [],
  status: [],
  remarks: [],
  acknowledge: [],
  msg: '',
  error: ''
};

export const getManagerTaskAssignByAsync = createAsyncThunk(
  'task/getManagerTaskAssignBy',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getManagerTaskAssignBy');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getManagerTaskAssignToAsync = createAsyncThunk(
  'task/getManagerTaskAssignTo',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getManagerTaskAssignTo');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfManagerTypeAsync = createAsyncThunk(
  'task/getListOfManagerType',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getListOfManagerType');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);
// export const createOrUpdateManagerAsync = createAsyncThunk(
//   'task/createOrUpdateManager',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await api.methods.postData('techstep/api/Manager/Service/createOrUpdateManager', payload);

//       // dispatch(getListOfallManagersTasksAsync());
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

export const createOrUpdateManagerAsync = createAsyncThunk(
  'task/createOrUpdateManager',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Manager/Service/createOrUpdateManager', payload);

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const ManagersStatusChangeAsync = createAsyncThunk(
  'task/ManagersUpdate',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Manager/Service/ManagersUpdate', payload);

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const AssignedStatusChangeAsync = createAsyncThunk(
  'task/ManagersStatusChange',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Manager/Service/ManagersStatusChange', payload);

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListofManagerNamesAsync = createAsyncThunk(
  'task/getListofManagerNames',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getListofManagerNames');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListofRemarksAsync = createAsyncThunk(
  'task/getRemarksHistoryId',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `/techstep/api/Manager/Service/getRemarksHistoryId?manager_id_copy=${_payload}`
      );

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const postAckAsync = createAsyncThunk(
  'task/postAck',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(`/techstep/api/cr/service/postAck/${_payload}`);

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfProjectsAsync = createAsyncThunk(
  'task/getListOfProjects',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Timesheet/Service/getListOfProjects');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfpriorityAsync = createAsyncThunk(
  'task/getListOfpriority',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getListOfpriority');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfStatusAsync = createAsyncThunk(
  'task/getListOfStatus',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getListOfStatus');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
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
      state.tasks = [];
    },
    getListUser: (state) => {
      state.tasks = [];
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
    [getManagerTaskAssignByAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getManagerTaskAssignByAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        tasks: action.payload,
        isLoading: false
      };
    },
    [getManagerTaskAssignByAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getManagerTaskAssignToAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getManagerTaskAssignToAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        tasks: action.payload,
        isLoading: false
      };
    },
    [getManagerTaskAssignToAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfManagerTypeAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfManagerTypeAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        types: action.payload,
        isLoading: false
      };
    },
    [getListOfManagerTypeAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListofManagerNamesAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListofManagerNamesAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        names: action.payload,
        isLoading: false
      };
    },
    [getListofManagerNamesAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfpriorityAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfpriorityAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        priority: action.payload,
        isLoading: false
      };
    },
    [getListOfpriorityAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfProjectsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfProjectsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        client: action.payload,
        isLoading: false
      };
    },
    [getListOfProjectsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfStatusAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfStatusAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        status: action.payload,
        isLoading: false
      };
    },
    [getListOfStatusAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListofRemarksAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListofRemarksAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        remarks: action.payload,
        isLoading: false
      };
    },
    [getListofRemarksAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [postAckAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [postAckAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        acknowledge: action.payload,
        isLoading: false
      };
    },
    [postAckAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [ManagersStatusChangeAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [ManagersStatusChangeAsync.fulfilled]: (state, action) => {
      console.log('Task Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [ManagersStatusChangeAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [AssignedStatusChangeAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [AssignedStatusChangeAsync.fulfilled]: (state, action) => {
      console.log('Task Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [AssignedStatusChangeAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [createOrUpdateManagerAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createOrUpdateManagerAsync.fulfilled]: (state, action) => {
      console.log('Task Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createOrUpdateManagerAsync.rejected]: (state, action) => {
      console.log('Task rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    }
  }
});

export default taskSlice.reducer;
export const { startLoading, stopLoading, getUserList, getListUser, getDetailsAsset, setErrorNull, setMsgNull } =
  taskSlice.actions;

// Selector
export const getIsLoadingFromUser = (state) => state.task.isLoading;

export const getAllUsersFromUser = (state) => state.task.tasks;
export const getErrorFromUser = (state) => state.task.error;
export const getMsgFromUser = (state) => state.task.msg;
export const getListofManagerNames = (state) => state.task.names;
export const getListOfManagerType = (state) => state.task.types;
export const getListOfpriority = (state) => state.task.priority;
export const getListOfStatus = (state) => state.task.status;
export const getListOfProjects = (state) => state.task.client;
export const getRemarksHistoryId = (state) => state.task.remarks;
export const getAcknowledgeList = (state) => state.task.acknowledge;
