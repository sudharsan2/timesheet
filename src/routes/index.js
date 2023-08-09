/* eslint-disable no-unused-vars */
import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import ResetPassword from '../pages/authentication/ResetPassword';
import VerifyCode from '../pages/authentication/VerifyCode';
import Login from '../pages/authentication/Login';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
import DashboardLayout from '../layouts/dashboard';
import Password from '../pages/ResetPasswordPage/Password';
import LeadNewentry from '../pages/crm/LeadNewEntry';
import CRMReport from '../pages/crm/Report';
import FollowUp from '../pages/crm/FollowUp';
import BulkUploadCRM from '../pages/crm/BulkUpload';
import FollowUpManager from '../pages/crm/FollowUpManager';
import Acknowledge from '../pages/ResetPasswordPage/Acknowledge';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes(
    [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />
          },
          { path: 'reset-password', element: <ResetPassword /> },
          { path: 'verify', element: <VerifyCode /> },
          { path: `resetpasswordpage/resetPwd/:token`, element: <Password /> },
          {
            path: 'service/postAck/reset/:resetToken/:employeeId/:oldManagerId/:newManagerId',
            element: <Acknowledge />
          },
          { path: 'asset-capture', element: <AssetCaptureScreen /> }
        ]
      },

      // Dashboard Routes
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          { path: 'metrics', element: <Metrics /> },
          { path: 'changePassword', element: <ChangePassword /> },
          {
            path: 'admin',
            children: [
              { element: <Navigate to="/dashboard/admin/user-management" replace /> },
              {
                path: 'user-management',
                element: (
                  <RoleBasedGuard accessibleRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                    <UserManagement />
                  </RoleBasedGuard>
                )
              },
              { path: 'user-management/user-create', element: <UserCreate /> },
              { path: 'user-management/user-edit/:employeeId', element: <UserEdit /> },
              { path: 'user-management/user-bulkupload', element: <UserBulkupload /> },
              { path: 'user-management/user-asset', element: <UserAsset /> },
              { path: 'user-management/create-asset', element: <CreateAsset /> },
              { path: 'user-management/asset-create', element: <AssetCreate /> },
              { path: 'user-management/asset-edit/:assetCategory', element: <AssetEdit /> },
              { path: 'user-management/asset-details', element: <AssetDetails /> },
              { path: 'user-management/asset-assign', element: <AssignAsset /> },
              { path: 'user-management/unassigned-asset', element: <UnassignedAsset /> },
              { path: 'user-management/create-user-asset', element: <CreateUserAsset /> },
              { path: 'user-management/asset-history', element: <AssetHistory /> },
              { path: 'user-management/onsite-project/:employeeId', element: <OnsiteProject /> }
            ]
          },
          {
            path: 'timesheet',
            children: [
              { element: <Navigate to="/dashboard/timesheet/timesheet-entry" replace /> },
              { path: 'timesheet-entry', element: <TimesheetEntry /> },
              { path: 'add-timesheet', element: <AddTimesheet /> },
              { path: 'user-details', element: <UserDetails /> },
              { path: 'apply-issue/:assetId', element: <ApplyIssue /> },
              { path: 'pending-issue', element: <PendingIssue /> },
              { path: 'history-asset', element: <HistoryAsset /> },
              { path: 'approve-issue', element: <AssetIssueApproved /> },
              // { path: 'add-issue', element: <AddIssue /> },
              { path: 'edit-timesheet', element: <EditTimesheet /> },
              { path: 'reports', element: <Reports /> },
              { path: 'approval', element: <Approval /> },
              { path: 'approvalList', element: <TSApprovalList /> },
              { path: 'timesheet-manager-leave-approval', element: <LeaveApproval /> },
              { path: 'timesheet-manager-leave-application', element: <LeaveAndOvertimeApplication /> },
              { path: 'timesheet-kpi-kra-self-rating', element: <KpiKraSelfRating /> },
              { path: 'timesheet-kpi-kra-manager-rating', element: <KpiKraManagerRating /> },
              { path: 'timesheet-kpi-kra-user-rating-list/:kpiKraId', element: <KpiKraUserRatingList /> },
              { path: 'timesheet-settings', element: <Settings /> },
              { path: 'leave-master-settings', element: <LeaveSettings /> },
              { path: 'overtime-master-settings', element: <OvertimeSettings /> },
              { path: 'timesheet-kpi-kra-config', element: <KpiKraConfigurations /> },
              {
                path: 'timesheet-kpi-kra-master',
                element: <KpiKraMaster />
              },
              {
                path: 'timesheet-user-settings',
                element: <TimesheetUserConfigurations />
              },
              {
                path: 'timesheet-user-settings/update/:employeeId',
                element: <TimesheetUserConfigurationsEdit />
              },
              { path: 'timesheet-kpi-kra-master/create', element: <KpiKraMasterCreate /> },
              { path: 'timesheet-kpi-kra-master/edit/:id', element: <KpiKraMasterEdit /> },
              { path: 'timesheet-project-master', element: <ProjectMaster /> },
              { path: 'timesheet-project-master/create', element: <ProjectMasterCreate /> },
              { path: 'timesheet-project-master/edit/:id', element: <ProjectMasterEdit /> },
              { path: 'overtime-entry', element: <OverTime /> },
              { path: 'overtime-approval', element: <OverTimeApproval /> },
              { path: 'leave-entry', element: <LeaveEntry /> },
              { path: 'overtime-approvalList', element: <OverTimeApprovalList /> },
              { path: 'timesheet-entry/bulk-upload', element: <TimesheetBulkUpload /> },
              { path: 'order-food', element: <OrderFood /> }
            ]
          },

          {
            path: 'task',
            children: [
              { element: <Navigate to="/dashboard/task/task-list" replace /> },
              { path: 'task-list', element: <TaskList /> },
              { path: 'task-assigned', element: <TaskAssigned /> },
              { path: 'task-create', element: <TaskCreate /> },
              { path: 'task-edit/:type', element: <TaskEdit /> },
              { path: 'task-owner-edit/:type', element: <TaskOwnerEdit /> },
              { path: 'task-history/:managerId', element: <TaskHistory /> }
            ]
          },
          {
            path: 'travel',
            children: [
              { element: <Navigate to="/dashboard/travel/travel-summary" replace /> },
              {
                path: 'travel-summary',
                element: <TravelSummary />
              },
              {
                path: 'request-form',
                element: <RequestForm />
              },
              {
                path: 'req-approval',
                element: <ReqApproval />
              },
              {
                path: 'req-status',
                element: <ReqStatus />
              },
              {
                path: 'approve-status/:travel_id',
                element: <ApproveStatusList />
              },
              {
                path: 'approve-manager/:travel_id',
                element: <ApprovalListTool />
              }
            ]
          },
          {
            path: 'project',
            children: [
              { element: <Navigate to="/dashboard/project/project-create" replace /> },
              {
                path: 'project-create',
                element: <ProjectCreate />
              },
              {
                path: 'create-project',
                element: <CreateProject />
              },
              {
                path: 'edit-project/:projId',
                element: <EditProject />
              },
              {
                path: 'project-calendar',
                element: <ProjectCalendar />
              },
              {
                path: 'upload-paysquare',
                element: <UploadPaysquare />
              },
              {
                path: 'download-report',
                element: <DownloadReport />
              },
              {
                path: 'exception-details/:projId',
                element: <ExceptionDetails />
              },
              {
                path: 'create-calendar',
                element: <CreateCalendar />
              },
              {
                path: 'edit-calendar/:calenderId',
                element: <EditCalendar />
              },
              {
                path: 'leave-upload/:projId',
                element: <LeaveUpload />
              },
              {
                path: 'upload-biometric',
                element: <UploadBiometric />
              },
              {
                path: 'upload-dashboard',
                element: <UploadDashboard />
              },
              {
                path: 'leave-list/:projId',
                element: <LeaveList />
              }
            ]
          },

          // {
          //   path: 'admin',
          //   children: [
          //     { element: <Navigate to="/dashboard/admin/user-management" replace /> },
          //     {
          //       path: 'user-management',
          //       element: (
          //         <RoleBasedGuard accessibleRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
          //           <UserManagement />
          //         </RoleBasedGuard>
          //       )
          //     },
          {
            path: 'crm',
            children: [
              { element: <Navigate to="/dashboard/crm/LeadEntryScreen" replace /> },
              {
                path: 'crm',
                element: (
                  <RoleBasedGuard accessibleRoles={['CRM_REPRESENTATIVE', 'CRM_MANAGER']}>
                    <LeadEntryScreen />
                  </RoleBasedGuard>
                )
              },
              { path: 'LeadEntryScreen', element: <LeadEntryScreen /> },
              { path: 'LeadManager', element: <LeadManager /> },
              { path: 'LeadNewentry', element: <LeadNewentry /> },
              { path: 'LeadEdit/:lead_id', element: <LeadEdit /> },
              { path: 'Remarks/:lead_id', element: <Remarks /> },
              { path: 'MasterScreen', element: <Master /> },
              { path: 'MasterManager', element: <MasterManager /> },
              { path: 'MasterNewentry', element: <MasterNewentry /> },
              { path: 'MasterEdit/:master_id', element: <MasterEdit /> },
              { path: 'CRMReports', element: <CRMReport /> },
              { path: 'FollowUp', element: <FollowUp /> },
              { path: 'FollowUpManager', element: <FollowUpManager /> },
              { path: 'BulkUploadCRM', element: <BulkUploadCRM /> }
            ]
          },

          {
            path: 'managers',
            children: [
              { element: <Navigate to="/dashboard/managers/managers-task-list" replace /> },
              { path: 'managers-task-list', element: <ManagersTaskList /> }
            ]
          }
        ]
      },

      // Main Routes
      {
        path: '*',
        element: <LogoOnlyLayout />,
        children: [
          { path: '404', element: <NotFound /> },
          { path: '500', element: <ServerError /> },
          { path: '*', element: <Navigate to="/404" replace /> }
        ]
      },
      {
        path: '/',
        element: <MainLayout />,
        children: [{ element: <LandingPage /> }]
      },
      { path: '*', element: <Navigate to="/404" replace /> }
    ],
    { basename: 'techstep' }
  );
}

