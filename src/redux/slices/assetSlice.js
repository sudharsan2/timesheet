import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  users: [],
  assets: [],
  editData: [],
  applyData: [],
  employees: [],
  selectedDate: {},
  assetId: '',
  applyId: '',
  msg: '',
  error: ''
};

export const getListOfLaptopDetailsAsync = createAsyncThunk(
  'asset/getListOfLaptopDetails',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getListOfLaptopDetails');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfAssetsAsync = createAsyncThunk('asset/getListOfAssets', async (_payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/Assets/Service/getListOfAssets');
    console.log(response.data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

// export const getListofAssetHistoryByIdAsync = createAsyncThunk('asset/getListofAssetHistoryById', async (_payload, { rejectWithValue }) => {
//   try {
//     const response = await api.methods.getData('/techstep/api/Assets/Service/getListofAssetHistoryById');
//     console.log(response.data);
//     return response.data;
//   } catch (err) {
//     return rejectWithValue(err.data);
//   }
// });

// export const getListOfAssetDetailsAsync = createAsyncThunk(
//   'asset/getListOfAssetDetails',
//   async (_payload, { rejectWithValue }) => {
//     try {
//       const response = await api.methods.getData('/techstep/api/Assets/Service/getListOfAssetDetails');
//       console.log(response.data);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

export const createOrUpdateAssetsAsync = createAsyncThunk(
  'asset/createOrUpdateAssets',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Assets/Service/createOrUpdateAssets', payload);

      dispatch(getListOfAssetsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const CreateAssetUserAsync = createAsyncThunk(
  'asset/CreateAssetUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Assets/Service/CreateAssetUser', payload);

      dispatch(getListOfAssetsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// export const CreateAssetUserAsync = createAsyncThunk(
//   'asset/CreateAssetUser',
//   async (payload, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.methods.postData('/techstep/api/Assets/Service/CreateAssetUser', payload);

//       dispatch(getListOfAssetsAsync());
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

export const updateAssetsAsync = createAsyncThunk(
  'asset/updateAssets',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.putData('/techstep/api/Assets/Service/createOrUpdateAssets', payload);

      dispatch(getListOfAssetsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getAssetDetailsByIdAsync = createAsyncThunk(
  'asset/getAssetDetailsById',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `/techstep/api/Assets/Service/getAssetDetailsById/${_payload.asset_id}`
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getUserAssetDetailsAsync = createAsyncThunk(
  'asset/getUserAssetDetails',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getUserAssetDetails');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// export const applyIssueAssetAsync = createAsyncThunk(
//   'asset/applyIssueAsset',
//   async (payload, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.methods.postData('/techstep/api/Assets/Service/applyIssueAsset', payload);

//       dispatch(getListOfAssetsAsync());
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

export const applyIssueAssetAsync = createAsyncThunk(
  'asset/applyIssueAsset',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Assets/Service/applyIssueAsset', payload);

      dispatch(getListOfAssetsAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getUserRaiseIssueDetailsAsync = createAsyncThunk(
  'asset/getUserRaiseIssueDetails',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getUserRaiseIssueDetails');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getPendingIssueAssetAsync = createAsyncThunk(
  'asset/getPendingIssueAsset',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getPendingIssueAsset');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListofAssetHistoryByIdAsync = createAsyncThunk(
  'asset/getListofAssetHistoryById',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getListofAssetHistoryById');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// export const approveOrRejectIssueAssetAsync = createAsyncThunk(
//   'user/approveOrRejectIssueAsset',
//   async (payload, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.methods.putData('/techstep/api/Assets/Service/approveOrRejectIssueAsset', payload);
//       dispatch(getListOfIssueAssetDetailsAsync());
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );
export const approveOrRejectIssueAssetAsync = createAsyncThunk(
  'asset/approveOrRejectIssueAsset',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.putData(
        'http://techstephub.focusrtech.com:5050/techstep/api/Assets/Service/approveOrRejectIssueAsset',
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

export const getListOfUnassignedAssetListAsync = createAsyncThunk(
  'asset/getListOfUnassignedAssetList',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getListOfUnassignedAssetList');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListofNamesAsync = createAsyncThunk(
  'timesheet/getListofNames',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getListofNamesWithUserId');
      // const response = await api.methods.getData('/techstep/api/Project/Service/getAllProjects');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfIssueAsync = createAsyncThunk(
  'timesheet/getListOfIssue',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Assets/Service/getListOfIssue');
      // const response = await api.methods.getData('/techstep/api/Project/Service/getAllProjects');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const assetSlice = createSlice({
  name: 'asset',
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
      state.users = [];
    },
    getListUser: (state) => {
      state.users = [];
    },
    getDetailsAsset: (state) => {
      state.users = [];
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
    [getListOfLaptopDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfLaptopDetailsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getListOfLaptopDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfAssetsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfAssetsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!', action.payload);
      return {
        ...state,
        users: action.payload,
        assetId: action.payload,
        editData: action.payload,
        isLoading: false
      };
    },
    [getListOfAssetsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // [getListOfAssetDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    // [getListOfAssetDetailsAsync.fulfilled]: (state, action) => {
    //   console.log('Users fetched successfully!', action.payload);
    //   return {
    //     ...state,
    //     users: action.payload,
    //     assetId: action.payload,
    //     editData: action.payload,
    //     isLoading: false
    //   };
    // },
    // [getListOfAssetDetailsAsync.rejected]: (state, action) => ({
    //   ...state,
    //   error: action.payload.message,
    //   isLoading: false
    // }),

    [approveOrRejectIssueAssetAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [approveOrRejectIssueAssetAsync.fulfilled]: (state, action) => {
      console.log('Fetch', action.payload);
      return {
        ...state,
        isLoading: false
      };
    },
    [getAssetDetailsByIdAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getAssetDetailsByIdAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!', action.payload);
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getAssetDetailsByIdAsync.rejected]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [createOrUpdateAssetsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createOrUpdateAssetsAsync.fulfilled]: (state, action) => {
      console.log('Asset Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createOrUpdateAssetsAsync.rejected]: (state, action) => {
      console.log('Asset rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [CreateAssetUserAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [CreateAssetUserAsync.fulfilled]: (state, action) => {
      console.log('Asset Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [CreateAssetUserAsync.rejected]: (state, action) => {
      console.log('Asset rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [updateAssetsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [updateAssetsAsync.fulfilled]: (state, action) => {
      console.log('Asset Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [updateAssetsAsync.rejected]: (state, action) => {
      console.log('Asset rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    // [applyIssueAssetAsync.pending]: (state) => ({ ...state, isLoading: true }),
    // [applyIssueAssetAsync.fulfilled]: (state, action) => {
    //   console.log('Asset Created Successfully!', action);
    //   return {
    //     ...state,
    //     msg: action.payload.message,
    //     isLoading: false
    //   };
    // },
    // [applyIssueAssetAsync.rejected]: (state, action) => {
    //   console.log('Asset rejected Successfully!', action);
    //   return {
    //     ...state,
    //     error: action.payload.message,
    //     isLoading: false
    //   };
    // },
    [applyIssueAssetAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [applyIssueAssetAsync.fulfilled]: (state, action) => {
      console.log('Issue Updated Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [applyIssueAssetAsync.rejected]: (state, action) => {
      console.log('Asset rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [getUserRaiseIssueDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getUserRaiseIssueDetailsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getUserRaiseIssueDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getPendingIssueAssetAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getPendingIssueAssetAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getPendingIssueAssetAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListofAssetHistoryByIdAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListofAssetHistoryByIdAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getListofAssetHistoryByIdAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListofNamesAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListofNamesAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        employees: action.payload,
        isLoading: false
      };
    },
    [getListofNamesAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfIssueAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfIssueAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        assets: action.payload,
        isLoading: false
      };
    },
    [getListOfIssueAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfUnassignedAssetListAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfUnassignedAssetListAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getListOfUnassignedAssetListAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getUserAssetDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getUserAssetDetailsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!', action.payload);
      return {
        ...state,
        users: action.payload,
        // assetId: action.payload,
        // editData: action.payload,
        isLoading: false
      };
    },
    [getUserAssetDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default assetSlice.reducer;
export const { startLoading, stopLoading, getUserList, getListUser, getDetailsAsset, setErrorNull, setMsgNull } =
  assetSlice.actions;

// Selector
export const getIsLoadingFromUser = (state) => state.asset.isLoading;
export const getIsLoadingFromAsset = (state) => state.asset.isLoading;
export const getAssetFromTS = (state) => state.asset.assetId;
export const getAsset1FromTS = (state) => state.asset.applyId;
export const getEditAssetListFromTS = (state) => state.asset.editData;
export const getApplyIssueFromTs = (state) => state.asset.applyData;
export const getDateFromTS = (state) => state.timesheet.selectedDate;
export const getAllUsersFromUser = (state) => state.asset.users;
export const getErrorFromUser = (state) => state.asset.error;
export const getMsgFromUser = (state) => state.asset.msg;
export const getRolesListFromUser = (state) => state.asset.users;
export const getListofNames = (state) => state.user.employees;
export const getListOfIssue = (state) => state.user.assets;
