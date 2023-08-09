import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, Button, Card, CardContent, Chip, IconButton } from '@mui/material';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';
import TaskCreate from '../TaskCreate';
import TaskEdit from '../TaskEdit.js';
import TaskPreview from '../TaskPreview';

export default function TaskList() {
  const title = 'Overview';
  const { themeStretch } = useSettings();
  const isLoading = false;
  const [isNewRowEnabled, setNewRow] = React.useState(false);
  const [isEditEnabled, setEditRow] = React.useState(false);
  const [isViewOpen, setView] = React.useState(false);
  const drawerWidth = 350;
  const rows = [
    {
      id: 1,
      manager_name: 'Thangamani K',
      manager_id: 'M1003',
      project_name: 'LMW',
      start_date: new Date(),
      end_date: new Date(),
      work_load_status: 'High',
      epic: 'LMW SCM Implementation',
      last_comments: 'Communicated with team regarding task change. Attached all the docs'
    }
  ];

  const columns = [
    {
      field: 'manager_name',
      headerName: 'Manager Name',
      width: 200,
      editable: false,
      renderCell: (params) => `${params.row.manager_name}(${params.row.manager_id})`
    },
    {
      field: 'project_name',
      headerName: 'Project Name',
      width: 200,
      editable: false
    },
    {
      field: 'epic',
      headerName: 'EPIC',
      width: 300,
      editable: false
    },
    {
      field: 'work_load_status',
      headerName: 'Work Load',
      width: 150,
      editable: false,
      renderCell: (params) => <Chip size="small" label={params.row.work_load_status} color="primary" />
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 250,
      editable: false
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 250,
      editable: false
    },
    {
      field: 'last_comments',
      headerName: 'Last Comment',
      width: 250,
      editable: false
    },
    {
      field: '',
      headerName: 'Actions',
      width: 200,
      editable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" aria-label="view group" onClick={() => handlePreview(params.row)}>
            <VisibilityIcon />
          </IconButton>
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

  const handleEdit = (row) => {
    console.log('🚀 => row', row);
    setEditRow(true);
  };

  const handleOnGroupDelete = (row) => {
    console.log('🚀 => row', row);
  };

  const handlePreview = (row) => {
    setView(true);
  };

  const handleAddNewRow = () => {};
  const handleEditSave = () => {};

  return (
    <div>
      <Page title={title}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={title}
            links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Overview' }]}
            action={
              <Button variant="contained" startIcon={<Icon icon={plusFill} />} onClick={() => setNewRow(true)}>
                Create
              </Button>
            }
          />

          <Card>
            <CardContent>
              <div style={{ height: 350, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      rows={rows}
                      //   getRowId={(row) => row.id}
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
        </Container>
        <TaskCreate
          isNewRowEnabled={isNewRowEnabled}
          setNewRow={setNewRow}
          drawerWidth={drawerWidth}
          handleAddNewRow={handleAddNewRow}
          isLoading={isLoading}
          managers={[]}
          statuses={[]}
          projects={[]}
        />
        <TaskEdit
          isEditEnabled={isEditEnabled}
          setEditRow={setEditRow}
          drawerWidth={drawerWidth}
          handleEditSave={handleEditSave}
          isLoading={isLoading}
          managers={[]}
          statuses={[]}
          projects={[]}
        />
        <TaskPreview isViewOpen={isViewOpen} setView={setView} />
      </Page>
    </div>
  );
}
