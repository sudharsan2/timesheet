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

import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  CreateAssetUserAsync,
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

export default function CreateUserAsset() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
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
    // asset_id: Yup.string().required('Conditions is required'),
    user_id: Yup.string().required('Value Of Asset is required'),
    start_date: Yup.string().required('Date is required is required'),
    end_date: Yup.string().required('Date is required is required')
  });

  // useEffect(() => {
  //   dispatch(createOrUpdateAssetsAsync());
  // }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      asset_id: '',
      user_id: '',
      start_date: '',
      end_date: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          // asset_id: values.conditions,
          user_id: values.value_of_asset,
          start_date: values.start_date,
          end_date: values.end_date
        };
        await dispatch(CreateAssetUserAsync(payload));
        // await dispatch(getAllManagersActionAsync());
        // resetForm();
        // setFieldValue('is_bulk_upload', false);
        // setFieldValue('designation', '');
        // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
        setSubmitting(false);
        // enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  //   const handleShowPassword = () => {
  //     setShowPassword((show) => !show);
  //   };

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
      // setFieldValue('asset_id', '');
      setFieldValue('user_id', '');
      setFieldValue('start_date', '');
      setFieldValue('end_date', '');
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
            { name: 'Asset Assign', href: PATH_DASHBOARD.admin.assetAssign },
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
                    {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Asset Id"
                        {...getFieldProps('asset_id')}
                        error={Boolean(touched.asset_id && errors.asset_id)}
                        helperText={touched.asset_id && errors.asset_id}
                      />
                    </Stack> */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="User Id"
                        {...getFieldProps('user_id')}
                        error={Boolean(touched.user_id && errors.user_id)}
                        helperText={touched.user_id && errors.user_id}
                      />
                    </Stack>
                    <Grid item xs={12} sm={12} md={12}>
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
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
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
