import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  data: [],
  editData: [],
  error: ''
};

export const getListOfCountries = createAsyncThunk(
  'overTimeMaster/getListOfCountries',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Country/Service/getListOfCountries');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const createCountryAction = createAsyncThunk(
  'overTimeMaster/createCountryAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Country/Service/CreateCountry', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const updateCountryAction = createAsyncThunk(
  'resetpassword/updateCountryAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Country/Service/UpdateCountry', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const deleteCountryAction = createAsyncThunk(
  'resetpassword/deleteCountryAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.deleteData(`/techstep/api/Country/Service/delete/${payload}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const overTimeMasterSlice = createSlice({
  name: 'overTimeMaster',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    }
  },
  extraReducers: {
    [getListOfCountries.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfCountries.fulfilled]: (state, action) => {
      console.log('Data fetched Successfully!');
      return {
        ...state,
        data: action.payload,
        isLoading: false
      };
    },
    [getListOfCountries.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [createCountryAction.pending]: (state) => ({ ...state, isLoading: true }),
    [createCountryAction.fulfilled]: (state) => {
      console.log('Posted Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [createCountryAction.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default overTimeMasterSlice.reducer;
export const { startLoading, stopLoading } = overTimeMasterSlice.actions;

// Selector
export const getIsLoadingFromOTMaster = (state) => state.overTimeMaster.isLoading;
export const getCountryListFromOTMaster = (state) => state.overTimeMaster.data;
export const getErrorFromOTMaster = (state) => state.overTimeMaster.error;
