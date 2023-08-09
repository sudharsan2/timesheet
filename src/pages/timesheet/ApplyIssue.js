import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
// material
import {
  TextField,
  Stack,
  Card,
  Grid,
  FormControl,
  Select,
  Box,
  MenuItem,
  InputLabel,
  CardContent,
  CardHeader,
  Button,
  Container,
  FormHelperText,
  IconButton,
  Autocomplete
} from '@mui/material';
import { values } from 'lodash';
// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  getIsLoadingFromUser,
  applyIssueAssetAsync,
  getDateFromTS,
  getAsset1FromTS,
  getApplyIssueFromTs,
  getListOfIssueAsync,
  getListOfIssue
} from '../../redux/slices/assetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
// import { values } from 'lodash';

export default function ApplyIssue(value) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const applyId = useSelector(getAsset1FromTS);
  // console.log('Asset Id is', assetId);
  const applyData = useSelector(getApplyIssueFromTs);
  const date = useSelector(getDateFromTS);
  const { themeStretch } = useSettings();
  const title = 'Apply Issue';
  const isLoading = useSelector(getIsLoadingFromUser);
  const { users } = useSelector((state) => state.asset);
  const { assets } = useSelector((state) => state.asset);
  // const { asset } = useSelector((state) => state.asset);
  // console.log('List of Names', users);
  const [buttonState, setButtonState] = React.useState('Save');

  const [items, setItems] = useState([]);
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  const handleInputChange = (value) => {
    setValue(value);
  };

  const [selectedDesignation, setSelectedDesignation] = useState({ designation: values.designation } || null);

  const assetDetails = users.find((_x) => _x.asset_id);
  console.log('asset details', assetDetails);

  const NewUserSchema = Yup.object().shape({
    // asset_id: Yup.string().required('Asset Id No is required'),
    empName: Yup.string().required('Emp Name is required'),
    asset_serial_no: Yup.string().required('Asset Serial Number is required'),
    battery_serial_no: Yup.string().required('Battery Serial No is required'),
    empId: Yup.string().required('Employee Id is required'),
    product_id: Yup.string().required('Product ID is required'),
    make: Yup.string().required('Make Name is required'),
    os_version: Yup.string().required('Os Version is required'),
    os_key: Yup.string().required('Os Key is required'),
    os_type: Yup.string().required('Os Type is required'),
    ram: Yup.string().required('RAM is required'),
    display_size: Yup.string().required('Display Size is required'),
    storage: Yup.string().required('Storage is required'),
    problem: Yup.string().required('problem is required'),
    conditions: Yup.string().required('Conditions is required'), // reason: Yup.string().required('Reason is required'),
    description: Yup.string().required('Description is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      asset_id: assetDetails.asset_id || '',
      empName: assetDetails.empName || '',
      empId: assetDetails.empId || '',
      make: assetDetails.make || '',
      model: assetDetails.model || '',
      asset_serial_no: assetDetails.asset_serial_no || '',
      battery_serial_no: assetDetails.battery_serial_no || '',
      product_id: assetDetails.product_id || '',
      os_version: assetDetails.os_version || '',
      os_key: assetDetails.os_key || '',
      os_type: assetDetails.os_type || '',
      ram: assetDetails.ram || '',
      display_size: assetDetails.display_size || '',
      storage: assetDetails.storage || '',
      problem: assetDetails.problem || 'Nil',
      conditions: assetDetails.conditions || ''
      // reason: userDetails.reason || '',
      // description: userDetails.description || ''
    },
    validationSchema: NewUserSchema,

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          asset_id: values.asset_id,
          empName: values.empName,
          empId: values.empId,
          make: values.make,
          model: values.model,
          asset_serial_no: values.asset_serial_no,
          battery_serial_no: values.battery_serial_no,
          product_id: values.product_id,
          os_version: values.os_version,
          os_key: values.os_key,
          os_type: values.os_type,
          ram: values.ram,
          display_size: values.display_size,
          storage: values.storage,
          problem: values.problem,
          conditions: values.conditions,
          reason: values.reason,
          description: values.description
        };
        await dispatch(applyIssueAssetAsync(payload));
        // await dispatch(getAllManagersActionAsync());
        // resetForm();
        // setFieldValue('is_bulk_upload', false);
        // setFieldValue('designation', '');
        // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
        setSubmitting(false);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(true);
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, submitForm, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleSubmission = (state) => {
    setButtonState(state);
    submitForm();
  };

  useEffect(() => {
    dispatch(getListOfIssueAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setFieldValue]);

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Asset Details', href: PATH_DASHBOARD.timesheet.userDetails },
            { name: 'Apply' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={10}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Asset Id"
                        disabled
                        // userDetails={assetId}
                        {...getFieldProps('asset_id')}
                        error={Boolean(touched.asset_id && errors.asset_id)}
                        helperText={touched.asset_id && errors.asset_id}
                      />
                      <TextField
                        fullWidth
                        label="emp Name"
                        disabled
                        {...getFieldProps('empName')}
                        error={Boolean(touched.empName && errors.empName)}
                        helperText={touched.empName && errors.empName}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 1 }}>
                      <TextField
                        fullWidth
                        label="emp Id"
                        disabled
                        {...getFieldProps('empId')}
                        error={Boolean(touched.empId && errors.empId)}
                        helperText={touched.empId && errors.empId}
                      />
                      <TextField
                        fullWidth
                        label="Make"
                        disabled
                        {...getFieldProps('make')}
                        error={Boolean(touched.make && errors.make)}
                        helperText={touched.make && errors.make}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Model"
                        disabled
                        {...getFieldProps('model')}
                        error={Boolean(touched.model && errors.model)}
                        helperText={touched.model && errors.model}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Asset Serial No"
                        {...getFieldProps('asset_serial_no')}
                        error={Boolean(touched.asset_serial_no && errors.asset_serial_no)}
                        helperText={touched.asset_serial_no && errors.asset_serial_no}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="Battery Serial No"
                        {...getFieldProps('battery_serial_no')}
                        error={Boolean(touched.battery_serial_no && errors.battery_serial_no)}
                        helperText={touched.battery_serial_no && errors.battery_serial_no}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Product ID"
                        {...getFieldProps('product_id')}
                        error={Boolean(touched.product_id && errors.product_id)}
                        helperText={touched.product_id && errors.product_id}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="Os Version"
                        {...getFieldProps('os_version')}
                        error={Boolean(touched.os_version && errors.os_version)}
                        helperText={touched.os_version && errors.os_version}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Os Key"
                        {...getFieldProps('os_key')}
                        error={Boolean(touched.os_key && errors.os_key)}
                        helperText={touched.os_key && errors.os_key}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Os Type"
                        {...getFieldProps('os_type')}
                        error={Boolean(touched.os_type && errors.os_type)}
                        helperText={touched.os_type && errors.os_type}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="RAM"
                        {...getFieldProps('ram')}
                        error={Boolean(touched.ram && errors.ram)}
                        helperText={touched.ram && errors.ram}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Display Size"
                        {...getFieldProps('display_size')}
                        error={Boolean(touched.display_size && errors.display_size)}
                        helperText={touched.display_size && errors.display_size}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Storage"
                        {...getFieldProps('storage')}
                        error={Boolean(touched.storage && errors.storage)}
                        helperText={touched.storage && errors.storage}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="Problem"
                        {...getFieldProps('problem')}
                        error={Boolean(touched.problem && errors.problem)}
                        helperText={touched.problem && errors.problem}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="Conditions"
                        {...getFieldProps('conditions')}
                        error={Boolean(touched.conditions && errors.conditions)}
                        helperText={touched.conditions && errors.conditions}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 1 }}>
                      {/* <FormControl fullWidth error={Boolean(touched.reason && errors.reason)}>
                        <Autocomplete
                          disablePortal
                          id="reson-id"
                          options={users}
                          onChange={(_, newValue) => setValue(newValue)}
                          getOptionLabel={(option) => option.value || ''}
                          // getOptionSelected={(option, value) => option === value}
                          // style={{ margin: 0 }}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          fullWidth
                          renderInput={(params) => <TextField {...params} label="Reason" />}
                        />
                      </FormControl> */}
                      <FormControl fullWidth error={Boolean(touched.designation && errors.designation)}>
                        <Autocomplete
                          id="reason-id"
                          value={selectedDesignation || null}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedDesignation(newValue);
                              setFieldValue('reason', newValue.value);
                            } else {
                              setSelectedDesignation('');
                              setFieldValue('reason', '');
                            }
                          }}
                          options={assets}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.value || ''}
                          renderInput={(params) => <Field component={TextField} {...params} label="Reason" />}
                        />

                        <FormHelperText>{errors.designation ? errors.designation : null}</FormHelperText>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 1 }}>
                      <TextField
                        fullWidth
                        label="Description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.empId && errors.empId)}
                        helperText={touched.empId && errors.empId}
                      />
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
                        Update
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
