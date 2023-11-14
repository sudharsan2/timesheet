import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import fileSaver from '../../utils/fileSaver';

const initialState = {
  isLoading: false,
  calender: [],
  weekdays: [],
  managerList: [],
  msg: '',
  error: ''
};

export const getListOfCalendarAsync = createAsyncThunk(
  'project/getListOfCalendar',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/AllProject/Service/getAllCalendars');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getAllDaysAsync = createAsyncThunk('project/getAllDays', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/AllProject/Service/getAllDays');

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getAllProjectsAsync = createAsyncThunk('project/getAllProjects', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/AllProject/Service/getAllProjects');

    console.log(response.data);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const getListOfTravelDetailsByManagerAsync = createAsyncThunk(
  'project/getListOfTravelDetailsByManager',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Travel/Service/getListOfTravelDetailsByManager');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const createOrUpdatecalendarAsync = createAsyncThunk(
  'project/createOrUpdatecalendar',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/AllProject/Service/createUpdateCalendar', payload);

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const createUpdateProjectAsync = createAsyncThunk(
  'project/createUpdateProject',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/AllProject/Service/createUpdateProject', payload);

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Travel Request

export const createTravelDetailsAsync = createAsyncThunk(
  'project/createTravelDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Travel/Service/createTravelDetails', payload);

      //   dispatch(getManagerTaskAssignByAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const exceptionOnOffAsync = createAsyncThunk('project/exceptionOnOff', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.postData('/techstep/api/AllProject/Service/exceptionOnOff', payload);

    //   dispatch(getManagerTaskAssignByAsync());

    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const uploadBiometricAsync = createAsyncThunk(
  'project/uploadBiometric',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/AllProject/Service/uploadBiometric', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const uploadPaySquareLeaveAsync = createAsyncThunk(
  'project/uploadPaySquareLeave',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/AllProject/Service/uploadPaySquareLeave', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const uploadHolidaysAsync = createAsyncThunk('project/uploadHolidays', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.postData('/techstep/api/AllProject/Service/uploadHolidays', payload);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

export const postProjectDetailsAsync = createAsyncThunk(
  'project/postProjectDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData(
        'https://techstephub.focusrtech.com:6060/techstep/auth/service/postProjectDetails',
        payload
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const approveOrRejectTravelReqAsync = createAsyncThunk(
  'project/approveOrRejectTravelReq',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.putData(
        'https://secure.focusrtech.com:3030/techstep/api/Travel/Service/approveOrRejectTravelReq',
        payload
      );
      console.log(response.data);
      // dispatch(getPendingIssueAssetAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// export const uploadPaySquareLeaveAsync = createAsyncThunk(
//   'project/uploadPaySquareLeave',
//   async (payload, { rejectWithValue, file }) => {
//     const formData = new FormData();
//     formData.append('File', file);
//     try {
//       const response = await api.methods.postData('/techstep/api/AllProject/Service/uploadPaySquareLeave', formData, {
//         reportProgress: true,
//         responseType: 'blob' // **don't forget to add this**
//       });
//       const contentType = response.headers['content-type'];
//       const blob = new Blob([response.data], {
//         type: contentType
//       });
//       const filename = response.headers['content-disposition'].split('filename=')[1];
//       fileSaver(blob, filename);
//       return response;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

// export const downloadLOPReportAsync = createAsyncThunk(
//   'project/downloadLOPReport',
//   async (_payload, { rejectWithValue }) => {
//     try {
//       const response = await api.methods.getDataWithOptions(
//         `/techstep/api/AllProject/Service/downloadLOPReport/${_payload}`,
//         {
//           responseType: 'blob' // **don't forget to add this**
//         }
//       );
//       const contentType = response.headers['content-type'];
//       const blob = new Blob([response.data], {
//         type: contentType
//       });
//       const filename = response.headers['content-disposition'].split('filename=')[1];
//       fileSaver(blob, filename);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

export const downloadLOPReportAsync = createAsyncThunk(
  'project/downloadLOPReport',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getDataWithOptions(
        `/techstep/api/AllProject/Service/downloadLOPReport/${_payload}`,
        {
          responseType: 'blob' // **don't forget to add this**
        }
      );
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], {
        type: contentType
      });
      const filename = response.headers['content-disposition'].split('filename=')[1];
      console.log('filename', filename);
      fileSaver(blob, filename);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
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
      state.calender = [];
    },
    getListUser: (state) => {
      state.calender = [];
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
    [getListOfCalendarAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfCalendarAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        calender: action.payload,
        isLoading: false
      };
    },
    [getListOfCalendarAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfTravelDetailsByManagerAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfTravelDetailsByManagerAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        managerList: action.payload,
        isLoading: false
      };
    },
    [getListOfTravelDetailsByManagerAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getAllDaysAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getAllDaysAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        weekdays: action.payload,
        isLoading: false
      };
    },
    [getAllDaysAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [approveOrRejectTravelReqAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [approveOrRejectTravelReqAsync.fulfilled]: (state, action) => {
      console.log('Fetch', action.payload);
      return {
        ...state,
        isLoading: false
      };
    },
    [getAllProjectsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getAllProjectsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        calender: action.payload,
        isLoading: false
      };
    },
    [getAllProjectsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [uploadHolidaysAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [uploadHolidaysAsync.fulfilled]: (state, action) => {
      console.log('Uploaded Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [uploadHolidaysAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [postProjectDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [postProjectDetailsAsync.fulfilled]: (state, action) => {
      console.log('Uploaded Successfully!', action.payload);
      return {
        ...state,
        msg: 'Update Successfully',
        isLoading: false
      };
    },
    [postProjectDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [uploadBiometricAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [uploadBiometricAsync.fulfilled]: (state, action) => {
      console.log('Uploaded Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [uploadBiometricAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [createOrUpdatecalendarAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createOrUpdatecalendarAsync.fulfilled]: (state, action) => {
      console.log('Project Calendar Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createOrUpdatecalendarAsync.rejected]: (state, action) => {
      console.log('Calendar rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [exceptionOnOffAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [exceptionOnOffAsync.fulfilled]: (state, action) => {
      console.log('Exception  Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [exceptionOnOffAsync.rejected]: (state, action) => {
      console.log('Exception rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [createUpdateProjectAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createUpdateProjectAsync.fulfilled]: (state, action) => {
      console.log('Project Calendar Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createUpdateProjectAsync.rejected]: (state, action) => {
      console.log('Project rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [createTravelDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createTravelDetailsAsync.fulfilled]: (state, action) => {
      console.log('Travel Details Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createTravelDetailsAsync.rejected]: (state, action) => {
      console.log('Travel Details Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [uploadPaySquareLeaveAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [uploadPaySquareLeaveAsync.fulfilled]: (state, action) => {
      console.log('Uploaded Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [uploadPaySquareLeaveAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  },
  [downloadLOPReportAsync.pending]: (state) => ({ ...state, isLoading: true }),
  [downloadLOPReportAsync.fulfilled]: (state) => {
    console.log('Updated Successfully!');
    return {
      ...state,
      isLoading: false
    };
  },
  [downloadLOPReportAsync.rejected]: (state, action) => ({
    ...state,
    error: action.payload.message,
    isLoading: false
  })
});

export default projectSlice.reducer;
export const { startLoading, stopLoading, getUserList, getListUser, getDetailsAsset, setErrorNull, setMsgNull } =
  projectSlice.actions;

// Selector
export const getIsLoadingFromUser = (state) => state.project.isLoading;
export const getAllUsersFromUser = (state) => state.project.calender;
export const getAllUsersFromManager = (state) => state.project.managerList;
export const getListOfDaysLOV = (state) => state.project.weekdays;
export const getMsgFromUser = (state) => state.project.msg;
export const getErrorFromUser = (state) => state.project.error;
