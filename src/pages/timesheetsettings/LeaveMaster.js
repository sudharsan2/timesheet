import React from 'react';
import {
  Container,
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import LeaveMasterList from './LeaveMasterComponents/LeaveMasterList';
import {
  createNewPolicyActionAsync,
  getAllCountriesAsync,
  getCoutriesFromLeaveMaster,
  getleavePoliciesListFromLeaveMaster,
  getIsLoadingFromLeaveMaster,
  getAllLeavePolicyMasterAsync
} from '../../redux/slices/leaveSlice';

export default function LeaveMaster() {
  const { themeStretch } = useSettings();
  const title = 'Leave Master';
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const countries = useSelector(getCoutriesFromLeaveMaster);
  const rows = useSelector(getleavePoliciesListFromLeaveMaster);
  const isLoading = useSelector(getIsLoadingFromLeaveMaster);

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
        console.log('🚀 => values', values);
        const payload = {
          category_name: values.category_name,
          description: values.description,
          country_name: values.country.countryname,
          country_code: values.country.countrycode,
          total_leave: values.total_leave,
          is_doc_required: values.is_doc_required ? 'Y' : 'N',
          is_remarks_required: values.is_remarks_required ? 'Y' : 'N',
          can_apply_continously: values.can_apply_continously ? 'Y' : 'N',
          is_active: values.is_active ? 'Y' : 'N'
        };
        dispatch(createNewPolicyActionAsync(payload));
        resetForm();
        setSubmitting(false);
        handleClose();
        enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    dispatch(getAllCountriesAsync());
    dispatch(getAllLeavePolicyMasterAsync());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Settings', href: PATH_DASHBOARD.timesheet.settings },
            { name: 'Leave Master' }
          ]}
          action={
            <Button variant="contained" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
              New policy
            </Button>
          }
        />
        <LeaveMasterList rows={rows} isLoading={isLoading} />
        <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="add-new-group">
          <DialogTitle id="add-new-group">Add new leave policy</DialogTitle>
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
                          {_x.countryname} ( {_x.countrycode} )
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
                      <FormControlLabel {...getFieldProps('is_doc_required')} control={<Switch />} label="Document" />
                      <FormControlLabel
                        {...getFieldProps('is_remarks_required')}
                        control={<Switch />}
                        label="Remarks"
                      />
                      <FormControlLabel
                        {...getFieldProps('can_apply_continously')}
                        control={<Switch />}
                        label="Can applied continuously"
                      />
                      <FormControlLabel {...getFieldProps('is_active')} control={<Switch />} label="Active" />
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
      </Container>
    </Page>
  );
}
