// import { map, filter } from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  groups: [],
  kkmasterDetails: [],
  error: ''
};

// Get all groups
export const getAllGroupsAsync = createAsyncThunk(
  'timesheetsettings/getAllGroups',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/KpiAndKraGroup/Service/getListOfKpiAndKraGroups');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Create new group
export const createGroupActionAsync = createAsyncThunk(
  'timesheetsettings/createGroupAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/KpiAndKraGroup/Service/Create', payload);

      dispatch(getAllGroupsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Update new group
export const updateGroupActionAsync = createAsyncThunk(
  'timesheetsettings/updateGroupAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/KpiAndKraGroup/Service/Update', payload);

      dispatch(getAllGroupsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Delete individual timesheetsettings
export const deleteGroupActionAsync = createAsyncThunk(
  'timesheetsettings/deleteGroupAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.deleteData(`/techstep/api/KpiAndKraGroup/Service/delete/${payload}`);
      dispatch(getAllGroupsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Multiple delete group
export const multipleGroupDeleteActionAsync = createAsyncThunk(
  'timesheetsettings/multipleGroupDeleteAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/KpiAndKraGroup/Service/Multipledelete', payload);
      dispatch(getAllGroupsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all KPI - KRA
export const getAllKpiKraActionAsync = createAsyncThunk(
  'timesheetsettings/getAllKpiKraAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/KpiAndKra/Service/getListOfKpiAndKra');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Create new Kpi -Kra
export const createKpiKraActionAsync = createAsyncThunk(
  'timesheetsettings/createKpiKraAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/KpiAndKra/Service/Create', payload);

      dispatch(getAllKpiKraActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Update new Kpi - Kra
export const updateKpiKraActionAsync = createAsyncThunk(
  'timesheetsettings/updateKpiKraAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/KpiAndKra/Service/Update', payload);

      dispatch(getAllKpiKraActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Delete individual KPI-KRA
export const deleteKpiKraActionAsync = createAsyncThunk(
  'timesheetsettings/deleteKpiKraAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.deleteData(`/techstep/api/KpiAndKra/Service/delete/${payload}`);
      dispatch(getAllKpiKraActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Multiple delete KPI-KRA
export const multipleKpiKraDeleteActionAsync = createAsyncThunk(
  'timesheetsettings/multipleKpiKraDeleteAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/KpiAndKra/Service/Multipledelete', payload);
      dispatch(getAllKpiKraActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const timesheetSettings = createSlice({
  name: 'timesheetsettings',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    editUser: (state, action) => {
      state.editUser = action.payload;
    }
  },
  extraReducers: {
    // createGroupActionAsync
    [createGroupActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createGroupActionAsync.fulfilled]: (state) => {
      console.log('Groups Created Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [createGroupActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // Groups
    [getAllGroupsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllGroupsAsync.fulfilled]: (state, action) => {
      console.log('Groups fetched successfully!');
      return {
        ...state,
        groups: action.payload,
        isLoading: false
      };
    },
    [getAllGroupsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // Delete group
    [deleteGroupActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [deleteGroupActionAsync.fulfilled]: (state) => {
      console.log('Groups deleted successfully!');
      return {
        ...state,

        isLoading: false
      };
    },
    [deleteGroupActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // Update group
    [updateGroupActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [updateGroupActionAsync.fulfilled]: (state) => {
      console.log('Groups updated successfully!');
      return {
        ...state,

        isLoading: false
      };
    },
    [updateGroupActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // Multiple delete
    [multipleGroupDeleteActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [multipleGroupDeleteActionAsync.fulfilled]: (state) => {
      console.log('Groups deleted successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [multipleGroupDeleteActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // getAllKpiKraActionAsync
    [getAllKpiKraActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllKpiKraActionAsync.fulfilled]: (state, action) => {
      console.log('KPI-KRA fetched Successfully!');
      return {
        ...state,
        kkmasterDetails: action.payload,
        isLoading: false
      };
    },
    [getAllKpiKraActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // createKpiKraActionAsync
    [createKpiKraActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createKpiKraActionAsync.fulfilled]: (state) => {
      console.log('KPI-KRA created successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [createKpiKraActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // updateKpiKraActionAsync
    [updateKpiKraActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [updateKpiKraActionAsync.fulfilled]: (state) => {
      console.log('KPI-KRA updated successfully!');
      return {
        ...state,

        isLoading: false
      };
    },
    [updateKpiKraActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // deleteKpiKraActionAsync
    [deleteKpiKraActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [deleteKpiKraActionAsync.fulfilled]: (state) => {
      console.log('KPI-KRA deleted successfully!');
      return {
        ...state,

        isLoading: false
      };
    },
    [deleteKpiKraActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // multipleKpiKraDeleteActionAsync
    [multipleKpiKraDeleteActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [multipleKpiKraDeleteActionAsync.fulfilled]: (state) => {
      console.log('Groups deleted successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [multipleKpiKraDeleteActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default timesheetSettings.reducer;
export const { startLoading, stopLoading } = timesheetSettings.actions;

// Selector
export const getIsLoadingFromGroup = (state) => state.timesheetsettings.isLoading;
export const getAllUsersFromGroups = (state) => state.timesheetsettings.groups;
export const getErrorFromGroup = (state) => state.timesheetsettings.error;
export const getkkmasterDetailsFromTimesheetSettings = (state) => state.timesheetsettings.kkmasterDetails;