// IMPORT COMPONENTS

// Dashboard
const TimesheetEntry = Loadable(lazy(() => import('../pages/timesheet/TimesheetEntryScreen')));
const AddTimesheet = Loadable(lazy(() => import('../pages/timesheet/AddTimesheet')));
const UserDetails = Loadable(lazy(() => import('../pages/timesheet/UserDetails')));
const ApplyIssue = Loadable(lazy(() => import('../pages/timesheet/ApplyIssue')));
const PendingIssue = Loadable(lazy(() => import('../pages/approval/PendingIssue')));
const HistoryAsset = Loadable(lazy(() => import('../pages/timesheet/HistoryAsset')));
const AssetIssueApproved = Loadable(lazy(() => import('../pages/approval/AssetIssueApproved')));
// const AddIssue = Loadable(lazy(() => import('../pages/timesheet/AddIssue')));
const EditTimesheet = Loadable(lazy(() => import('../pages/timesheet/EditTimesheet')));
const UserManagement = Loadable(lazy(() => import('../pages/administrator/UserManagement')));
const UserCreate = Loadable(lazy(() => import('../pages/administrator/UserCreate')));
const UserEdit = Loadable(lazy(() => import('../pages/administrator/UserEdit')));
const OnsiteProject = Loadable(lazy(() => import('../pages/administrator/OnsiteProject')));
const UserBulkupload = Loadable(lazy(() => import('../pages/administrator/UserBulkupload')));
const UserAsset = Loadable(lazy(() => import('../pages/administrator/UserAsset')));
const CreateAsset = Loadable(lazy(() => import('../pages/administrator/CreateAsset')));
const AssetCreate = Loadable(lazy(() => import('../pages/administrator/AssetCreate')));
const AssetHistory = Loadable(lazy(() => import('../pages/administrator/AssetHistory')));
const AssetDetails = Loadable(lazy(() => import('../pages/administrator/AssetDetails')));
const AssignAsset = Loadable(lazy(() => import('../pages/administrator/AssignAsset')));
const UnassignedAsset = Loadable(lazy(() => import('../pages/administrator/UnassignedAsset')));
const CreateUserAsset = Loadable(lazy(() => import('../pages/administrator/CreateUserAsset')));
const AssetEdit = Loadable(lazy(() => import('../pages/administrator/AssetEdit')));
const NotFound = Loadable(lazy(() => import('../pages/errors/Page404')));
const ServerError = Loadable(lazy(() => import('../pages/errors/Page500')));
const Reports = Loadable(lazy(() => import('../pages/timesheetreports/Reports')));
const Settings = Loadable(lazy(() => import('../pages/timesheetsettings/TimesheetSettings')));
const LeaveSettings = Loadable(lazy(() => import('../pages/timesheetsettings/LeaveMaster')));
const OvertimeSettings = Loadable(
  lazy(() => import('../pages/timesheetsettings/OvertimeMasterComponents/OvertimeMaster'))
);
const KpiKraSelfRating = Loadable(lazy(() => import('../pages/timesheet/KpiKraSelfRating')));
const KpiKraUserRatingList = Loadable(
  lazy(() => import('../pages/approval/KpiKraManagerRatingComponents/KpiKraUserRatingList'))
);
const KpiKraManagerRating = Loadable(lazy(() => import('../pages/approval/KpiKraManagerRating')));
const KpiKraConfigurations = Loadable(lazy(() => import('../pages/timesheetsettings/KpiKraConfiguration')));
const KpiKraMaster = Loadable(lazy(() => import('../pages/timesheetsettings/KpiKraMaster')));
const KpiKraMasterCreate = Loadable(
  lazy(() => import('../pages/timesheetsettings/kpi-kra-master-components/KpiKraMasterCreate'))
);
const KpiKraMasterEdit = Loadable(
  lazy(() => import('../pages/timesheetsettings/kpi-kra-master-components/KpiKraMasterEdit'))
);
const ProjectMaster = Loadable(lazy(() => import('../pages/timesheetsettings/ProjectMaster')));
const ProjectMasterCreate = Loadable(
  lazy(() => import('../pages/timesheetsettings/ProjectMasterComponents/ProjectMasterCreate'))
);
const ProjectMasterEdit = Loadable(
  lazy(() => import('../pages/timesheetsettings/ProjectMasterComponents/ProjectMasterEdit'))
);
const TimesheetUserConfigurations = Loadable(
  lazy(() => import('../pages/timesheetsettings/TimesheetUserConfigurations'))
);
const TimesheetUserConfigurationsEdit = Loadable(
  lazy(() => import('../pages/timesheetsettings/timesheet-user-configurations-components/TimesheetUserUpdateDetails'))
);
const OverTime = Loadable(lazy(() => import('../pages/overtime/OverTime')));
const OverTimeApproval = Loadable(lazy(() => import('../pages/overtime/OverTimeApproval')));
const LeaveEntry = Loadable(lazy(() => import('../pages/timesheet/LeaveEntry')));
const LeaveApproval = Loadable(lazy(() => import('../pages/approval/LeaveApproval')));
const LeaveAndOvertimeApplication = Loadable(lazy(() => import('../pages/timesheet/LeaveAndOverTimeApplication')));
const Approval = Loadable(lazy(() => import('../pages/approval/TimesheetApproval')));
const TSApprovalList = Loadable(lazy(() => import('../pages/approval/TSApprovalList')));
const Metrics = Loadable(lazy(() => import('../pages/general/Metrics')));
const ChangePassword = Loadable(lazy(() => import('../pages/ResetPasswordPage/ChangePassword')));
const OverTimeApprovalList = Loadable(lazy(() => import('../pages/overtime/OverTimeApprovalList')));
const TimesheetBulkUpload = Loadable(lazy(() => import('../pages/timesheet/TimesheetBulkUpload')));
const AssetCaptureScreen = Loadable(lazy(() => import('../pages/assetmanagement/AssetCapture/AssetCapture')));

