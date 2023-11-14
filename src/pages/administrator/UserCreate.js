import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { LoadingButton, DatePicker } from '@mui/lab';
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
import { getAllGroupsAsync, getAllUsersFromGroups } from '../../redux/slices/timesheetSettingsSlice';
import { getAllCountriesAsync, getCoutriesFromLeaveMaster } from '../../redux/slices/leaveSlice';
import { numbers, upperCaseLetters, lowerCaseLetters, specialCharacters } from '../../utils/characters';
import { fData } from '../../utils/formatNumber';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import { UploadAvatar } from '../../components/upload';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  createUserActionAsync,
  getAllRolesActionAsync,
  getAllManagersActionAsync,
  getIsLoadingFromUser,
  getRolesListFromUser,
  getManagersListFromUser,
  getListOfDesignationActionAsync,
  getDesignationsListFromUser,
  getErrorFromUser,
  setErrorNull,
  getMsgFromUser,
  setMsgNull
} from '../../redux/slices/userSlice';
import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import { getProjectLOVFromTS } from '../../redux/slices/timesheetSlice';
import { MIconButton } from '../../components/@material-extend';
// ----------------------------------------------------------------------

/**
 * TODO Intergrate with service donot use this
 */

const createPassword = (characterList) => {
  let password = '';
  const characterListLength = characterList.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    const characterIndex = Math.round(Math.random() * characterListLength);
    password += characterList.charAt(characterIndex);
  }

  return password;
};

