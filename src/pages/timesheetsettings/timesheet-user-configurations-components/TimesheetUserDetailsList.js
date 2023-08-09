import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

TimesheetUserDetailsList.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function TimesheetUserDetailsList({ rows, isLoading }) {
  const title = 'Timesheet User Configurations List';

  const navigate = useNavigate();

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false
    },
    {
      field: 'employeeId',
      headerName: 'Employee Id',
      width: 300,
      editable: false
    },
    {
      field: 'roleDescription',
      headerName: 'User Role',
      width: 300,
      editable: false
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 200,
      editable: false
    },
    {
      field: 'reporting_manager',
      headerName: 'Reporting Manager',
      width: 200,
      editable: false
    },
    {
      field: 'kpiAndKraGroup',
      headerName: 'KPI-KRA Group Name',
      width: 300,
      editable: false
    },
    {
      field: '',
      headerName: 'Actions',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" aria-label="edit group" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
        </>
      )
    }
  ];

  const handleEdit = (values) => {
    navigate(`${PATH_DASHBOARD.timesheet.timesheetUserConfigurationsUpdate}/${values.id}`);
  };

  return (
    <Page title={title}>
      <Card>
        <CardContent>
          <div style={{ height: 350, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  rowsPerPageOptions={[5, 25, 100]}
                  loading={isLoading}
                  components={{
                    LoadingOverlay: CustomLoadingOverlay
                  }}
                  disableSelectionOnClick
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
