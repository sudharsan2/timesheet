import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardHeader from '@mui/material/CardHeader';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { deleteKpiKraActionAsync, multipleKpiKraDeleteActionAsync } from '../../../redux/slices/timesheetSettingsSlice';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

KpiKraMasterList.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function KpiKraMasterList({ rows, isLoading }) {
  const title = 'KPI-KRA Master List';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectionModel, setSelectionModel] = React.useState([]);

  const columns = [
    {
      field: 'name',
      headerName: 'KPI',
      width: 200,
      editable: false
    },
    {
      field: 'description',
      headerName: 'KPI description',
      width: 300,
      editable: false
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 200,
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
          <IconButton color="primary" aria-label="delete group" onClick={() => handleOnGroupDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  const handleEdit = (values) => {
    navigate(`${PATH_DASHBOARD.timesheet.kpiKraMasterEdit}/${values.id}`);
  };

  const handleOnGroupDelete = (values) => {
    dispatch(deleteKpiKraActionAsync(values.id));
  };

  const handleMultipleDelete = () => {
    const payload = {
      ids: selectionModel
    };
    dispatch(multipleKpiKraDeleteActionAsync(payload));
  };

  return (
    <Page title={title}>
      <Card>
        {selectionModel.length > 0 && (
          <CardHeader
            action={
              <IconButton onClick={handleMultipleDelete} color="primary">
                <Icon icon={trash2Fill} />
              </IconButton>
            }
          />
        )}
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
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                  }}
                  selectionModel={selectionModel}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