// Main
const LandingPage = Loadable(lazy(() => import('../pages/home/LandingPage')));

// Task
const TaskList = Loadable(lazy(() => import('../pages/taskdetails/TaskList')));
const TaskAssigned = Loadable(lazy(() => import('../pages/taskdetails/TaskAssigned')));
const TaskCreate = Loadable(lazy(() => import('../pages/taskdetails/TaskCreate')));
const TaskEdit = Loadable(lazy(() => import('../pages/taskdetails/TaskEdit')));
const TaskOwnerEdit = Loadable(lazy(() => import('../pages/taskdetails/TaskOwnerEdit')));
const TaskHistory = Loadable(lazy(() => import('../pages/taskdetails/TaskHistory')));

// CRM
const LeadEntryScreen = Loadable(lazy(() => import('../pages/crm/LeadEntryScreen')));
const LeadManager = Loadable(lazy(() => import('../pages/crm/LeadManager')));
const LeadNewEntry = Loadable(lazy(() => import('../pages/crm/LeadNewEntry')));
const LeadEdit = Loadable(lazy(() => import('../pages/crm/LeadEdit')));
const Remarks = Loadable(lazy(() => import('../pages/crm/Remarks')));
const Master = Loadable(lazy(() => import('../pages/crm/MasterScreen')));
const MasterManager = Loadable(lazy(() => import('../pages/crm/MasterManager')));
const MasterNewentry = Loadable(lazy(() => import('../pages/crm/MasterNewEntry')));
const MasterEdit = Loadable(lazy(() => import('../pages/crm/MasterEdit')));

