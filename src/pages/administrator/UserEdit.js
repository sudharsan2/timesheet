import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { LoadingButton, DatePicker } from '@mui/lab';
import plusFill from '@iconify/icons-eva/plus-fill';
import viewFill from '@iconify/icons-eva/eye-outline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Box,
  Card,
  Button,
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
import { numbers, upperCaseLetters, lowerCaseLetters, specialCharacters } from '../../utils/characters';
import { fData } from '../../utils/formatNumber';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import { UploadAvatar } from '../../components/upload';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  updateUserActionAsync,
  getIsLoadingFromUser,
  getRolesListFromUser,
  userActiveInactiveActionAsync,
  getAllManagersActionAsync,
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
import { getAllGroupsAsync, getAllUsersFromGroups } from '../../redux/slices/timesheetSettingsSlice';
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

// UserEdit.propTypes = {
//   employeeId: PropTypes.string
// };

export default function UserEdit({ employeeId }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const params = useParams();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [showPassword, setShowPassword] = useState(false);
  const roles = useSelector(getRolesListFromUser);
  const isLoading = useSelector(getIsLoadingFromUser);
  const managers = useSelector(getManagersListFromUser);
  const groups = useSelector(getAllUsersFromGroups);
  const designations = useSelector(getDesignationsListFromUser);
  const { users } = useSelector((state) => state.user);
  console.log('First', users);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const { projects: userList } = useSelector((state) => state.proj);
  const { projects } = useSelector((state) => state.proj);
  console.log('list', userList);
  const projectLOV = useSelector(getProjectLOVFromTS);
  const [calPayroll, setCalPayroll] = React.useState('');
  const [startDate, setStartDate] = useState(null);
  const today = new Date();
  const maxDate = today.toISOString().split('T')[0];

  /**
   * Get user from array
   */
  const userDetails = users.find((_x) => _x.employeeId === params.employeeId);
  const [selectedDesignation, setSelectedDesignation] = useState({ designation: userDetails.designation } || null);
  const [selectedProject, setSelectedProject] = useState({ primaryProject: userDetails.primaryProject } || null);
  const [checked, setChecked] = useState(false || userDetails.isActive === 'Y');
  const [isBulkChecked, setisBulkChecked] = useState(false || userDetails.is_bulk_upload === 'Y');
  const [dateFreeze, setDateFreeze] = useState('');
  const getRole = (role) => (roles.length > 0 ? roles.find((_x) => _x.id === role).name : '');
  console.log('Dell', userDetails);

  const title = 'User Management';

  const NewUserSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Must be greater than 5 letters')
      .max(21, 'Must be lesser than 20 letters'),
    username: Yup.string().required('Username is required'),
    userRoles: Yup.string().required('Role is required'),
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Must be greater than 4 letters')
      .max(41, 'Must be lesser than 40 letters'),
    employeeId: Yup.string().required('Employee id is required'),
    reportingManager: Yup.string().required('Reporting Manager is required'),
    group: Yup.number().required('KPI-KRa Group is required'),
    designation: Yup.string().required('Designation is required'),
    primaryProject: Yup.string().required('Primary Project is required'),
    // date_of_birth: Yup.string().required('Date of Birth is required'),
    // date_of_joining: Yup.string().required('Date of Joim is required'),
    is_bulk_upload: Yup.string(),
    date_freeze: Yup.string()
    // avatarUrl: Yup.mixed().required('Avatar is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userDetails.name || '',
      email: userDetails.email || '',
      // password: userDetails.password || '',
      username: userDetails.username || '',
      userRoles: getRole(userDetails.roleId) || '',
      employeeId: userDetails.employeeId || '',
      avatarUrl: userDetails.avatarUrl || '',
      designation: userDetails.designation || '',
      primaryProject: userDetails.primaryProject || '',
      reportingManager: userDetails.managerId || '',
      group: userDetails.groupId || '',
      is_bulk_upload: userDetails.is_bulk_upload || '',
      date_freeze: userDetails.date_freeze || '',
      date_of_birth: userDetails.date_of_birth || '',
      date_of_joining: userDetails.date_of_joining || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          id: userDetails.id, // ?ss
          group_id: values.group,
          managerId: values.reportingManager,
          userRoles: values.userRoles,
          date_of_birth: values.date_of_birth,
          date_of_joining: values.date_of_joining,
          is_bulk_upload: isBulkChecked ? 'Y' : 'N',
          date_freeze: dateFreeze,
          primaryProject: values.primaryProject
        };
        await dispatch(updateUserActionAsync(payload));
        await dispatch(getAllManagersActionAsync());
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const handleStartDate = (value) => {
    setStartDate(value);
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.6 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleUserActiveInactive = (event) => {
    const payload = {
      id: userDetails.id,
      is_Active: event.target.checked ? 'Y' : 'N'
    };
    setChecked(event.target.checked);
    dispatch(userActiveInactiveActionAsync(payload));
  };

  const handleBulkUpload = (event) => {
    setisBulkChecked(event.target.checked);
  };

  const handleChangeDateFreeze = (e) => {
    setDateFreeze(e.target.value);
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
    setDateFreeze(userDetails.date_freeze);
    dispatch(getAllManagersActionAsync());
    dispatch(getListOfDesignationActionAsync());
    dispatch(getAllGroupsAsync());
    dispatch(getAllProjectsAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setFieldValue]);

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
      // setSelectedDesignation('');
      // setFieldValue('designation', '');
      // resetForm();
      // setFieldValue('is_bulk_upload', false);
      // setFieldValue('designation', '');
      // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  // useEffect(() => {
  //   if (msg) {
  //     enqueueSnackbar(msg, { variant: 'success' });
  //     dispatch(setMsgNull());
  //     // setSelectedDesignation('');
  //     // setFieldValue('designation', '');
  //     // resetForm();
  //     // setFieldValue('is_bulk_upload', false);
  //     // setFieldValue('designation', '');
  //     setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
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
            { name: 'User Management', href: PATH_DASHBOARD.admin.userManagement },
            { name: 'User Edit' }
          ]}
          // action={
          //   <>
          //     <Button
          //       variant="contained"
          //       sx={{ mr: 2, mt: 4 }}
          //       component={RouterLink}
          //       to={`${PATH_DASHBOARD.admin.onsiteProject}/${params.employeeId}`}
          //       startIcon={<Icon icon={plusFill} />}
          //     >
          //       New Project
          //     </Button>{' '}
          //     <Button
          //       variant="contained"
          //       sx={{ mr: 2, mt: 4 }}
          //       component={RouterLink}
          //       to={`${PATH_DASHBOARD.admin.workedProj}/${params.employeeId}`}
          //       startIcon={<Icon icon={viewFill} />}
          //     >
          //       Worked Project
          //     </Button>{' '}
          //   </>
          // }
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
                          id="designation-id"
                          value={selectedDesignation || {}}
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
                      {/* <FormControl fullWidth error={Boolean(touched.primaryProject && errors.primaryProject)}>
                        <Autocomplete
                          id="primary-id"
                          value={selectedProject || {}}
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
                          renderInput={(params) => <Field component={TextField} {...params} label="Primary Project" />}
                        />

                        <FormHelperText>{errors.primaryProject ? errors.primaryProject : null}</FormHelperText>
                      </FormControl> */}
                      <FormControl fullWidth>
                        <InputLabel id="Primary-Project-label">Primary Project *</InputLabel>
                        <Select
                          labelId="Primary-Project-label"
                          id="Project-select"
                          label="Primary Project"
                          name="Primary Project"
                          {...getFieldProps('primaryProject')}
                          error={Boolean(touched.primaryProject && errors.primaryProject)}
                          helperText={touched.primaryProject && errors.primaryProject}
                          MenuProps={MenuProps}
                        >
                          {projects.map((_x, i) => (
                            <MenuItem key={i} value={_x.proj_Name}>
                              {_x.proj_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* <TextField
                        fullWidth
                        label="Email Address"
                        {...getFieldProps('primaryProject')}
                        error={Boolean(touched.primaryProject && errors.primaryProject)}
                        helperText={touched.primaryProject && errors.primaryProject}
                      /> */}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />

                      <FormControl fullWidth error={Boolean(errors.userRoles)}>
                        <InputLabel id="role-id-label">Role</InputLabel>
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
                        <FormHelperText>{errors.userRoles?.message}</FormHelperText>
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
                      {/* <FormControl fullWidth>
                        <DatePicker
                          required
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
                          // onChangeRaw={(e) => e.n()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} {...params} onKeyDown={(e) => e.preventDefault()} />
                          )}
                        />
                      </FormControl> */}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2, lg: 6 }}>
                      <FormControlLabel
                        value="end"
                        control={
                          <Switch
                            checked={checked}
                            onChange={handleUserActiveInactive}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        }
                        label={checked ? 'Active' : 'Not Active'}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        fullWidth
                        {...getFieldProps('is_bulk_upload')}
                        control={<Switch checked={isBulkChecked} onChange={handleBulkUpload} />}
                        label="Bulk Upload"
                      />
                      {/* <FormControl fullWidth>
                        <DatePicker
                          required
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
                          // onChangeRaw={(e) => e.n()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} {...params} onKeyDown={(e) => e.preventDefault()} />
                          )}
                        />
                      </FormControl> */}
                      <TextField
                        fullWidth
                        size="medium"
                        type="number"
                        name="activity"
                        variant="outlined"
                        label="Date Freeze"
                        value={dateFreeze}
                        onChange={handleChangeDateFreeze}
                        // inputProps={{ maxLength: 255 }}
                      />
                    </Stack>
                    {/* <TextField
                      // style={{ width: 300 }}
                      type="number"
                       label="Date Freeze"
                      {...getFieldProps('date_freeze')}
                      fullWidth
                    /> */}
                    {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}></Stack> */}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      {/* <Button
                        variant="contained"
                        sx={{ mr: 1 }}
                        component={RouterLink}
                        to={PATH_DASHBOARD.admin.onsiteProject}
                        startIcon={<Icon icon={plusFill} />}
                      >
                        Onsite Project
                      </Button>{' '} */}
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
