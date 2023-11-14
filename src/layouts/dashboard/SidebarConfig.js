/* eslint-disable no-dupe-keys */
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';

import ConnectingAirportsOutlinedIcon from '@mui/icons-material/ConnectingAirportsOutlined';

import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';

import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';

import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ReviewsIcon from '@mui/icons-material/Reviews';

// routes
// eslint-disable-next-line import/named
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle
    src={`${process.env.PUBLIC_URL}/static/icons/navbar/${name}.svg`}
    sx={{ width: '100%', height: '100%' }}
  />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  users: getIcon('ic_kanban')
};

export const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },

  // USER MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'administrator',
    items: [
      {
        title: 'user management',
        path: PATH_DASHBOARD.admin.root,
        icon: ICONS.user,
        children: [
          { title: 'Users', path: PATH_DASHBOARD.admin.userManagement },
          { title: 'Laptop Details', path: PATH_DASHBOARD.admin.userAsset },
          { title: 'Asset', path: PATH_DASHBOARD.admin.createAsset },
          { title: 'Asset Issues', path: PATH_DASHBOARD.timesheet.approveIssue }
        ]
      }
    ]
  },

  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'KPI-KRA Approval', path: PATH_DASHBOARD.timesheet.kpiKraManagerRating },
          { title: 'Timesheet Approval', path: PATH_DASHBOARD.timesheet.approval },
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Leave Approval', path: PATH_DASHBOARD.timesheet.leaveApproval },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime },
          // { title: 'Over Time Approval', path: PATH_DASHBOARD.timesheet.overTimeApproval },
          { title: 'settings', path: PATH_DASHBOARD.timesheet.settings },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
        ]
      }
    ]
  },

  // {
  //   subheader: 'WFH Request',
  //   items: [
  //     {
  //       title: 'WFH Request',
  //       path: PATH_DASHBOARD.travel.root,
  //       icon: <AssuredWorkloadOutlinedIcon sx={{ fontSize: 19 }} />,
  //       children: [
  //         {
  //           title: 'request',
  //           path: PATH_DASHBOARD.travel.reqWFH
  //         },
  //         {
  //           title: 'request approval',
  //           path: PATH_DASHBOARD.travel.requestApproval
  //         },
  //         {
  //           title: 'task entry',
  //           path: PATH_DASHBOARD.travel.eodStatus
  //         },
  //         {
  //           title: 'task review',
  //           path: PATH_DASHBOARD.travel.reviewStatus
  //         }
  //       ]
  //     }
  //   ]
  // },

  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary },
          { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval }
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },

  // TASK DETAILS

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },

  // project Creation

  {
    subheader: 'Project',
    items: [
      {
        title: 'project',
        path: PATH_DASHBOARD.project.root,
        icon: ICONS.analytics,
        children: [
          { title: 'project Creation', path: PATH_DASHBOARD.project.projectCreate },
          // { title: 'Upload Paysquare', path: PATH_DASHBOARD.project.uploadPaysquare },
          // { title: 'Upload Biometric', path: PATH_DASHBOARD.project.uploadBiometric },
          { title: 'Upload Details', path: PATH_DASHBOARD.project.uploadDashboard },
          { title: 'LOP Report', path: PATH_DASHBOARD.project.downloadReport }
        ]
      }
    ]
  },

  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          // { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          // { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  },

  // {
  //   subheader: 'Project',
  //   items: [
  //     {
  //       title: 'project',
  //       path: PATH_DASHBOARD.project.root,
  //       icon: ICONS.analytics,
  //       children: [{ title: 'project Creation', path: PATH_DASHBOARD.project.projectCreate }]
  //     }
  //   ]
  // },

  // MANAGERS APP

  {
    subheader: 'managers',
    items: [{ title: 'Overview', path: PATH_DASHBOARD.managers.managersTaskList }]
  }
];

// CRM Manager and Manager

