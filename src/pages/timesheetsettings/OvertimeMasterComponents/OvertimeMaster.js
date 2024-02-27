import React from 'react';
import { Container, Button, Stack, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { Icon } from '@iconify/react';
import {
  getCountryListFromOTMaster,
  getListOfCountries,
  createCountryAction
} from '../../../redux/slices/overTimeMasterSlice';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';
import OvertimeMasterList from './OvertimeMasterList';
// eslint-disable-next-line import/no-named-as-default
import OvertimeMasterEdit from './OvertimeMasterEdit';

export default function OvertimeMaster() {
  const { themeStretch } = useSettings();
  const title = 'Overtime Master';
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editData, setEditData] = React.useState('');
  const rows = useSelector(getCountryListFromOTMaster);
  const dispatch = useDispatch();

  const NewOvertimeSchema = Yup.object().shape({
    countryname: Yup.string().required('Country Name is required'),
    countrycode: Yup.string().required('Country Code is required'),
    totalworking: Yup.string().required('Total Working in a Month is required'),
    totalOthoursallowed: Yup.string().required('Total OverTime Working hours is allowed'),
    applybefore: Yup.string().required('Applied Before is required'),
    description: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      countryname: '',
      countrycode: '',
      totalworking: '',
      totalOthoursallowed: '',
      applybefore: '',
      description: ''
    },
    validationSchema: NewOvertimeSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('🚀 => values', values);
        const payload = {
          countryname: values.countryname,
          countrycode: values.countrycode,
          total_working: values.totalworking,
          overtime_hours: values.totalOthoursallowed,
          applied_before: values.applybefore,
          description: values.description
        };
        console.log('🚀 => payload', payload);
        await dispatch(createCountryAction(payload));
        await dispatch(getListOfCountries());
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

  //   const isLoading = useSelector();
  //   const rows = useSelector();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleEditOpen = (e) => {
    console.log(e);
    setEditData(e);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    console.log('last');
    setEditOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    dispatch(getListOfCountries());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Settings', href: PATH_DASHBOARD.timesheet.settings },
            { name: 'Overtime Master' }
          ]}
          action={
            <Button variant="contained" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
              New policy
            </Button>
          }
        />
        <OvertimeMasterList rows={rows} isLoading={false} handleEditOpen={handleEditOpen} />

        <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="add-new-group">
          <DialogTitle id="add-new-group">Add new overtime policy</DialogTitle>
          <DialogContent dividers>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Country Name"
                    {...getFieldProps('countryname')}
                    error={Boolean(touched.countryname && errors.countryname)}
                    helperText={touched.countryname && errors.countryname}
                  />
                  <TextField
                    fullWidth
                    label="Country Code"
                    {...getFieldProps('countrycode')}
                    error={Boolean(touched.countrycode && errors.countrycode)}
                    helperText={touched.countrycode && errors.countrycode}
                  />
                  <TextField
                    fullWidth
                    label="Total Working in a month"
                    {...getFieldProps('totalworking')}
                    error={Boolean(touched.totalworking && errors.totalworking)}
                    helperText={touched.totalworking && errors.totalworking}
                  />
                  <TextField
                    fullWidth
                    label="Total overtime Working hours allowed (in hrs per month)"
                    {...getFieldProps('totalOthoursallowed')}
                    error={Boolean(touched.totalOthoursallowed && errors.totalOthoursallowed)}
                    helperText={touched.totalOthoursallowed && errors.totalOthoursallowed}
                  />
                  <TextField
                    fullWidth
                    label="Has to be applied before (in days)"
                    {...getFieldProps('applybefore')}
                    error={Boolean(touched.applybefore && errors.applybefore)}
                    helperText={touched.applybefore && errors.applybefore}
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
                </Stack>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                    Save
                  </LoadingButton>
                </DialogActions>
              </Form>
            </FormikProvider>
          </DialogContent>
        </Dialog>
        <Dialog fullWidth open={editOpen} onClose={handleClose} aria-labelledby="add-new-group">
          <DialogTitle id="add-new-group">Edit new overtime policy</DialogTitle>
          <DialogContent dividers>
            <OvertimeMasterEdit handleEditClose={handleEditClose} editData={editData} />
          </DialogContent>
        </Dialog>
      </Container>
    </Page>
  );
}
