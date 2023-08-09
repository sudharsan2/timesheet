import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  masters: [],
  mastersmanagers: [],
  classifications: [],
  editData: [],
  msg: '',
  error: ''
};

export const getListOfMasterDetailsToCrmRepAsync = createAsyncThunk(
  'master/getListOfMasterDetailsToCrmRep',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Master/Service/getListOfMasterDetailsToCrmRep');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);
export const getListOfMasterScreenDetailsAsync = createAsyncThunk(
  'master/getListOfMasterScreenDetails',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Master/Service/getListOfMasterScreenDetails');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfMasterClassificationAsync = createAsyncThunk(
  'master/getListOfMasterClassification',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Master/Service/getListOfMasterClassification');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const createOrUpdateMasterAsync = createAsyncThunk(
  'master/createOrUpdateMaster',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Master/Service/createOrUpdateMaster', payload);
      dispatch(getListOfMasterDetailsToCrmRepAsync());
      dispatch(getListOfMasterScreenDetailsAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const UpdateMasterAsync = createAsyncThunk(
  'master/createOrUpdateMaster',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Master/Service/createOrUpdateMaster', payload);

      dispatch(getListOfMasterDetailsToCrmRepAsync());
      dispatch(getListOfMasterScreenDetailsAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const masterSlice = createSlice({
  name: 'master',
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
      state.masters = [];
    },
    getListUser: (state) => {
      state.masters = [];
    },
    getDetailsAsset: (state) => {
      state.masters = [];
    },
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
    [getListOfMasterDetailsToCrmRepAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfMasterDetailsToCrmRepAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        masters: action.payload,
        editData: action.payload,
        isLoading: false
      };
    },
    [getListOfMasterDetailsToCrmRepAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfMasterScreenDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfMasterScreenDetailsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        masters: action.payload,
        editData: action.payload,
        isLoading: false
      };
    },
    [getListOfMasterScreenDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [createOrUpdateMasterAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createOrUpdateMasterAsync.fulfilled]: (state, action) => {
      console.log('Master Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createOrUpdateMasterAsync.rejected]: (state, action) => {
      console.log('Master rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },

    [getListOfMasterClassificationAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfMasterClassificationAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        classifications: action.payload,
        isLoading: false
      };
    },
    [getListOfMasterClassificationAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  },

  [UpdateMasterAsync.pending]: (state) => ({ ...state, isLoading: true }),
  [UpdateMasterAsync.fulfilled]: (state, action) => {
    console.log('Lead updated Successfully!', action);
    return {
      ...state,
      msg: action.payload.message,
      isLoading: false
    };
  },
  [UpdateMasterAsync.rejected]: (state, action) => {
    console.log('Lead rejected Successfully!', action);
    return {
      ...state,
      error: action.payload.message,
      isLoading: false
    };
  }
});

export default masterSlice.reducer;
export const { startLoading, stopLoading, getUserList, getListUser, getDetailsAsset, setErrorNull, setMsgNull } =
  masterSlice.actions;

// Selector
export const getIsLoadingFromUser = (state) => state.master.isLoading;
export const getIsLoadingFromAsset = (state) => state.master.isLoading;
export const getAssetFromTS = (state) => state.master.assetId;
export const getAsset1FromTS = (state) => state.master.applyId;
export const getEditAssetListFromTS = (state) => state.master.editData;
export const getApplyIssueFromTs = (state) => state.master.applyData;
export const getDateFromTS = (state) => state.timesheet.selectedDate;
export const getAllUsersFromUser = (state) => state.master.masters;
export const getAllUsersFromUsers = (state) => state.master.mastersmanagers;
export const getErrorFromUser = (state) => state.master.error;
export const getMsgFromUser = (state) => state.master.msg;
export const getRolesListFromUser = (state) => state.master.masters;
export const getListOfMasterClassification = (state) => state.classification.classifications;
