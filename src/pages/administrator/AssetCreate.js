import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { DatePicker, LoadingButton } from '@mui/lab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  createOrUpdateAssetsAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser
} from '../../redux/slices/assetSlice';
import { getAllGroupsAsync, getAllUsersFromGroups } from '../../redux/slices/timesheetSettingsSlice';
import { getAllCountriesAsync, getCoutriesFromLeaveMaster } from '../../redux/slices/leaveSlice';
import { numbers, upperCaseLetters, lowerCaseLetters, specialCharacters } from '../../utils/characters';
import { fData } from '../../utils/formatNumber';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import { UploadAvatar } from '../../components/upload';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import {
//   createUserActionAsync,
//   setMsgNull,
//   getMsgFromUser,
//   getIsLoadingFromUser,
//   getAllRolesActionAsync,
//   getAllManagersActionAsync,
//   getRolesListFromUser,
//   getManagersListFromUser,
//   getListOfDesignationActionAsync,
//   getDesignationsListFromUser,
//   getErrorFromUser,
//   setErrorNull
// } from '../../redux/slices/userSlice';
import { MIconButton } from '../../components/@material-extend';

// ----------------------------------------------------------------------

/**
 * TODO Intergrate with service donot use this
 */

export default function AssetCreate() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  //   const [showPassword, setShowPassword] = useState(false);
  //   const [selectedDesignation, setSelectedDesignation] = useState(null);
  //   const roles = useSelector(getRolesListFromUser);
  //   const managers = useSelector(getManagersListFromUser);
  //   const groups = useSelector(getAllUsersFromGroups);
  //   const designations = useSelector(getDesignationsListFromUser);
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const title = 'Asset Management';
  const countries = useSelector(getCoutriesFromLeaveMaster);

  const NewUserSchema = Yup.object().shape({
    model: Yup.string().required('Model Name is required'),
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
    // start_date: Yup.string().required('Date is required is required'),
    // end_date: Yup.string().required('Date is required is required'),
    remarks: Yup.string().required('Remark is required is required')
  });

  // useEffect(() => {
  //   dispatch(createOrUpdateAssetsAsync());
  // }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      asset_category: '',
      user_id: '',
      make: '',
      model: '',
      asset_serial_no: '',
      battery_serial_no: '',
      product_id: '',
      os_version: '',
      os_key: '',
      os_type: '',
      ram: '',
      display_size: '',
      storage: '',
      problem: 'Nil',
      conditions: '',
      value_of_asset: '',
      start_date: '',
      end_date: '',
      remarks: 'Nil'
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          asset_category: values.asset_category,
          user_id: values.user_id,
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
        await dispatch(createOrUpdateAssetsAsync(payload));
        // await dispatch(getAllManagersActionAsync());
        // resetForm();
        // setFieldValue('is_bulk_upload', false);
        // setFieldValue('designation', '');
        // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
        setSubmitting(false);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('Creation failed', { variant: 'error' });
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  //   const handleShowPassword = () => {
  //     setShowPassword((show) => !show);
  //   };

  // const handleSubmit = () => {
  //   const path = `PATH_DASHBOARD.admin.createAsset`;
  //   navigate(path);
  // };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  //   useEffect(() => {
  //     // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
  //     dispatch(getAllRolesActionAsync());
  //     dispatch(getAllManagersActionAsync());
  //     dispatch(getListOfDesignationActionAsync());
  //     dispatch(getAllGroupsAsync());
  //     dispatch(getAllCountriesAsync());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

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

  useEffect(() => {
    if (msg) {
      enqueueSnackbar(msg, { variant: 'success' });
      dispatch(setMsgNull());
      // resetForm();
      setFieldValue('asset_category', '');
      setFieldValue('model', '');
      setFieldValue('user_id', '');
      setFieldValue('asset_serial_no', '');
      setFieldValue('battery_serial_no', '');
      setFieldValue('product_id', '');
      setFieldValue('make', '');
      setFieldValue('os_version', '');
      setFieldValue('os_key', '');
      setFieldValue('os_type', '');
      setFieldValue('ram', '');
      setFieldValue('display_size', '');
      setFieldValue('storage', '');
      setFieldValue('problem', '');
      setFieldValue('conditions', '');
      setFieldValue('value_of_asset', '');
      setFieldValue('start_date', '');
      // setFieldValue('end_date', '');
      setFieldValue('remarks', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Asset List', href: PATH_DASHBOARD.admin.createAsset },
            { name: 'Asset Create' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                {/* <Card sx={{ py: 10, px: 3 }}> */}
                {/* <Box sx={{ mb: 5 }}> */}
                {/* <UploadAvatar
                      accept="image/*"
                      file={values.avatarUrl}
                      maxSize={3145728}
                      onDrop={handleDrop}
                      error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                      caption={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 2,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.secondary'
                          }}
                        >
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    /> */}
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
                {/* </Box> */}
                {/* </Card> */}
              </Grid>

              <Grid item xs={12} md={10}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Asset Category"
                        {...getFieldProps('asset_category')}
                        error={Boolean(touched.asset_category && errors.asset_category)}
                        helperText={touched.asset_category && errors.asset_category}
                      />
                      <TextField
                        fullWidth
                        label="Make"
                        {...getFieldProps('make')}
                        error={Boolean(touched.make && errors.make)}
                        helperText={touched.make && errors.make}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Model"
                        {...getFieldProps('model')}
                        error={Boolean(touched.model && errors.model)}
                        helperText={touched.model && errors.model}
                      />
                      <TextField
                        fullWidth
                        label="Asset Serial No"
                        {...getFieldProps('asset_serial_no')}
                        error={Boolean(touched.asset_serial_no && errors.asset_serial_no)}
                        helperText={touched.asset_serial_no && errors.asset_serial_no}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Battery Serial No"
                        {...getFieldProps('battery_serial_no')}
                        error={Boolean(touched.battery_serial_no && errors.battery_serial_no)}
                        helperText={touched.battery_serial_no && errors.battery_serial_no}
                      />
                      <TextField
                        fullWidth
                        label="Product ID"
                        {...getFieldProps('product_id')}
                        error={Boolean(touched.product_id && errors.product_id)}
                        helperText={touched.product_id && errors.product_id}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Os Version"
                        {...getFieldProps('os_version')}
                        error={Boolean(touched.os_version && errors.os_version)}
                        helperText={touched.os_version && errors.os_version}
                      />
                      <TextField
                        fullWidth
                        label="Os Key"
                        {...getFieldProps('os_key')}
                        error={Boolean(touched.os_key && errors.os_key)}
                        helperText={touched.os_key && errors.os_key}
                      />
                      <TextField
                        fullWidth
                        label="Os Type"
                        {...getFieldProps('os_type')}
                        error={Boolean(touched.os_type && errors.os_type)}
                        helperText={touched.os_type && errors.os_type}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="RAM"
                        {...getFieldProps('ram')}
                        error={Boolean(touched.ram && errors.ram)}
                        helperText={touched.ram && errors.ram}
                      />
                      <TextField
                        fullWidth
                        label="Display Size"
                        {...getFieldProps('display_size')}
                        error={Boolean(touched.display_size && errors.display_size)}
                        helperText={touched.display_size && errors.display_size}
                      />
                      <TextField
                        fullWidth
                        label="Storage"
                        {...getFieldProps('storage')}
                        error={Boolean(touched.storage && errors.storage)}
                        helperText={touched.storage && errors.storage}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Problem"
                        {...getFieldProps('problem')}
                        error={Boolean(touched.problem && errors.problem)}
                        helperText={touched.problem && errors.problem}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Conditions"
                        {...getFieldProps('conditions')}
                        error={Boolean(touched.conditions && errors.conditions)}
                        helperText={touched.conditions && errors.conditions}
                      />
                      <TextField
                        fullWidth
                        label="Value Of Asset"
                        {...getFieldProps('value_of_asset')}
                        error={Boolean(touched.value_of_asset && errors.value_of_asset)}
                        helperText={touched.value_of_asset && errors.value_of_asset}
                      />
                    </Stack>
                    {/* <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 14, sm: 12 }}>
                        <DatePicker
                          label="Start Date"
                          value={values.start_date}
                          inputFormat="dd/MM/yyyy"
                          disablePast
                          fullWidth
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('start_date', parseddate);
                            } else {
                              setFieldValue('start_date', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="Start Date" />
                          )}
                        />
                        <DatePicker
                          label="End Date"
                          value={values.end_date}
                          inputFormat="dd/MM/yyyy"
                          disablePast
                          fullWidth
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('end_date', parseddate);
                            } else {
                              setFieldValue('end_date', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="End Date" />
                          )}
                        />
                      </Stack>
                    </Grid> */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 1 }}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        {...getFieldProps('remarks')}
                        error={Boolean(touched.remarks && errors.remarks)}
                        helperText={touched.remarks && errors.remarks}
                      />
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        type="submit"
                        // onClick={routeChange}
                        // onSubmit={handleSubmit}
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        Create Asset
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
