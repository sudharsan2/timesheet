import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import timesheetReducer from './slices/timesheetSlice';
import timesheetsettingsReducer from './slices/timesheetSettingsSlice';
import timesheetapprovalReducer from './slices/timesheetApprovalSlice';
import kpiKraReducer from './slices/kpiKraSlice';
import leaveMasterReducer from './slices/leaveSlice';
import overTimeAprovalReducer from './slices/overTimeApprovalSlice';
import overTimeMasterReducer from './slices/overTimeMasterSlice';
import assetReducer from './slices/assetSlice';
import taskReducer from './slices/taskSlice';
import leadReducer from './slices/leadSlice';
import masterReducer from './slices/masterSlice';
import projectReducer from './slices/projectSlice';
import projReducer from './slices/projSlice';
import holiReducer from './slices/holidaySlice';

// ----------------------------------------------------------------------

// const rootPersistConfig = {
//   key: 'root',
//   storage,
//   keyPrefix: 'redux-',
//   whitelist: ['auth']
// };

const authPersistConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['isAuthenticated', 'userDetails', 'assetRefObj'],
  blacklist: ['isLoading']
};

const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['users', 'roles'],
  blacklist: ['isLoading', 'error']
};

const assetPersisConfig = {
  key: 'asset',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['users', 'editData'],
  blacklist: ['isLoading', 'error']
};

const timesheetSettingsPersistConfig = {
  key: 'timesheetsettings',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['kkmasterDetails', 'groups'],
  blacklist: ['isLoading', 'error']
};

const resetpasswordPersistConfig = {
  key: 'resetpassword',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['kkmasterDetails', 'groups'],
  blacklist: ['isLoading', 'error']
};

const timesheetApprovalPersistConfig = {
  key: 'timesheetApproval',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['data', 'approvalData', 'taskData', 'status', 'timesheetIdDetails'],
  blacklist: ['isLoading', 'error']
};

const timesheetConfig = {
  key: 'timesheet',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['selectedDate', 'status', 'category', 'project', 'data'],
  blacklist: ['isLoading', 'error']
};

const leaveMasterConfig = {
  key: 'leavemaster',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['countries'],
  blacklist: ['isLoading', 'error']
};

const kpiKraPersistConfig = {
  key: 'kpi',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['kpiKraSelfRating', 'kpiAndKraList', 'kpiKraManagerRating', 'kpiAndKraManagerList', 'groups'],
  blacklist: ['isLoading', 'error']
};

const overTimeApprovalConfig = {
  key: 'overTimeApproval',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['overTimeList', 'overTimeSingleList', 'overTimeDetails'],
  blacklist: ['isLoading', 'error']
};

const overTimeMasterConfig = {
  key: 'overTimeMaster',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['overTimeList', 'overTimeSingleList', 'overTimeDetails'],
  blacklist: ['isLoading', 'error']
};

const taskPersisConfig = {
  key: 'task',
  storage,
  whitelist: ['tasks', 'editData', 'types', 'names', 'priority', 'status'],
  blacklist: ['isLoading', 'error']
};

const leadPersisConfig = {
  key: 'lead',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['leads', 'editData'],
  blacklist: ['isLoading', 'error']
};

const masterPersisConfig = {
  key: 'master',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['masters', 'editData'],
  blacklist: ['isLoading', 'error']
};

const calenderPersisConfig = {
  key: 'project',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['calender', 'editData', 'managerList'],
  blacklist: ['isLoading', 'error']
};

const projectPersisConfig = {
  key: 'proj',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['projects', 'editData', 'travel', 'statusreq', 'manager'],
  blacklist: ['isLoading', 'error']
};

const holidayPersisConfig = {
  key: 'holiday',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['holidays', 'editData'],
  blacklist: ['isLoading', 'error']
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  asset: persistReducer(assetPersisConfig, assetReducer),
  task: persistReducer(taskPersisConfig, taskReducer),
  timesheet: persistReducer(timesheetConfig, timesheetReducer),
  kpi: persistReducer(kpiKraPersistConfig, kpiKraReducer),
  timesheetsettings: persistReducer(timesheetSettingsPersistConfig, timesheetsettingsReducer),
  resetpassword: persistReducer(resetpasswordPersistConfig, timesheetsettingsReducer),
  timesheetApproval: persistReducer(timesheetApprovalPersistConfig, timesheetapprovalReducer),
  leaveMaster: persistReducer(leaveMasterConfig, leaveMasterReducer),
  overTimeApproval: persistReducer(overTimeApprovalConfig, overTimeAprovalReducer),
  overTimeMaster: persistReducer(overTimeMasterConfig, overTimeMasterReducer),
  lead: persistReducer(leadPersisConfig, leadReducer),
  master: persistReducer(masterPersisConfig, masterReducer),
  project: persistReducer(calenderPersisConfig, projectReducer),
  proj: persistReducer(projectPersisConfig, projReducer),
  holiday: persistReducer(holidayPersisConfig, holiReducer)
});

const reducers = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    storage.removeItem('redux-user');
    storage.removeItem('redux-asset');
    storage.removeItem('redux-task');
    storage.removeItem('redux-lead');
    storage.removeItem('redux-master');

    // storage.removeItem('redux-auth');
    storage.removeItem('redux-timesheet');
    storage.removeItem('redux-timesheetsettings');
    storage.removeItem('redux-resetpassword');
    storage.removeItem('redux-timesheetApproval');
    storage.removeItem('redux-leavemaster');
    storage.removeItem('redux-project');
    storage.removeItem('redux-proj');
    storage.removeItem('redux-holiday');
    return rootReducer(undefined, action);
  }

  return rootReducer(state, action);
};

export { rootReducer, reducers };
