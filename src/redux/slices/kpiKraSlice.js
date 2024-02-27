import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  kpiKraSelfRating: {},
  kpiAndKraList: [],
  kpiKraManagerRating: {},
  kpiAndKraManagerList: [],
  error: ''
};

// Get KPI-KRA For the Month
export const getKpiKraForTheMonthAsync = createAsyncThunk(
  'kpi/getKpiKraForTheMonth',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `/techstep/api/UsersKpiAndKra/Service/getUsersKpiKraForaMonth/${payload}`
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all KPI-KRA For the Particular Manager
export const getAllKpiKraForTheManagerActionAsync = createAsyncThunk(
  'kpi/getAllKpiKraForTheManagerAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `/techstep/api/UsersKpiAndKra/Service/getUsersKpiKraForaMonthForManager`
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Create new kpi self rating
export const createKpiKraSelfRatingActionAsync = createAsyncThunk(
  'kpi/createKpiKraSelfRating',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/UsersKpiAndKra/Service/Create', payload);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Update kpi self rating
export const updateKpiKraSelfRatingActionAsync = createAsyncThunk(
  'kpi/updateKpiKraSelfRating',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/UsersKpiAndKra/Service/Update', payload);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// submit KPI-KRA
export const submitKpiKraSelfRatingActionAsync = createAsyncThunk(
  'kpi/submitKpiKraSelfRating',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const actualState = getState();
      const { sub } = jwtDecode(actualState.auth.userDetails.accessToken);
      const _x = {
        ...actualState.kpi.kpiKraSelfRating,
        kpiList: actualState.kpi.kpiAndKraList,
        status: payload.state,
        userId: +sub
      };
      const response = await api.methods.postData(
        `/techstep/api/UsersKpiAndKra/Service/Update/${payload.formatteDate}`,
        _x
      );

      dispatch(getKpiKraForTheMonthAsync(payload.formatteDate));

      return response.data;
    } catch (err) {
      console.log('🚀 => err', err);
      return rejectWithValue(err.data);
    }
  }
);

// submit KPI-KRA Manager rating
export const submitKpiKraManagerRatingActionAsync = createAsyncThunk(
  'kpi/submitKpiKraManagerRating',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const actualState = getState();

      const _x = {
        ...actualState.kpi.kpiKraManagerRating,
        status: payload
      };
      const response = await api.methods.postData(`/techstep/api/UsersKpiAndKra/Service/ApproveKpi`, _x);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const kpi = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setSelfrating: (state, action) => {
      const row = [...state.kpiAndKraList];
      const elementsIndex = state.kpiAndKraList.findIndex(
        (element) => element.ratingId === action.payload.row.ratingId
      );
      row[elementsIndex] = { ...row[elementsIndex], selfrating: action.payload.value };
      state.kpiAndKraList = row;
    },
    setManagerRating: (state, action) => {
      const kpiForapproval = { ...state.kpiKraManagerRating };
      const row = [...kpiForapproval.kpiList];
      const elementsIndex = kpiForapproval.kpiList.findIndex(
        (element) => element.ratingId === action.payload.row.ratingId
      );
      row[elementsIndex] = { ...row[elementsIndex], managerRating: action.payload.value };
      kpiForapproval.kpiList = row;
      state.kpiKraManagerRating = kpiForapproval;
    },
    setKpiKraList: (state, action) => {
      state.kpiKraManagerRating = action.payload;
    }
  },
  extraReducers: {
    // createKpiKraSelfRatingActionAsync
    [createKpiKraSelfRatingActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createKpiKraSelfRatingActionAsync.fulfilled]: (state) => {
      console.log('Kpi Created Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [createKpiKraSelfRatingActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // submitKpiKraSelfRatingActionAsync
    [submitKpiKraSelfRatingActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [submitKpiKraSelfRatingActionAsync.fulfilled]: (state) => {
      console.log('Kpi Submitted Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [submitKpiKraSelfRatingActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // getAllKpiKraForTheManagerActionAsync
    [getAllKpiKraForTheManagerActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllKpiKraForTheManagerActionAsync.fulfilled]: (state, action) => {
      console.log('KPI-KRA Fetched Successfully!');
      return {
        ...state,
        kpiAndKraManagerList: action.payload,
        isLoading: false
      };
    },
    [getAllKpiKraForTheManagerActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // KpiKra
    [getKpiKraForTheMonthAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getKpiKraForTheMonthAsync.fulfilled]: (state, action) => {
      console.log('KpiKra fetched successfully!');

      if (action.payload.status === 'SAVED') {
        return {
          ...state,
          kpiKraSelfRating: action.payload,
          kpiAndKraList: action.payload.kpiList,
          isLoading: false
        };
      }
      return {
        ...state,
        kpiKraSelfRating: action.payload,
        kpiAndKraList: action.payload.kpiList,
        isLoading: false
      };
    },
    [getKpiKraForTheMonthAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default kpi.reducer;
export const { startLoading, stopLoading, setSelfrating, setKpiKraList, setManagerRating } = kpi.actions;

// Selector
export const getIsLoadingFromKpi = (state) => state.kpi.isLoading;
export const getKpiKraSelfRating = (state) => state.kpi.kpiKraSelfRating;
export const getErrorFromKpi = (state) => state.kpi.error;
export const getKpiKraSelfRatingList = (state) => state.kpi.kpiAndKraList;
export const getkpiKraManagerRating = (state) => state.kpi.kpiKraManagerRating;
export const getkpiAndKraManagerList = (state) => state.kpi.kpiAndKraManagerList;