export default function UserCreate() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const roles = useSelector(getRolesListFromUser);
  const managers = useSelector(getManagersListFromUser);
  const groups = useSelector(getAllUsersFromGroups);
  const designations = useSelector(getDesignationsListFromUser);
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const title = 'User Management';
  const countries = useSelector(getCoutriesFromLeaveMaster);
  const projectLOV = useSelector(getProjectLOVFromTS);
  const [calPayroll, setCalPayroll] = React.useState('');
  const { projects: userList } = useSelector((state) => state.proj);
  const { projects } = useSelector((state) => state.proj);
  const [startDate, setStartDate] = useState(null);

  console.log('jfgfejl', projectLOV);

  const NewUserSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Must be greater than 5 letters')
      .max(21, 'Must be lesser than 20 letters'),
    username: Yup.string().required('Username is required'),
    userRoles: Yup.string().required('Role is required'),
    reportingManager: Yup.string().required('Reporting Manager is required'),
    group: Yup.number().required('KPI-KRa Group is required'),
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Must be greater than 4 letters')
      .max(41, 'Must be lesser than 40 letters'),
    primaryProject: Yup.string().required('Primary Project is required'),
    designation: Yup.string().required('Designation is required'),
    employeeId: Yup.string().required('Employee id is required')
    // date_of_joining: Yup.string().required('Date of Join is required'),
    // date_of_birth: Yup.string().required('Date of Birth is required')
    // avatarUrl: Yup.mixed().required('Avatar is required')
  });

  const handleStartDate = (value) => {
    setStartDate(value);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      email: '',
      password: '',
      username: '',
      userRoles: 'ROLE_TEAM_MEMBER',
      designation: '',
      reportingManager: '',
      group: '',
      employeeId: '',
      avatarUrl: '',
      is_bulk_upload: '',
      primaryProject: '',
      date_freeze: '',
      overtime_applied_before: '',
      country_code: '',
      date_of_joining: '',
      date_of_birth: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          group_id: values.group,
          managerId: values.reportingManager,
          primaryProject: values.primaryProject,
          is_bulk_upload: values.is_bulk_upload === true ? 'Y' : 'N'
        };
        await dispatch(createUserActionAsync(payload));
        await dispatch(getAllManagersActionAsync());
        // resetForm();
        // setFieldValue('is_bulk_upload', false);
        // setFieldValue('designation', '');
        // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const copyToClipboard = () => {
    const newTextArea = document.createElement('textarea');
    newTextArea.innerText = values.password;
    document.body.appendChild(newTextArea);
    newTextArea.select();
    document.execCommand('copy');
    newTextArea.remove();
  };

  const handleCopyPassword = () => {
    if (values.password === '') {
      enqueueSnackbar('Nothing to copied', {
        variant: 'error'
      });
    } else {
      copyToClipboard();
      enqueueSnackbar('Copied!', {
        variant: 'success'
      });
    }
  };

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

  useEffect(() => {
    setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
    dispatch(getAllRolesActionAsync());
    dispatch(getAllManagersActionAsync());
    dispatch(getListOfDesignationActionAsync());
    dispatch(getAllGroupsAsync());
    dispatch(getAllCountriesAsync());
    dispatch(getAllProjectsAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setFieldValue('is_bulk_upload', false);
      setFieldValue('designation', '');
      setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
      setFieldValue('name', '');
      setFieldValue('email', '');
      setFieldValue('password', '');
      setFieldValue('username', '');
      setFieldValue('userRoles', 'ROLE_ADMIN');
      setFieldValue('reportingManager', '');
      setFieldValue('primaryProject', '');
      setFieldValue('group', '');
      setFieldValue('employeeId', '');
      setFieldValue('avatarUrl', '');
      setFieldValue('is_bulk_upload', '');
      setFieldValue('date_freeze', '');
      setFieldValue('overtime_applied_before', '');
      setFieldValue('country_code', '');
      setFieldValue('date_of_joining', '');
      setFieldValue('date_of_birth', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User Management', href: PATH_DASHBOARD.admin.userManagement },
            { name: 'User Create' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ py: 10, px: 3 }}>
                  <Box sx={{ mb: 5 }}>
                    <UploadAvatar
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
                    />
                    <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                      {touched.avatarUrl && errors.avatarUrl}
                    </FormHelperText>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <TextField
                        fullWidth
                        label="Employee id"
                        {...getFieldProps('employeeId')}
                        error={Boolean(touched.employeeId && errors.employeeId)}
                        helperText={touched.employeeId && errors.employeeId}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(touched.designation && errors.designation)}>
                        <Autocomplete
                          disablePortal
                          autoHighlight
                          id="designation-id"
                          value={selectedDesignation}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedDesignation(newValue);
                              setFieldValue('designation', newValue.designation);
                            } else {
                              setSelectedDesignation('');
                              setFieldValue('designation', '');
                            }
                          }}
                          options={designations}
                          isOptionEqualToValue={(option, value) => option.designation === value.designation}
                          getOptionLabel={(option) => option.designation || ''}
                          renderInput={(params) => <Field component={TextField} {...params} label="User Designation" />}
                        />

                        <FormHelperText>{errors.designation ? errors.designation : null}</FormHelperText>
                      </FormControl>
                      <FormControl fullWidth error={Boolean(touched.primaryProject && errors.primaryProject)}>
                        <Autocomplete
                          disablePortal
                          autoHighlight
                          id="primaryProject-id"
                          value={selectedProject}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedProject(newValue);
                              setFieldValue('primaryProject', newValue.proj_Name);
                            } else {
                              setSelectedProject('');
                              setFieldValue('primaryProject', '');
                            }
                          }}
                          options={projects}
                          isOptionEqualToValue={(option, value) => option.proj_Name === value.proj_Name}
                          getOptionLabel={(option) => option.proj_Name || ''}
                          getOptionSelected={(option, value) => option.proj_Name === value.proj_Name}
                          renderInput={(params) => <Field component={TextField} {...params} label="Primary Project" />}
                        />

                        <FormHelperText>{errors.primaryProject ? errors.primaryProject : null}</FormHelperText>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />

                      <FormControl fullWidth error={Boolean(touched.userRoles && errors.userRoles)}>
                        <InputLabel id="role-id-label">Role</InputLabel>
                        {/* <Select labelId="role-id-label" id="role-id" label="Role" {...getFieldProps('userRoles')}> */}
                        <Select labelId="role-id-label" id="role-id" label="Role" {...getFieldProps('userRoles')}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {roles.map((_x, i) => (
                            <MenuItem key={i} value={_x.name}>
                              {_x.description}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.userRoles ? errors.userRoles : null}</FormHelperText>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(touched.reportingManager && errors.reportingManager)}>
                        <InputLabel id="manager-id-label">Reporting Manager</InputLabel>
                        <Select
                          labelId="manager-id-label"
                          id="manager-id"
                          label="Reporting Manager"
                          {...getFieldProps('reportingManager')}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {managers.map((_x, i) => (
                            <MenuItem key={i} value={_x.user_ID}>
                              {_x.name} ({_x.designation})
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.reportingManager ? errors.reportingManager : null}</FormHelperText>
                      </FormControl>
                      <FormControl fullWidth error={Boolean(touched.group && errors.group)}>
                        <InputLabel id="group-id-label">KPI-KRA Group</InputLabel>
                        <Select
                          labelId="group-id-label"
                          id="group-id"
                          label="KPI-KRA Group"
                          {...getFieldProps('group')}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {groups.map((_x, i) => (
                            <MenuItem key={i} value={_x.id}>
                              {_x.name} ({_x.description})
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.group ? errors.group : null}</FormHelperText>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Username"
                        {...getFieldProps('username')}
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && errors.username}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        {...getFieldProps('password')}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowPassword} edge="end">
                                <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                              </IconButton>{' '}
                              <IconButton onClick={handleCopyPassword} edge="end">
                                <ContentCopyIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        // defaultValue={createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters)}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField fullWidth type="number" label="Date Freeze" {...getFieldProps('date_freeze')} />
                      {/* <FormControl fullWidth>
                        <DatePicker
                          required
                          fullWidth
                          label="DOB"
                          value={values.date_of_birth}
                          inputFormat="dd/MM/yyyy"
                          //   disablePast
                          onChange={(newValue) => {
                            if (newValue) {
                              handleStartDate(newValue);
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('date_of_birth', parseddate);
                            } else {
                              setFieldValue('date_of_birth', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} {...params} onKeyDown={(e) => e.preventDefault()} />
                          )}
                        />
                      </FormControl> */}
                      <FormControlLabel
                        fullWidth
                        {...getFieldProps('is_bulk_upload')}
                        control={<Switch checked={values.is_bulk_upload} />}
                        label="Bulk Upload"
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {/* <FormControl fullWidth>
                        <DatePicker
                          required
                          fullWidth
                          label="DOJ"
                          value={values.date_of_joining}
                          inputFormat="dd/MM/yyyy"
                          //   disablePast
                          onChange={(newValue) => {
                            if (newValue) {
                              handleStartDate(newValue);
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('date_of_joining', parseddate);
                            } else {
                              setFieldValue('date_of_joining', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} {...params} onKeyDown={(e) => e.preventDefault()} />
                          )}
                        />
                      </FormControl> */}
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="country-select-label">Country</InputLabel>
                        <Select
                          labelId="country-select-label"
                          id="country-select"
                          label="country"
                          {...getFieldProps('country_code')}
                        >
                          <MenuItem>Select</MenuItem>
                          {countries.map((_x, i) => (
                            <MenuItem key={i} value={_x.countrycode}>
                              {_x.countryname} ( {_x.countrycode} )
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
                        Create User
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
