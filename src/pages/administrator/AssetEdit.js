import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
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
// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  getIsLoadingFromAsset,
  CreateAssetUserAsync,
  getDateFromTS,
  getAssetFromTS,
  getEditAssetListFromTS,
  getListofNamesAsync,
  getListofNames,
  getErrorFromUser,
  getMsgFromUser,
  setErrorNull,
  setMsgNull
} from '../../redux/slices/assetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { MHidden, MIconButton } from '../../components/@material-extend';

export default function AssetEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const assetId = useSelector(getAssetFromTS);
  // console.log('Asset Id is', assetId);
  const values = useSelector(getEditAssetListFromTS);
  const date = useSelector(getDateFromTS);
  const { themeStretch } = useSettings();
  const title = 'Edit Asset';
  const isLoading = useSelector(getIsLoadingFromAsset);
  const { employees } = useSelector((state) => state.asset);
  const [buttonState, setButtonState] = React.useState('Save');
  const { users } = useSelector((state) => state.asset);
  const error = useSelector(getErrorFromUser);
  const success = useSelector(getMsgFromUser);
  console.log('Namea', employees);

  const [formData, setFormData] = React.useState({
    from_date: null
  });

  const handleDateChange = (name, value) => {
    if (name === 'start_date') {
      setFormData((prevState) => ({ ...prevState, end_date: null }));
    }

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const userDetails = users.find((_x) => _x.asset_id === Number(params.assetCategory));
  console.log('userdetails', userDetails);

  const [selectedDesignation, setSelectedDesignation] = useState({ empName: userDetails.empName } || null);

  // const [selectedValue, setSelectedValue] = useState({ empName: userDetails.empName } || '');

  const NewUserSchema = Yup.object().shape({
    model: Yup.string().required('Model Name is required'),
    empName: Yup.string().required('EmpName  is required'),
    // empId: Yup.string().required('Emp Id is required'),
    asset_serial_no: Yup.string().required('Asset Serial Number is required'),
    battery_serial_no: Yup.string().required('Battery Serial No is required'),
    asset_category: Yup.string().required('Asset Name is required'),
    product_id: Yup.string().required('Product ID is required'),
    make: Yup.string().required('Make Name is required'),
    os_version: Yup.string().required('Os Version is required'),
    os_key: Yup.string().required('Os Key is required'),
    os_type: Yup.string().required('Os Type is required'),
    ram: Yup.string().required('RAM is required'),
    display_size: Yup.string().required('Display Size is required'),
    storage: Yup.string().required('Storage is required'),
    problem: Yup.string().required('problem is required'),
    conditions: Yup.string().required('Conditions is required'),
    value_of_asset: Yup.string().required('Value Of Asset is required'),
    start_date: Yup.string().required('Date is required is required'),
    // end_date: Yup.string().required('Date is required is required'),
    remarks: Yup.string().required('Remark is required is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      asset_id: userDetails.asset_id || '',
      asset_category: userDetails.asset_category || '',
      // empName: userDetails.empName || '',
      empId: userDetails.empId || '',
      make: userDetails.make || '',
      model: userDetails.model || '',
      asset_serial_no: userDetails.asset_serial_no || '',
      battery_serial_no: userDetails.battery_serial_no || '',
      product_id: userDetails.product_id || '',
      os_version: userDetails.os_version || '',
      os_key: userDetails.os_key || '',
      os_type: userDetails.os_type || '',
      ram: userDetails.ram || '',
      display_size: userDetails.display_size || '',
      storage: userDetails.storage || '',
      problem: userDetails.problem || 'Nil',
      conditions: userDetails.conditions || '',
      value_of_asset: userDetails.value_of_asset || '',
      start_date: formData.start_date || '',
      end_date: formData.end_date || '',
      remarks: userDetails.remarks || 'Nil'
    },
    validationSchema: NewUserSchema,

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log(values);
      try {
        const payload = {
          ...values,
          id: userDetails.id,
          // assetId: values.assetId,
          asset_category: values.asset_category,
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
          value_of_asset: values.value_of_asset,
          start_date: values.start_date,
          end_date: values.end_date,
          remarks: values.remarks
        };
        await dispatch(CreateAssetUserAsync(payload));
        setSubmitting(false);
        navigate(PATH_DASHBOARD.admin.createAsset);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, submitForm, isSubmitting, setFieldValue, getFieldProps, values: val } = formik;

  const handleSubmission = (state) => {
    setButtonState(state);
    submitForm();
  };

  useEffect(() => {
    dispatch(getListofNamesAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setFieldValue]);

  // const handleChange = (value) => {
  //   setSelectedValue(value);
  // };

  useEffect(() => {
    if (success) {
      enqueueSnackbar(success, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(setMsgNull());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(setErrorNull());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // useEffect(() => {
  //   if (msg) {
  //     enqueueSnackbar(msg, { variant: 'success' });
  //     dispatch(setMsgNull());
  //     // setSelectedDesignation('');
  //     // setFieldValue('designation', '');
  //     // resetForm();
  //     // setFieldValue('is_bulk_upload', false);
  //     // setFieldValue('designation', '');
  //     // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [msg]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Asset List', href: PATH_DASHBOARD.admin.createAsset },
            { name: 'Edit' }
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
                      <FormControl fullWidth error={Boolean(touched.designation && errors.designation)}>
                        <InputLabel id="Employee-name">Employee Name</InputLabel>
                        <Select
                          labelId="Employee-name"
                          id="Employee-name"
                          label="Employee Name"
                          name="Employee Name"
                          {...getFieldProps('empName')}
                          error={Boolean(touched.empName && errors.empName)}
                          helperText={touched.empName && errors.empName}
                        >
                          {employees.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.designation ? errors.designation : null}</FormHelperText>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Asset Category"
                        disabled
                        {...getFieldProps('asset_category')}
                        error={Boolean(touched.asset_category && errors.asset_category)}
                        helperText={touched.asset_category && errors.asset_category}
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
                      <TextField
                        fullWidth
                        disabled
                        label="Value Of Asset"
                        {...getFieldProps('value_of_asset')}
                        error={Boolean(touched.value_of_asset && errors.value_of_asset)}
                        helperText={touched.value_of_asset && errors.value_of_asset}
                      />
                    </Stack>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack
                        direction={{ xs: 'column', sm: 'column', md: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                        justifyContent="space-between"
                      >
                        <DatePicker
                          label="Start Date"
                          inputFormat="dd/MM/yyyy"
                          value={formData.start_date}
                          onChange={(newValue) => handleDateChange('start_date', newValue)}
                          renderInput={(params) => <TextField required variant="standard" {...params} />}
                        />
                        <DatePicker
                          label="End Date"
                          inputFormat="dd/MM/yyyy"
                          value={formData.end_date}
                          onChange={(newValue) => handleDateChange('end_date', newValue)}
                          renderInput={(params) => <TextField required variant="standard" {...params} />}
                        />
                      </Stack>
                    </Grid>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 1 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="Remarks"
                        {...getFieldProps('remarks')}
                        error={Boolean(touched.remarks && errors.remarks)}
                        helperText={touched.remarks && errors.remarks}
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
