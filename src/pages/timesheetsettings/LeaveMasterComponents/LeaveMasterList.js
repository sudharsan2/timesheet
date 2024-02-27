import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../components/Page';
import {
  createNewPolicyActionAsync,
  getAllCountriesAsync,
  getCoutriesFromLeaveMaster
} from '../../../redux/slices/leaveSlice';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

LeaveMasterList.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function LeaveMasterList({ rows, isLoading }) {
  const title = 'Leave Master List';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const countries = useSelector(getCoutriesFromLeaveMaster);
  const NewLeaveSchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required').min(3).max(55, 'Keep it short'),
    description: Yup.string(),
    country: Yup.object({
      country_code: Yup.string(),
      country_id: Yup.number(),
      country_name: Yup.string()
    }).required(),
    total_leave: Yup.number().required().max(366),
    is_doc_required: Yup.bool(),
    is_remarks_required: Yup.bool(),
    can_apply_continously: Yup.bool(),
    is_active: Yup.bool()
  });
  const formik = useFormik({
    initialValues: {
      category_name: '',
      description: '',
      country: '',
      total_leave: 0,
      is_doc_required: false,
      is_remarks_required: false,
      can_apply_continously: false,
      is_active: false
    },
    validationSchema: NewLeaveSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          leave_master_id: values.leave_master_id,
          category_name: values.category_name,
          description: values.description,
          country_name: values.country.country_name,
          country_code: values.country.country_code,
          total_leave: values.total_leave,
          is_doc_required: values.is_doc_required ? 'Y' : 'N',
          is_remarks_required: values.is_remarks_required ? 'Y' : 'N',
          can_apply_continously: values.can_apply_continously ? 'Y' : 'N',
          is_active: values.is_active ? 'Y' : 'N'
        };
        console.log('🚀 => payload', payload);
        dispatch(createNewPolicyActionAsync(payload));
        resetForm();
        setSubmitting(false);
        handleClose();
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: 'category_name',
      headerName: 'Category Name',
      width: 200,
      editable: false
    },
    {
      field: 'description',
      headerName: 'Category Description',
      width: 200,
      editable: false
    },
    {
      field: 'country_name',
      headerName: 'Country Name',
      width: 150,
      editable: false
    },
    {
      field: 'country_code',
      headerName: 'Country Code',
      width: 150,
      editable: false
    },
    {
      field: 'total_leave',
      headerName: 'Total Days',
      width: 130,
      editable: false,
      type: 'number'
    },
    {
      field: 'is_doc_required',
      headerName: 'Is Document Required',
      width: 200,
      editable: false
    },
    {
      field: 'is_remarks_required',
      headerName: 'Is Remarks Required',
      width: 200,
      editable: false
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 130,
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
    const contri = countries.find((_x) => _x.country_code === values.country_code);
    setFieldValue('category_name', values.category_name);
    setFieldValue('leave_master_id', values.leave_master_id);
    setFieldValue('description', values.description);
    setFieldValue('country', contri);
    setFieldValue('country_code', values.country_code);
    setFieldValue('total_leave', values.total_leave);
    setFieldValue('is_doc_required', values.is_doc_required === 'Y');
    setFieldValue('is_remarks_required', values.is_remarks_required === 'Y');
    setFieldValue('can_apply_continously', values.can_apply_continously === 'Y');
    setFieldValue('is_active', values.is_active === 'Y');
    setOpen(true);
  };

  React.useEffect(() => {
    dispatch(getAllCountriesAsync());
  }, [dispatch]);

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
                  getRowId={(_x) => _x.leave_master_id}
                  checkboxSelection={false}
                  disableSelectionOnClick
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="add-new-group">
        <DialogTitle id="add-new-group">Edit leave policy</DialogTitle>
        <DialogContent dividers>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Category Name"
                  {...getFieldProps('category_name')}
                  error={Boolean(touched.category_name && errors.category_name)}
                  helperText={touched.category_name && errors.category_name}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Category Description"
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="country-select-label">Country</InputLabel>
                  <Select
                    labelId="country-select-label"
                    id="country-select"
                    label="country"
                    {...getFieldProps('country')}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {countries.map((_x, i) => (
                      <MenuItem key={i} value={_x}>
                        {_x.country_name} ( {_x.country_code} )
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Total number of days"
                  {...getFieldProps('total_leave')}
                  error={Boolean(touched.total_leave && errors.total_leave)}
                  helperText={touched.total_leave && errors.total_leave}
                />
                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      {...getFieldProps('is_doc_required')}
                      control={<Switch checked={values.is_doc_required} />}
                      label="Document"
                    />
                    <FormControlLabel
                      {...getFieldProps('is_remarks_required')}
                      control={<Switch checked={values.is_remarks_required} />}
                      label="Remarks"
                    />
                    <FormControlLabel
                      {...getFieldProps('can_apply_continously')}
                      control={<Switch checked={values.can_apply_continously} />}
                      label="Can applied continuously"
                    />
                    <FormControlLabel
                      {...getFieldProps('is_active')}
                      control={<Switch checked={values.is_active} />}
                      label="Active"
                    />
                  </FormGroup>
                </FormControl>
              </Stack>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting || isLoading}
                >
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
