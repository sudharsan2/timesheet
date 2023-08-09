import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  holidays: [],
  msg: '',
  error: ''
};

export const getAllholidaysAsync = createAsyncThunk('holiday/getAllholidays', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData(`/techstep/api/AllProject/Service/getAllholidays/${_payload}`);

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

const projSlice = createSlice({
  name: 'holiday',
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
      state.holidays = [];
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

export const getIsLoadingFromUser = (state) => state.holiday.isLoading;
export const getallholiday = (state) => state.holiday.holidays;
export const getMsgFromUser = (state) => state.holiday.msg;
export const getErrorFromUser = (state) => state.holiday.error;