export const CRMandManagerSidebar = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },

  // USER MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'administrator',
    items: [
      {
        title: 'user management',
        path: PATH_DASHBOARD.admin.root,
        icon: ICONS.user,
        children: [
          { title: 'Users', path: PATH_DASHBOARD.admin.userManagement },
          { title: 'Laptop Details', path: PATH_DASHBOARD.admin.userAsset },
          { title: 'Asset', path: PATH_DASHBOARD.admin.createAsset },
          { title: 'Asset Issues', path: PATH_DASHBOARD.timesheet.approveIssue }
        ]
      }
    ]
  },

  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'KPI-KRA Approval', path: PATH_DASHBOARD.timesheet.kpiKraManagerRating },
          { title: 'Timesheet Approval', path: PATH_DASHBOARD.timesheet.approval },
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Leave Approval', path: PATH_DASHBOARD.timesheet.leaveApproval },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime },
          // { title: 'Over Time Approval', path: PATH_DASHBOARD.timesheet.overTimeApproval },
          { title: 'settings', path: PATH_DASHBOARD.timesheet.settings },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
        ]
      }
    ]
  },
  // {
  //   subheader: 'WFH Request',
  //   items: [
  //     {
  //       title: 'WFH Request',
  //       path: PATH_DASHBOARD.travel.root,
  //       icon: <AssuredWorkloadOutlinedIcon sx={{ fontSize: 19 }} />,
  //       children: [
  //         {
  //           title: 'request',
  //           path: PATH_DASHBOARD.travel.reqWFH
  //         }
  //       ]
  //     }
  //   ]
  // },

  {
    subheader: 'CRM',
    items: [
      {
        title: 'CRM',
        path: PATH_DASHBOARD.crm.root,

        icon: <ManageAccountsSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'FollowUp Notifications', path: PATH_DASHBOARD.crm.FollowUpManager },
          { title: 'Master Screen', path: PATH_DASHBOARD.crm.MasterManager },
          { title: 'Lead Entry Screen', path: PATH_DASHBOARD.crm.LeadManager }
          // { title: 'Reports', path: PATH_DASHBOARD.crm.CrmReports }
          // { title: 'Bulk Upload', path: PATH_DASHBOARD.crm.BulkUploadcrm }
        ]
      }
    ]
  },

  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary }
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },

  // TASK DETAILS

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },

  {
    subheader: 'Project',
    items: [
      {
        title: 'project',
        path: PATH_DASHBOARD.project.root,
        icon: ICONS.analytics,
        children: [
          { title: 'project Creation', path: PATH_DASHBOARD.project.projectCreate },
          // { title: 'Upload Paysquare', path: PATH_DASHBOARD.project.uploadPaysquare },
          // { title: 'Upload Biometric', path: PATH_DASHBOARD.project.uploadBiometric },
          { title: 'Upload Details', path: PATH_DASHBOARD.project.uploadDashboard },
          { title: 'LOP Report', path: PATH_DASHBOARD.project.downloadReport }
        ]
      }
    ]
  },
  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  },

  // MANAGERS APP

  {
    subheader: 'managers',
    items: [{ title: 'Overview', path: PATH_DASHBOARD.managers.managersTaskList }]
  }
];

export const userSidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },
  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'Asset Details', path: PATH_DASHBOARD.timesheet.userDetails },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime }
        ]
      }
    ]
  },
  // {
  //   subheader: 'WFH Request',
  //   items: [
  //     {
  //       title: 'WFH Request',
  //       path: PATH_DASHBOARD.travel.root,
  //       icon: <AssuredWorkloadOutlinedIcon sx={{ fontSize: 19 }} />,
  //       children: [
  //         {
  //           title: 'request',
  //           path: PATH_DASHBOARD.travel.reqWFH
  //         },
  //         {
  //           title: 'eod entry',
  //           path: PATH_DASHBOARD.travel.eodStatus
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary }
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },
  // TASK DETAILS

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },
  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          // { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          // { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  }
];

export const pmoExcecutive = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },
  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'Asset Details', path: PATH_DASHBOARD.timesheet.userDetails },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime }
        ]
      }
    ]
  },
  // {
  //   subheader: 'WFH Request',
  //   items: [
  //     {
  //       title: 'WFH Request',
  //       path: PATH_DASHBOARD.travel.root,
  //       icon: <AssuredWorkloadOutlinedIcon sx={{ fontSize: 19 }} />,
  //       children: [
  //         {
  //           title: 'request',
  //           path: PATH_DASHBOARD.travel.reqWFH
  //         },
  //         {
  //           title: 'eod entry',
  //           path: PATH_DASHBOARD.travel.eodStatus
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary }
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },
  // TASK DETAILS

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },
  {
    subheader: 'Project',
    items: [
      {
        title: 'project',
        path: PATH_DASHBOARD.project.root,
        icon: ICONS.analytics,
        children: [
          { title: 'project Creation', path: PATH_DASHBOARD.project.projectCreate },
          // { title: 'Upload Paysquare', path: PATH_DASHBOARD.project.uploadPaysquare },
          // { title: 'Upload Biometric', path: PATH_DASHBOARD.project.uploadBiometric },
          { title: 'Upload Details', path: PATH_DASHBOARD.project.uploadDashboard },
          { title: 'LOP Report', path: PATH_DASHBOARD.project.downloadReport }
        ]
      }
    ]
  },
  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  }
];

// CRM Managers