// Managers
const ManagersTaskList = Loadable(lazy(() => import('../pages/managers/TaskList')));

// Food
const OrderFood = Loadable(lazy(() => import('../pages/foodie/OrderFood')));

// project
const ProjectCreate = Loadable(lazy(() => import('../pages/project/ProjectCreate')));
const CreateProject = Loadable(lazy(() => import('../pages/project/CreateProject')));
const EditProject = Loadable(lazy(() => import('../pages/project/EditProject')));
const ProjectCalendar = Loadable(lazy(() => import('../pages/project/ProjectCalendar')));
const UploadPaysquare = Loadable(lazy(() => import('../pages/project/UploadPaysquare')));
const DownloadReport = Loadable(lazy(() => import('../pages/project/DownloadReport')));
const ExceptionDetails = Loadable(lazy(() => import('../pages/project/ExceptionDetails')));
const CreateCalendar = Loadable(lazy(() => import('../pages/project/CreateCalendar')));
const EditCalendar = Loadable(lazy(() => import('../pages/project/EditCalendar')));
const LeaveUpload = Loadable(lazy(() => import('../pages/project/LeaveUpload')));
const UploadBiometric = Loadable(lazy(() => import('../pages/project/UploadBiometric')));
const UploadDashboard = Loadable(lazy(() => import('../pages/project/UploadDashboard')));
const LeaveList = Loadable(lazy(() => import('../pages/project/LeaveList')));
const TravelSummary = Loadable(lazy(() => import('../pages/travelmanagement/TravelSummary')));
const RequestForm = Loadable(lazy(() => import('../pages/travelmanagement/RequestForn')));
const ReqApproval = Loadable(lazy(() => import('../pages/travelmanagement/ReqApproval')));
const ReqStatus = Loadable(lazy(() => import('../pages/travelmanagement/ReqStatus')));
const ApproveStatusList = Loadable(lazy(() => import('../pages/travelmanagement/ApproveStatusList')));
const ApprovalListTool = Loadable(lazy(() => import('../pages/travelmanagement/ApprovalListTool')));
