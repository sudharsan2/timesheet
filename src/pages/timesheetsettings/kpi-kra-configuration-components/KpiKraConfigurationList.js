import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CardHeader from '@mui/material/CardHeader';
import { Stack, TextField, Button } from '@mui/material';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import Page from '../../../components/Page';
import {
  updateGroupActionAsync,
  deleteGroupActionAsync,
  multipleGroupDeleteActionAsync,
  getkkmasterDetailsFromTimesheetSettings
} from '../../../redux/slices/timesheetSettingsSlice';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

KpiKraConfigurationList.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function KpiKraConfigurationList({ rows, isLoading }) {
  const title = 'KPI-KRA Configuration List';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [openEdit, setEditOpen] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const KkMaster = useSelector(getkkmasterDetailsFromTimesheetSettings);

  console.log('ajay', KkMaster);

  const columns = [
    {
      field: 'name',
      headerName: 'Group name',
      width: 250,
      editable: false
    },
    {
      field: 'description',
      headerName: 'Group description',
      width: 300,
      editable: false
    },
    {
      field: 'kpiAndKra',
      headerName: 'Kpi-Kra',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <FormControl fullWidth>
          <Select
            id="Kpi-Kra-Master-multiple-checkbox-1"
            size="small"
            multiple
            displayEmpty
            value={params.row.kpiAndKra}
            onChange={(e) => e.preventDefault()}
            renderValue={(selected) => selected.map((_x) => _x && _x.name).join(', ')}
            MenuProps={MenuProps}
          >
            {KkMaster.map((_x, i) => (
              <MenuItem key={i} value={_x}>
                <Checkbox
                  checked={params.row.kpiAndKra && params.row.kpiAndKra.map((_x) => _x.id).indexOf(_x.id) > -1}
                />
                <ListItemText primary={`(${_x.rating})${_x.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
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

  const EditGroupSchema = Yup.object().shape({
    name: Yup.string().required('Group Name is required'),
    description: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      description: '',
      kpiIds: []
    },
    validationSchema: EditGroupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        dispatch(updateGroupActionAsync({ ...values, kpiIds: values.kpiIds.map((_x) => _x.id) }));
        resetForm();
        setSubmitting(false);
        handleEditClose();
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleEditOpen = (values) => {
    console.log('🚀 => values', values);
    if (values) {
      setFieldValue('id', values.id);
      setFieldValue('name', values.name);
      setFieldValue('description', values.description);
      setFieldValue('kpiIds', values.kpiAndKra);
      setEditOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleOnGroupDelete = (values) => {
    dispatch(deleteGroupActionAsync(values.id));
  };

  const handleMultipleDelete = () => {
    const payload = {
      ids: selectionModel
    };
    dispatch(multipleGroupDeleteActionAsync(payload));
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
      <Dialog fullWidth open={openEdit} onClose={handleEditClose} aria-labelledby="edit-group">
        <DialogTitle id="edit-group">Edit group</DialogTitle>
        <DialogContent dividers>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Group Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={5}
                  label="Description"
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
                <FormControl fullWidth>
                  <InputLabel id="Kpi-Kra-Master-Id">Kpi-Kra Master</InputLabel>
                  <Select
                    labelId="Kpi-Kra-Master-Id"
                    id="Kpi-Kra-Master-multiple-checkbox"
                    multiple
                    {...getFieldProps('kpiIds')}
                    input={<OutlinedInput label="Kpi-Kra Master" />}
                    renderValue={(selected) => selected.map((_x) => _x && _x.name).join(', ')}
                    MenuProps={MenuProps}
                  >
                    {KkMaster.map((_x, i) => (
                      <MenuItem key={i} value={_x}>
                        <Checkbox checked={values.kpiIds && values.kpiIds.map((_x) => _x.id).indexOf(_x.id) > -1} />
                        <ListItemText primary={`(${_x.rating})${_x.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <DialogActions>
                <Button onClick={handleEditClose}>Cancel</Button>
                <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save
                </LoadingButton>
              </DialogActions>
            </Form>
          </FormikProvider>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