export const managerCRMSidebar = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },
  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'Asset Details', path: PATH_DASHBOARD.timesheet.userDetails },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }

          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime }
        ]
      }
    ]
  },
  {
    subheader: 'CRM',
    items: [
      {
        title: 'CRM',
        path: PATH_DASHBOARD.crm.root,
        icon: <ManageAccountsSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'FollowUp Notifications', path: PATH_DASHBOARD.crm.FollowUpManager },
          { title: 'Master Screen', path: PATH_DASHBOARD.crm.MasterManager },
          { title: 'Lead Entry Screen', path: PATH_DASHBOARD.crm.LeadManager },
          { title: 'Reports', path: PATH_DASHBOARD.crm.CrmReports }
          // { title: 'Bulk Upload', path: PATH_DASHBOARD.crm.BulkUploadcrm }
        ]
      }
    ]
  },
  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary }
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },
  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          // { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          // { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  }
];

// CRM REP

export const userCRMSidebar = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },
  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'Asset Details', path: PATH_DASHBOARD.timesheet.userDetails },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime }
        ]
      }
    ]
  },
  {
    subheader: 'CRM',
    items: [
      {
        title: 'CRM',
        path: PATH_DASHBOARD.crm.root,
        icon: <ManageAccountsSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'FollowUp Notifications', path: PATH_DASHBOARD.crm.FollowUp },
          { title: 'Master Screen', path: PATH_DASHBOARD.crm.Master },
          { title: 'Lead Entry Screen', path: PATH_DASHBOARD.crm.LeadEntryScreen },
          { title: 'Reports', path: PATH_DASHBOARD.crm.CrmReports }
          // { title: 'Bulk Upload', path: PATH_DASHBOARD.crm.BulkUploadcrm }
        ]
      }
    ]
  },

  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary }
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },

  // Task Details

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },
  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          // { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          // { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  }
];

// Travel Request

export const travelRequest = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },
  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'Asset Details', path: PATH_DASHBOARD.timesheet.userDetails },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime }
        ]
      }
    ]
  },

  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary },
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },

  // Task Details

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },
  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          // { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          // { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  }
];

// //  Manager and CRM Rep

// export const ManagerRepSidebar = [
//   // GENERAL
//   // ----------------------------------------------------------------------
//   {
//     subheader: 'general',
//     items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
//   },

//   // USER MANAGEMENT
//   // ----------------------------------------------------------------------
//   {
//     subheader: 'administrator',
//     items: [
//       {
//         title: 'user management',
//         path: PATH_DASHBOARD.admin.root,
//         icon: ICONS.user,
//         children: [
//           { title: 'Users', path: PATH_DASHBOARD.admin.userManagement },
//           { title: 'Laptop Details', path: PATH_DASHBOARD.admin.userAsset },
//           { title: 'Asset', path: PATH_DASHBOARD.admin.createAsset },
//           { title: 'Asset Issues', path: PATH_DASHBOARD.timesheet.approveIssue }
//         ]
//       }
//     ]
//   },

//   // TIMESHEET MANAGEMENT
//   //-------------------------------------------------------------------------
//   {
//     subheader: 'timesheet',
//     items: [
//       {
//         title: 'timesheet',
//         path: PATH_DASHBOARD.timesheet.root,
//         icon: ICONS.user,
//         children: [
//           { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
//           { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
//           { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
//           { title: 'KPI-KRA Approval', path: PATH_DASHBOARD.timesheet.kpiKraManagerRating },
//           { title: 'Timesheet Approval', path: PATH_DASHBOARD.timesheet.approval },
//           // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
//           // { title: 'Leave Approval', path: PATH_DASHBOARD.timesheet.leaveApproval },
//           // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime },
//           // { title: 'Over Time Approval', path: PATH_DASHBOARD.timesheet.overTimeApproval },
//           { title: 'settings', path: PATH_DASHBOARD.timesheet.settings },
//           { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
//         ]
//       }
//     ]
//   },

//   {
//     subheader: 'CRM',
//     items: [
//       {
//         title: 'CRM',
//         path: PATH_DASHBOARD.crm.root,
//         icon: ICONS.user,
//         children: [
//           { title: 'Master Screen', path: PATH_DASHBOARD.crm.Master },
//           { title: 'Lead Entry Screen', path: PATH_DASHBOARD.crm.LeadEntryScreen }
//           // { title: 'Reports', path: PATH_DASHBOARD.crm.Report }
//         ]
//       }
//     ]
//   },

//   // TASK DETAILS

//   {
//     subheader: 'task details',
//     items: [
//       {
//         title: 'task details',
//         path: PATH_DASHBOARD.task.root,
//         icon: ICONS.user,
//         children: [
//           { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
//           // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
//         ]
//       }
//     ]
//   },

//   // MANAGERS APP

//   {
//     subheader: 'managers',
//     items: [{ title: 'Overview', path: PATH_DASHBOARD.managers.managersTaskList }]
//   }
// ];

