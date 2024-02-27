import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  isLoading: false,
  leads: [],
  Classify: [],
  Leadmanagers: [],
  levels: [],
  priorities: [],
  companynames: [],
  internalDivisions: [],
  nextactions: [],
  statuss: [],
  classifications: [],
  currencies: [],
  activestatus: [],
  remarks: [],
  editData: [],
  msg: '',
  error: ''
};

export const getListOfLeadDetailsToCrmRepAsync = createAsyncThunk(
  'lead/getListOfLeadDetailsToCrmRep',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfLeadDetailsToCrmRep');

      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getActiveStatusAsync = createAsyncThunk(
  'lead/getActiveStatus',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getActiveStatus');

      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfLeadEntryDetailsAsync = createAsyncThunk(
  'lead/getListOfLeadEntryDetails',

  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfLeadEntryDetails');

      console.log(response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const createOrUpdateLeadAsync = createAsyncThunk(
  'lead/createOrUpdateLead',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/CrmLead/Service/createOrUpdateLead', payload);
      dispatch(getListOfLeadDetailsToCrmRepAsync());
      dispatch(getListOfLeadEntryDetailsAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);
export const UpdateLeadAsync = createAsyncThunk(
  'lead/createOrUpdateLead',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/CrmLead/Service/createOrUpdateLead', payload);
      dispatch(getListOfLeadDetailsToCrmRepAsync());

      dispatch(getListOfLeadEntryDetailsAsync());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfLevelAsync = createAsyncThunk('lead/getListOfLevel', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfLevel');
    console.log(response.data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});
export const getListOfPriorityAsync = createAsyncThunk(
  'lead/getListOfPriority',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfPriority');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);
export const getListOfStatusAsync = createAsyncThunk('lead/getListOfStatus', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfStatus');
    console.log(response.data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.data);
  }
});

// export const getListOfProjectNameAsync = createAsyncThunk(
//   'lead/getListOfProjectName',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfProjectName');
//       console.log(response.data);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.data);
//     }
//   }
// );

export const getListOfInternalDivisionAsync = createAsyncThunk(
  'lead/getListOfInternalDivision',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfInternalDivision');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfNextActionAsync = createAsyncThunk(
  'lead/getListOfNextAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfNextAction');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfClassificationAsync = createAsyncThunk(
  'lead/getListOfLeadClassification',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfLeadClassification');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);
export const getListofComapanyNamesAsync = createAsyncThunk(
  'lead/getListofComapanyNames',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListofComapanyNames');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getMasterDetailsByCompanynameAsync = createAsyncThunk(
  'lead/getMasterDetailsByCompanyname?company_name=Binamo',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        '/techstep/api/Master/Service/getMasterDetailsByCompanyname?company_name=Binamo'
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getListOfCurrencyAsync = createAsyncThunk(
  'lead/getListOfCurrency',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/CrmLead/Service/getListOfCurrency');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getRemarksHistoryAsync = createAsyncThunk(
  'lead/getRemarksHistoryById',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `/techstep/api/CrmLead/Service/getRemarksHistoryById?lead_id=${_payload}`
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const leadSlice = createSlice({
  name: 'lead',
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
      state.leads = [];
    },
    getListUser: (state) => {
      state.leads = [];
    },
    getDetailsAsset: (state) => {
      state.leads = [];
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
    [getListOfLeadDetailsToCrmRepAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfLeadDetailsToCrmRepAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        leads: action.payload,
        editData: action.payload,
        isLoading: false
      };
    },
    [getListOfLeadDetailsToCrmRepAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfLeadEntryDetailsAsync.pending]: (state) => ({ ...state, isLoading: false }),
    [getListOfLeadEntryDetailsAsync.fulfilled]: (state, action) => {
      console.log('Users fetched successfully!');
      return {
        ...state,
        leads: action.payload,
        editData: action.payload,
        isLoading: false
      };
    },
    [getListOfLeadEntryDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [createOrUpdateLeadAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createOrUpdateLeadAsync.fulfilled]: (state, action) => {
      console.log('Lead Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createOrUpdateLeadAsync.rejected]: (state, action) => {
      console.log('Lead rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },

    [getListOfLevelAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfLevelAsync.fulfilled]: (state, action) => {
      console.log('Lead Created Successfully!', action);
      return {
        ...state,
        levels: action.payload.message,
        isLoading: false
      };
    },
    [getListOfLevelAsync.rejected]: (state, action) => {
      console.log('Lead rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },
    [getListOfLevelAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfLevelAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        levels: action.payload,
        isLoading: false
      };
    },
    [getListOfLevelAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    [getListOfPriorityAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfPriorityAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        priorities: action.payload,
        isLoading: false
      };
    },
    [getListOfPriorityAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getActiveStatusAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getActiveStatusAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        activestatus: action.payload,
        isLoading: false
      };
    },
    [getActiveStatusAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfStatusAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfStatusAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        statuss: action.payload,
        isLoading: false
      };
    },
    [getListOfStatusAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // [getListOfProjectNameAsync.pending]: (state) => ({ ...state, isLoading: true }),
    // [getListOfProjectNameAsync.fulfilled]: (state, action) => {
    //   console.log('Fetched Successfully! - ', action.payload);
    //   return {
    //     ...state,
    //     projectnames: action.payload,
    //     isLoading: false
    //   };
    // },
    // [getListOfProjectNameAsync.rejected]: (state, action) => ({
    //   ...state,
    //   error: action.payload.message,
    //   isLoading: false
    // }),

    [getListOfInternalDivisionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfInternalDivisionAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        internalDivisions: action.payload,
        isLoading: false
      };
    },
    [getListOfInternalDivisionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfNextActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfNextActionAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        nextactions: action.payload,
        isLoading: false
      };
    },
    [getListOfNextActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfClassificationAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfClassificationAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        classifications: action.payload,
        isLoading: false
      };
    },
    [getListOfClassificationAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListofComapanyNamesAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListofComapanyNamesAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        companynames: action.payload,
        isLoading: false
      };
    },
    [getListofComapanyNamesAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getMasterDetailsByCompanynameAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getMasterDetailsByCompanynameAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        Classify: action.payload,
        isLoading: false
      };
    },
    [getMasterDetailsByCompanynameAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getListOfCurrencyAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfCurrencyAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        currencies: action.payload,
        isLoading: false
      };
    },
    [getListOfCurrencyAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getRemarksHistoryAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getRemarksHistoryAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully! - ', action.payload);
      return {
        ...state,
        remarks: action.payload,
        isLoading: false
      };
    },
    [getRemarksHistoryAsync.rejected]: (state, action) => ({
      ...state,
      isLoading: false
    }),

    [UpdateLeadAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [UpdateLeadAsync.fulfilled]: (state, action) => {
      console.log('Lead updated Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [UpdateLeadAsync.rejected]: (state, action) => {
      console.log('Lead rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    }
  }
});

export default leadSlice.reducer;
export const { startLoading, stopLoading, getUserList, getListUser, getDetailsAsset, setErrorNull, setMsgNull } =
  leadSlice.actions;

// Selector
export const getIsLoadingFromUser = (state) => state.lead.isLoading;
export const getIsLoadingFromAsset = (state) => state.lead.isLoading;
export const getAssetFromTS = (state) => state.lead.assetId;
export const getAsset1FromTS = (state) => state.lead.applyId;
export const getEditAssetListFromTS = (state) => state.lead.editData;
export const getApplyIssueFromTs = (state) => state.lead.applyData;
export const getDateFromTS = (state) => state.timesheet.selectedDate;
export const getAllUsersFromUser = (state) => state.lead.leads;
export const getErrorFromUser = (state) => state.lead.error;
export const getMsgFromUser = (state) => state.lead.msg;
export const getRolesListFromUser = (state) => state.lead.leads;
export const getAllUsersFromUsers = (state) => state.master.Leadmanagers;
export const getListOfLevel = (state) => state.lead.levels;
export const getListOfPriority = (state) => state.priority.priorities;

export const getListOfStatus = (state) => state.status.statuss;
export const getListofComapanyNames = (state) => state.lead.companynames;
export const getListOfInternalDivision = (state) => state.internal_division.internalDivisions;
export const getListOfNextAction = (state) => state.next_action.nextactions;
export const getListOfClassification = (state) => state.classification.classifications;
export const getMasterDetailsByCompanyname = (state) => state.lead.Classify;
export const getListOfCurrency = (state) => state.lead.currencies;
export const getRemarksHistoryById = (state) => state.lead.remarks;
export const getActiveStatus = (state) => state.is_ACTIVE.activestatus;
