import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import Page from '../../../components/Page';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// import { deleteKpiKraActionAsync, multipleKpiKraDeleteActionAsync } from '../../../redux/slices/timesheetSettingsSlice';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

ProjectMasterList.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function ProjectMasterList({ rows, isLoading }) {
  const title = 'Project Master List';

  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [selectionModel, setSelectionModel] = React.useState([]);

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      width: 200,
      editable: false
    },
    // {
    //   field: 'projectName',
    //   headerName: 'Segment',
    //   width: 300,
    //   editable: false
    // },
    {
      field: 'projectName',
      headerName: 'Project Name',
      width: 200,
      editable: false
    }
    // {
    //   field: '',
    //   headerName: 'Actions',
    //   width: 300,
    //   editable: false,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton color="primary" aria-label="edit group" onClick={() => handleEdit(params.row)}>
    //         <EditIcon />
    //       </IconButton>
    //       <IconButton color="primary" aria-label="delete group" onClick={() => handleOnGroupDelete(params.row)}>
    //         <DeleteIcon />
    //       </IconButton>
    //     </>
    //   )
    // }
  ];

  // const handleEdit = (values) => {
  //   navigate(`${PATH_DASHBOARD.timesheet.projectMasterEdit}/${values.id}`);
  // };

  // const handleOnGroupDelete = (values) => {
  //   dispatch(deleteKpiKraActionAsync(values.id));
  // };

  // const handleMultipleDelete = () => {
  //   const payload = {
  //     ids: selectionModel
  //   };
  //   dispatch(multipleKpiKraDeleteActionAsync(payload));
  // };

  return (
    <Page title={title}>
      <Card>
        {/* {selectionModel.length > 0 && (
          <CardHeader
            action={
              <IconButton onClick={handleMultipleDelete} color="primary">
                <Icon icon={trash2Fill} />
              </IconButton>
            }
          />
        )} */}
        <CardContent>
          <div style={{ height: 350, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  rows={rows}
                  getRowId={(row) => row.id}
                  columns={columns}
                  rowsPerPageOptions={[5, 25, 100]}
                  loading={isLoading}
                  components={{
                    LoadingOverlay: CustomLoadingOverlay
                  }}
                  //   checkboxSelection
                  disableSelectionOnClick
                  //   onSelectionModelChange={(newSelectionModel) => {
                  //     setSelectionModel(newSelectionModel);
                  //   }}
                  //   selectionModel={selectionModel}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