//  Manager and CRM Rep

export const ManagerRepSidebar = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'dashboard', path: PATH_DASHBOARD.general.root, icon: ICONS.dashboard }]
  },

  // USER MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'administrator',
    items: [
      {
        title: 'user management',
        path: PATH_DASHBOARD.admin.root,
        icon: ICONS.user,
        children: [
          { title: 'Users', path: PATH_DASHBOARD.admin.userManagement },
          { title: 'Laptop Details', path: PATH_DASHBOARD.admin.userAsset },
          { title: 'Asset', path: PATH_DASHBOARD.admin.createAsset },
          { title: 'Asset Issues', path: PATH_DASHBOARD.timesheet.approveIssue }
        ]
      }
    ]
  },

  // TIMESHEET MANAGEMENT
  //-------------------------------------------------------------------------
  {
    subheader: 'timesheet',
    items: [
      {
        title: 'timesheet',
        path: PATH_DASHBOARD.timesheet.root,
        icon: <PersonAddAltIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'Entry', path: PATH_DASHBOARD.timesheet.timesheet },
          { title: 'Reports', path: PATH_DASHBOARD.timesheet.reports },
          { title: 'KPI-KRA', path: PATH_DASHBOARD.timesheet.kpiKraSelfRating },
          { title: 'KPI-KRA Approval', path: PATH_DASHBOARD.timesheet.kpiKraManagerRating },
          { title: 'Timesheet Approval', path: PATH_DASHBOARD.timesheet.approval },
          // { title: 'Leave', path: PATH_DASHBOARD.timesheet.leaveAndOvertimeApplication },
          // { title: 'Leave Approval', path: PATH_DASHBOARD.timesheet.leaveApproval },
          // { title: 'Over Time Entry', path: PATH_DASHBOARD.timesheet.overTime },
          // { title: 'Over Time Approval', path: PATH_DASHBOARD.timesheet.overTimeApproval },
          { title: 'settings', path: PATH_DASHBOARD.timesheet.settings },
          { title: 'Order Food', path: PATH_DASHBOARD.timesheet.orderFood }
        ]
      }
    ]
  },

  {
    subheader: 'CRM',
    items: [
      {
        title: 'CRM',
        path: PATH_DASHBOARD.crm.root,
        icon: <ManageAccountsSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'FollowUp Notifications', path: PATH_DASHBOARD.crm.FollowUp },
          { title: 'Master Screen', path: PATH_DASHBOARD.crm.Master },
          { title: 'Lead Entry Screen', path: PATH_DASHBOARD.crm.LeadEntryScreen },
          { title: 'Reports', path: PATH_DASHBOARD.crm.CrmReports }
          // { title: 'Bulk Upload', path: PATH_DASHBOARDs.crm.BulkUploadcrm }
        ]
      }
    ]
  },

  {
    subheader: 'travel request',
    items: [
      {
        title: 'travel request',
        path: PATH_DASHBOARD.travel.root,
        icon: <ConnectingAirportsOutlinedIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'request', path: PATH_DASHBOARD.travel.travelSummary }
          // { title: 'request approval', path: PATH_DASHBOARD.travel.reqApproval },
          // { title: 'request status', path: PATH_DASHBOARD.travel.reqStatus }
        ]
      }
    ]
  },

  // TASK DETAILS

  {
    subheader: 'task details',
    items: [
      {
        title: 'task details',
        path: PATH_DASHBOARD.task.root,
        icon: <AddTaskSharpIcon sx={{ fontSize: 19 }} />,
        children: [
          { title: 'tasklist', path: PATH_DASHBOARD.task.taskList }
          // { title: 'Task Create', path: PATH_DASHBOARD.task.taskCreate }
        ]
      }
    ]
  },

  {
    subheader: 'Project Review',
    items: [
      {
        title: 'Weekly Review',
        path: PATH_DASHBOARD.review.root,
        icon: <ReviewsIcon sx={{ fontSize: 19 }} />,
        children: [
          // { title: 'project sequence', path: PATH_DASHBOARD.review.projSequence },
          { title: 'Status Entry', path: PATH_DASHBOARD.review.findProject },
          // { title: 'fixed status', path: PATH_DASHBOARD.review.fixedStatus },
          // { title: 'status review', path: PATH_DASHBOARD.review.statusReview },
          // { title: 'support dashboard', path: PATH_DASHBOARD.review.supportDashboard },
          { title: 'Reports', path: PATH_DASHBOARD.review.reviewReports }
        ]
      }
    ]
  },

  // MANAGERS APP

  {
    subheader: 'managers',
    items: [{ title: 'Overview', path: PATH_DASHBOARD.managers.managersTaskList }]
  }
];
