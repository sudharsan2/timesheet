// import { map, filter } from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import fileSaver from '../../utils/fileSaver';

const initialState = {
  isLoading: false,
  users: [],
  roles: [],
  managers: [],
  designations: [],
  projects: [],
  onsites: [],
  projectLov: [],
  msg: '',
  error: ''
};

// Get all roles
export const getAllRolesActionAsync = createAsyncThunk(
  'user/getAllRolesAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Users/Service/getListOfRoles');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all Managers
export const getAllManagersActionAsync = createAsyncThunk(
  'user/getAllManagersAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Manager/Service/getManagerList');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all users action
export const getAllUsersActionAsync = createAsyncThunk(
  'user/getAllUsersAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Users/Service/getListOfUsers');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Get all designation
export const getListOfDesignationActionAsync = createAsyncThunk(
  'user/getListOfDesignationAction',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/Users/Service/getListOfDesignation');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getAllProjectsForLOVAsync = createAsyncThunk(
  'user/getAllProjectsForLOV',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData('/techstep/api/AllProject/Service/getAllProjectsForLOV');

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const getPostProjectAsync = createAsyncThunk(
  'user/getActiveProjectOfAnEmp',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.getData(
        `https://techstephub.focusrtech.com:3030/techstep/auth/service/getActiveProjectOfAnEmp?id=${_payload}`
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Create user
export const createUserActionAsync = createAsyncThunk(
  'user/createUserAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/auth/signup', payload);

      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// update UserAction
export const updateUserActionAsync = createAsyncThunk(
  'user/updateUserAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/auth/updateUser', payload);

      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// onsite project

export const postProjectDetailsAsync = createAsyncThunk(
  'user/postProjectDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/auth/service/postProjectDetails', payload);

      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// User Active or Inactive
export const userActiveInactiveActionAsync = createAsyncThunk(
  'user/userActiveInactiveAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Users/Service/activeOrInactive', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Delete individual user
export const deleteUserActionAsync = createAsyncThunk(
  'user/deleteUserAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.deleteData(`/techstep/api/Users/Service/${payload}`);
      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Multiple delete user
export const multipleUserDeleteActionAsync = createAsyncThunk(
  'user/multipleUserDeleteAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Users/Service/deleteMultipleUser', payload);
      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Multiple active user
export const multipleUserActiveActionAsync = createAsyncThunk(
  'user/multipleUserActiveAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Users/Service/Multiple/SetAsActive', payload);
      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Multiple inactive user
export const multipleUserInActiveActionAsync = createAsyncThunk(
  'user/multipleUserInActiveAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/Users/Service/Multiple/SetAsInactive', payload);
      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// Download the excel template for bulk upload
export const downloadUserTemplateActionAsync = createAsyncThunk(
  'user/downloadUserTemplateAction',
  async (_payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.getDataWithOptions('/techstep/api/auth/download/samplefile', {
        responseType: 'blob' // **don't forget to add this**
      });
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], {
        type: contentType
      });
      const filename = response.headers['content-disposition'].split('filename=')[1];
      fileSaver(blob, filename);
      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

// uploadUsersAction
export const uploadUsersActionAsync = createAsyncThunk(
  'user/uploadUsersAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.methods.postData('/techstep/api/auth/fileUpload', payload);
      dispatch(getAllUsersActionAsync());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
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
    editUser: (state, action) => {
      state.editUser = action.payload;
    },
    setMsgNull: (state, action) => {
      state.msg = action.payload;
    }
  },
  extraReducers: {
    [getAllUsersActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllUsersActionAsync.fulfilled]: (state, action) => {
      console.log('Fetched Successfully!');
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    },
    [getAllUsersActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // getListOfDesignationActionAsync
    [getListOfDesignationActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getListOfDesignationActionAsync.fulfilled]: (state, action) => {
      console.log('Fetched Designation Successfully!');
      return {
        ...state,
        designations: action.payload,
        isLoading: false
      };
    },
    [getListOfDesignationActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getAllProjectsForLOVAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllProjectsForLOVAsync.fulfilled]: (state, action) => {
      console.log('Fetched Designation Successfully!');
      return {
        ...state,
        projects: action.payload,
        isLoading: false
      };
    },
    [getAllProjectsForLOVAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [getPostProjectAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getPostProjectAsync.fulfilled]: (state, action) => {
      console.log('Fetched Designation Successfully!');
      return {
        ...state,
        onsites: action.payload,
        isLoading: false
      };
    },
    [getPostProjectAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // createUserActionAsync
    [createUserActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [createUserActionAsync.fulfilled]: (state, action) => {
      console.log('User Created Successfully!', action);
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [createUserActionAsync.rejected]: (state, action) => {
      console.log('User rejected Successfully!', action);
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      };
    },

    // updateUserActionAsync
    [updateUserActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [updateUserActionAsync.fulfilled]: (state, action) => {
      console.log('User Updated Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [updateUserActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    [postProjectDetailsAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [postProjectDetailsAsync.fulfilled]: (state, action) => {
      console.log('Project Updated Successfully!');
      return {
        ...state,
        msg: action.payload.message,
        isLoading: false
      };
    },
    [postProjectDetailsAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // Roles
    [getAllRolesActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllRolesActionAsync.fulfilled]: (state, action) => {
      console.log('Roles fetched successfully!');
      return {
        ...state,
        roles: action.payload,
        isLoading: false
      };
    },
    [getAllRolesActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),
    // Managers
    [getAllManagersActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [getAllManagersActionAsync.fulfilled]: (state, action) => {
      console.log('Managers fetched successfully!');
      return {
        ...state,
        managers: action.payload,
        isLoading: false
      };
    },
    [getAllManagersActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // Active Inactive
    [userActiveInactiveActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [userActiveInactiveActionAsync.fulfilled]: (state) => {
      console.log('Updated Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [userActiveInactiveActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // multipleUserDeleteActionAsync
    [multipleUserDeleteActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [multipleUserDeleteActionAsync.fulfilled]: (state) => {
      console.log('Updated Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [multipleUserDeleteActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // downloadUserTemplateActionAsync
    [downloadUserTemplateActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [downloadUserTemplateActionAsync.fulfilled]: (state) => {
      console.log('Updated Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [downloadUserTemplateActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    }),

    // uploadUsersActionAsync
    [uploadUsersActionAsync.pending]: (state) => ({ ...state, isLoading: true }),
    [uploadUsersActionAsync.fulfilled]: (state) => {
      console.log('Uploaded Successfully!');
      return {
        ...state,
        isLoading: false
      };
    },
    [uploadUsersActionAsync.rejected]: (state, action) => ({
      ...state,
      error: action.payload.message,
      isLoading: false
    })
  }
});

export default userSlice.reducer;
export const { startLoading, stopLoading, getUserList, setErrorNull, setMsgNull } = userSlice.actions;

// Selector
export const getIsLoadingFromUser = (state) => state.user.isLoading;
export const getAllUsersFromUser = (state) => state.user.users;
export const getErrorFromUser = (state) => state.user.error;
export const getMsgFromUser = (state) => state.user.msg;
export const getRolesListFromUser = (state) => state.user.roles;
export const getManagersListFromUser = (state) => state.user.managers;
export const getDesignationsListFromUser = (state) => state.user.designations;
export const getProjectsListFromUser = (state) => state.user.projects;
export const getOnsitesProjects = (state) => state.user.onsites;
export const getAllProjectListFromUser = (state) => state.user.projectLov;
