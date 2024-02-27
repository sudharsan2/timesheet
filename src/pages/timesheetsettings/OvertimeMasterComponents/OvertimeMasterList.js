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
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import Page from '../../../components/Page';
import { multipleKpiKraDeleteActionAsync } from '../../../redux/slices/timesheetSettingsSlice';
import { deleteCountryAction, getListOfCountries } from '../../../redux/slices/overTimeMasterSlice';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

OvertimeMasterList.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  handleEditOpen: PropTypes.func
};

export default function OvertimeMasterList({ rows, isLoading, handleEditOpen }) {
  const title = 'Overtime Master List';

  const dispatch = useDispatch();

  const [selectionModel, setSelectionModel] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const columns = [
    {
      field: 'country_id',
      headerName: 'Country Id',
      width: 200,
      hide: true,
      editable: false
    },
    {
      field: 'countryname',
      headerName: 'Country Name',
      width: 200,
      editable: false
    },
    {
      field: 'countrycode',
      headerName: 'Country Code',
      width: 150,
      editable: false
    },
    {
      field: 'total_working',
      headerName: 'Total working hours in a month',
      width: 250,
      align: 'center',
      editable: false
    },
    {
      field: 'overtime_hours',
      headerName: 'Total OT hours applicable',
      width: 200,
      align: 'center',
      editable: false
    },
    {
      field: 'applied_before',
      headerName: 'Apply before (in Days)',
      width: 180,
      align: 'center',
      editable: false
    },
    {
      field: '',
      headerName: 'Actions',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" aria-label="edit group" onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="primary" aria-label="delete group" onClick={() => handleOnGroupDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  // const handleEdit = (values) => {
  //   navigate(`${PATH_DASHBOARD.timesheet.kpiKraMasterEdit}/${values.id}`);
  // };

  const handleOnGroupDelete = async (values) => {
    // dispatch(deleteKpiKraActionAsync(values.id));
    console.log(values);
    await dispatch(deleteCountryAction(values.country_id));
    await dispatch(getListOfCountries());
    enqueueSnackbar('Deleted successfully', { variant: 'success' });
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
                  getRowId={(row) => row.country_id}
                  rows={rows}
                  columns={columns}
                  rowsPerPageOptions={[5, 25, 100]}
                  loading={isLoading}
                  components={{
                    LoadingOverlay: CustomLoadingOverlay
                  }}
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
