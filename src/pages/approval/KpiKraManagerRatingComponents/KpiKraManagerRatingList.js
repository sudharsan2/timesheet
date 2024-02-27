import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';

import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useDispatch } from 'react-redux';
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';
import { setKpiKraList } from '../../../redux/slices/kpiKraSlice';

KpiKraManagerRatingList.propTypes = {
  rows: PropTypes.array.isRequired,
  isLoading: PropTypes.bool
};

export default function KpiKraManagerRatingList({ rows, isLoading }) {
  const title = 'KPI-KRA Manager Approval List';
  const _rowById = rows.map((_x, i) => ({ ..._x, id: i + 1 }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columns = [
    {
      field: '',
      headerName: 'Detailed View',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" aria-label="edit group" onClick={() => handleView(params.row)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </>
      )
    },
    {
      field: 'date',
      headerName: 'Month & Year',
      width: 150,
      editable: false
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false
    },
    {
      field: 'employeeId',
      headerName: 'Employee Id',
      width: 150,
      editable: false
    },
    {
      field: 'designation',
      headerName: 'User Designation',
      width: 150,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      editable: false
    }
  ];

  const handleView = (values) => {
    const payload = {
      ...values.usersKpiAndKra,
      username: values.name,
      employeeId: values.employeeId,
      designation: values.designation
    };

    dispatch(setKpiKraList(payload));
    navigate(`${PATH_DASHBOARD.timesheet.kpiKraUserRatingList}/${payload.id}`);
  };

  return (
    <Page title={title}>
      <Card>
        <CardContent>
          <div style={{ height: 350, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  rows={_rowById}
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
