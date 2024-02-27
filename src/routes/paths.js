/* eslint-disable no-dupe-keys */
// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

export const ROOT_NAME = 'techstep/';

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    root: path(ROOTS_DASHBOARD, '/metrics')
  },
  admin: {
    root: path(ROOTS_DASHBOARD, '/admin'),
    userManagement: path(ROOTS_DASHBOARD, '/admin/user-management'),
    userCreate: path(ROOTS_DASHBOARD, '/admin/user-management/user-create'),
    userEdit: path(ROOTS_DASHBOARD, '/admin/user-management/user-edit'),
    userBulkUpload: path(ROOTS_DASHBOARD, '/admin/user-management/user-bulkupload'),
    userAsset: path(ROOTS_DASHBOARD, '/admin/user-management/user-asset'),
    createAsset: path(ROOTS_DASHBOARD, '/admin/user-management/create-asset'),
    assetCreate: path(ROOTS_DASHBOARD, '/admin/user-management/asset-create'),
    assetEdit: path(ROOTS_DASHBOARD, '/admin/user-management/asset-edit'),
    assetDetails: path(ROOTS_DASHBOARD, '/admin/user-management/asset-details'),
    assetAssign: path(ROOTS_DASHBOARD, '/admin/user-management/asset-assign'),
    unassignedAsset: path(ROOTS_DASHBOARD, '/admin/user-management/unassigned-asset'),
    createUserAsset: path(ROOTS_DASHBOARD, '/admin/user-management/create-user-asset'),
    assetHistory: path(ROOTS_DASHBOARD, '/admin/user-management/asset-history'),
    onsiteProject: path(ROOTS_DASHBOARD, '/admin/user-management/onsite-project'),
    workedProj: path(ROOTS_DASHBOARD, '/admin/user-management/worked-proj')
  },
  timesheet: {
    root: path(ROOTS_DASHBOARD, '/timesheet'),
    timesheet: path(ROOTS_DASHBOARD, '/timesheet/timesheet-entry'),
    addTimesheet: path(ROOTS_DASHBOARD, '/timesheet/add-timesheet'),
    editTimesheet: path(ROOTS_DASHBOARD, '/timesheet/edit-timesheet'),
    reports: path(ROOTS_DASHBOARD, '/timesheet/reports'),
    approval: path(ROOTS_DASHBOARD, '/timesheet/approval'),
    approvalList: path(ROOTS_DASHBOARD, '/timesheet/approvalList'),
    leaveApproval: path(ROOTS_DASHBOARD, '/timesheet/timesheet-manager-leave-approval'),
    leaveAndOvertimeApplication: path(ROOTS_DASHBOARD, '/timesheet/timesheet-manager-leave-application'),
    settings: path(ROOTS_DASHBOARD, '/timesheet/timesheet-settings'),
    leaveMasterSettings: path(ROOTS_DASHBOARD, '/timesheet/leave-master-settings'),
    overtimeMasterSettings: path(ROOTS_DASHBOARD, '/timesheet/overtime-master-settings'),
    kpiKraSelfRating: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-self-rating'),
    kpiKraManagerRating: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-manager-rating'),
    kpiKraUserRatingList: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-user-rating-list'),
    kpiKraConfigurations: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-config'),
    kpiKraConfigurationsCreate: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-config/create'),
    kpiKraConfigurationsEdit: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-config/edit'),
    kpiKraMaster: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-master'),
    kpiKraMasterCreate: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-master/create'),
    kpiKraMasterEdit: path(ROOTS_DASHBOARD, '/timesheet/timesheet-kpi-kra-master/edit'),
    projectMaster: path(ROOTS_DASHBOARD, '/timesheet/timesheet-project-master'),
    projectMasterCreate: path(ROOTS_DASHBOARD, '/timesheet/timesheet-project-master/create'),
    projectMasterEdit: path(ROOTS_DASHBOARD, '/timesheet/timesheet-project-master/edit'),
    timesheetUserConfigurations: path(ROOTS_DASHBOARD, '/timesheet/timesheet-user-settings'),
    timesheetUserConfigurationsUpdate: path(ROOTS_DASHBOARD, '/timesheet/timesheet-user-settings/update'),
    overTime: path(ROOTS_DASHBOARD, '/timesheet/overtime-entry'),
    overTimeApproval: path(ROOTS_DASHBOARD, '/timesheet/overtime-approval'),
    leaveEntry: path(ROOTS_DASHBOARD, '/timesheet/leave-entry'),
    overTimeApprovalList: path(ROOTS_DASHBOARD, '/timesheet/overTime-approvalList'),
    timeSheetBulkUpload: path(ROOTS_DASHBOARD, '/timesheet/timesheet-entry/bulk-upload'),
    userDetails: path(ROOTS_DASHBOARD, '/timesheet/user-details'),
    applyIssue: path(ROOTS_DASHBOARD, '/timesheet/apply-issue'),
    historyAsset: path(ROOTS_DASHBOARD, '/timesheet/history-asset'),
    approveIssue: path(ROOTS_DASHBOARD, '/timesheet/approve-issue'),
    pendingIssue: path(ROOTS_DASHBOARD, '/timesheet/pending-issue'),
    orderFood: path(ROOTS_DASHBOARD, '/timesheet/order-food')
    // addIssue: path(ROOTS_DASHBOARD, '/timesheet/add-issue')
  },

  task: {
    root: path(ROOTS_DASHBOARD, '/task'),
    taskList: path(ROOTS_DASHBOARD, '/task/task-list'),
    taskAssigned: path(ROOTS_DASHBOARD, '/task/task-assigned'),
    taskCreate: path(ROOTS_DASHBOARD, '/task/task-create'),
    taskEdit: path(ROOTS_DASHBOARD, '/task/task-edit'),
    taskOwnerEdit: path(ROOTS_DASHBOARD, '/task/task-owner-edit'),
    taskHistory: path(ROOTS_DASHBOARD, '/task/task-history')
  },
  travel: {
    travelSummary: path(ROOTS_DASHBOARD, '/travel/travel-summary'),
    requestForm: path(ROOTS_DASHBOARD, '/travel/request-form'),
    reqApproval: path(ROOTS_DASHBOARD, '/travel/req-approval'),
    reqStatus: path(ROOTS_DASHBOARD, '/travel/req-status'),
    approveStatus: path(ROOTS_DASHBOARD, '/travel/approve-status'),
    approveManager: path(ROOTS_DASHBOARD, '/travel/approve-manager'),
    reqWFH: path(ROOTS_DASHBOARD, '/travel/req-wfh'),
    reqForm: path(ROOTS_DASHBOARD, '/travel/req-form'),
    reqEdit: path(ROOTS_DASHBOARD, '/travel/req-Edit'),
    requestApproval: path(ROOTS_DASHBOARD, '/travel/request-approval'),
    statusApproval: path(ROOTS_DASHBOARD, '/travel/status-approval'),
    eodStatus: path(ROOTS_DASHBOARD, '/travel/eod-status'),
    reviewStatus: path(ROOTS_DASHBOARD, '/travel/reviewed-status'),
    taskApproval: path(ROOTS_DASHBOARD, '/travel/task-approval')
  },

  review: {
    projSequence: path(ROOTS_DASHBOARD, '/review/proj-sequence'),
    findProject: path(ROOTS_DASHBOARD, '/review/find-project'),
    createReview: path(ROOTS_DASHBOARD, '/review/create-review'),
    editReview: path(ROOTS_DASHBOARD, '/review/edit-review'),
    openTicket: path(ROOTS_DASHBOARD, '/review/open-ticket'),
    editWeekRev: path(ROOTS_DASHBOARD, '/review/edit-weekrev'),
    createFixed: path(ROOTS_DASHBOARD, '/review/create-fixed'),
    fixedStatus: path(ROOTS_DASHBOARD, '/review/fixed-status'),
    statusReview: path(ROOTS_DASHBOARD, '/review/status-review'),
    supportProjectReview: path(ROOTS_DASHBOARD, '/review/support-project-review'),
    supportDashboard: path(ROOTS_DASHBOARD, '/review/support-dashboard'),
    reviewReports: path(ROOTS_DASHBOARD, '/review/reviewReports'),
    reviewDashboard: path(ROOTS_DASHBOARD, '/review/support-review')
  },

  project: {
    projectCreate: path(ROOTS_DASHBOARD, '/project/project-create'),
    createProject: path(ROOTS_DASHBOARD, '/project/create-project'),
    editProject: path(ROOTS_DASHBOARD, '/project/edit-project'),
    projectCalendar: path(ROOTS_DASHBOARD, '/project/project-calendar'),
    uploadPaysquare: path(ROOTS_DASHBOARD, '/project/upload-paysquare'),
    downloadReport: path(ROOTS_DASHBOARD, '/project/download-report'),
    exceptionDetails: path(ROOTS_DASHBOARD, '/project/exception-details'),
    createCalculator: path(ROOTS_DASHBOARD, '/project/create-calendar'),
    editCalendar: path(ROOTS_DASHBOARD, '/project/edit-calendar'),
    leaveUpload: path(ROOTS_DASHBOARD, '/project/leave-upload'),
    uploadBiometric: path(ROOTS_DASHBOARD, '/project/upload-biometric'),
    uploadDashboard: path(ROOTS_DASHBOARD, '/project/upload-dashboard'),
    leaveList: path(ROOTS_DASHBOARD, '/project/leave-list'),

    projectCreate: path(ROOTS_DASHBOARD, '/project/project-create')
  },

  crm: {
    root: path(ROOTS_DASHBOARD, '/crm'),
    LeadEntryScreen: path(ROOTS_DASHBOARD, '/crm/LeadEntryScreen'),
    LeadManager: path(ROOTS_DASHBOARD, '/crm/LeadManager'),
    LeadNewentry: path(ROOTS_DASHBOARD, '/crm/LeadNewentry'),
    LeadEdit: path(ROOTS_DASHBOARD, '/crm/LeadEdit'),
    Remarks: path(ROOTS_DASHBOARD, '/crm/Remarks'),
    Report: path(ROOTS_DASHBOARD, '/crm/Report'),
    Master: path(ROOTS_DASHBOARD, '/crm/MasterScreen'),
    MasterManager: path(ROOTS_DASHBOARD, '/crm/MasterManager'),
    MasterNewentry: path(ROOTS_DASHBOARD, '/crm/MasterNewentry'),
    MasterEdit: path(ROOTS_DASHBOARD, '/crm/MasterEdit'),
    CrmReports: path(ROOTS_DASHBOARD, '/crm/CRMReports'),
    FollowUp: path(ROOTS_DASHBOARD, '/crm/FollowUp'),
    FollowUpManager: path(ROOTS_DASHBOARD, '/crm/FollowUpManager'),
    BulkUploadcrm: path(ROOTS_DASHBOARD, '/crm/BulkUploadCRM')
  },

  managers: {
    root: path(ROOTS_DASHBOARD, '/managers'),
    managersTaskList: path(ROOTS_DASHBOARD, '/managers/managers-task-list')
  },
  changePassword: {
    changePassword: path(ROOTS_DASHBOARD, '/changePassword')
  }
};

// ------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  resetPasswordPage: path(ROOTS_AUTH, '/resetpasswordpage/resetPwd'),
  managerAcknowledgement: path(ROOTS_AUTH, '/service/postAck/reset'),
  managerProjectAcknowledge: path(ROOTS_AUTH, '/service/projectAck/reset'),
  verify: path(ROOTS_AUTH, '/verify'),
  assetCapture: path(ROOTS_AUTH, '/asset-capture')
};
