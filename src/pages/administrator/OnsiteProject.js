import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { LoadingButton, DatePicker } from '@mui/lab';
import plusFill from '@iconify/icons-eva/plus-fill';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Link as RouterLink, useParams } from 'react-router-dom';
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
  getIsLoadingFromUser,
  getRolesListFromUser,
  getAllManagersActionAsync,
  getManagersListFromUser,
  getListOfDesignationActionAsync,
  getDesignationsListFromUser,
  getErrorFromUser,
  getPostProjectAsync,
  getMsgFromUser
} from '../../redux/slices/userSlice';
import { postProjectDetailsAsync, setErrorNull, setMsgNull } from '../../redux/slices/projectSlice';
import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import { getProjectLOVFromTS } from '../../redux/slices/timesheetSlice';
import { getAllGroupsAsync, getAllUsersFromGroups } from '../../redux/slices/timesheetSettingsSlice';
import { MIconButton } from '../../components/@material-extend';

/* eslint-disable */

// ----------------------------------------------------------------------

/**
 * TODO Intergrate with service donot use this
 */

export default function OnsiteProject() {
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
  // const { onsites } = useSelector((state) => state.user);
  // console.log('projectt', onsites);
  const { users } = useSelector((state) => state.user);
  console.log('First', users);
  const error = useSelector((state) => state.project.error);
  console.log('errors', error);
  const msg = useSelector((state) => state.project.msg);
  console.log('444', msg);
  const { projects: userList } = useSelector((state) => state.proj);
  const { projects } = useSelector((state) => state.proj);
  console.log('list', userList);
  const projectLOV = useSelector(getProjectLOVFromTS);
  const [calPayroll, setCalPayroll] = React.useState('');
  const [startDate, setStartDate] = useState(null);

  const status = [{ value: 'Shadow ' }, { value: 'Direct ' }];

  const accommodate = [{ value: 'Yes' }, { value: 'No' }];

  const [allowance, setAllowance] = useState(''); // Initial value set to 'No'
  const [advanced_paid, setAdvancedPaid] = useState('');

  // const handleAllowanceChange = (event) => {
  //   setAllowance(event.target.value);
  // };

  const handleAdvancedPaid = (event) => {
    setAdvancedPaid(event.target.value);
  };
  /**
   * Get user from array
   */
  const userDetails = users.find((_x) => _x.employeeId === params.employeeId);
  console.log('34', userDetails);
  const title = 'Onsite Project Details';

  const NewUserSchema = Yup.object().shape({
    primary_Project: Yup.string().required('Primary Project is required'),
    client_Name: Yup.string().required('Client Name is required'),
    location: Yup.string().required('Location is required'),
    support_Type: Yup.string().required('Support Type is required'),
    duration: Yup.string().required('Duration is required'),
    reporting_date: Yup.string().required('Reporting Date is required'),
    project_Manager: Yup.string().required('Project Manager is required'),
    accomadation: Yup.string().required('Accommodation is required'),
    travel_Arrangement: Yup.string().required('Travel Arrangement is required'),
    onsite_Allowance: Yup.string().required('OnSite Allowance is required'),
    // kra: Yup.string().required('KRA is required'),
    contact_Name: Yup.string().required('Contact Name is required'),
    contact_Number: Yup.number().required('Contact Number is required'),
    mail: Yup.string().email('Email must be a valid email address').required('Email is required'),
    address: Yup.string().required('Address is required'),
    ticket: Yup.string().required('ticket is required'),
    arranged_by: Yup.string().required('arranged_by is required'),
    advanced_paid: Yup.string().required('Advanced Paid is required')
  });

  const initialValues = {
    onsite_Allowance: 'Yes',
    allowance_amount: '',
    advanced_paid: 'Yes',
    advance_amount: ''
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    initialValues: {
      user_id: userDetails.id || '',
      primary_Project: '',
      client_Name: '',
      location: '',
      support_Type: '',
      duration: '',
      reporting_date: '',
      project_Manager: '',
      accomadation: '',
      travel_Arrangement: '',
      onsite_Allowance: '',
      // kra: onsites.kra || '',
      contact_Name: '',
      contact_Number: '',
      mail: '',
      address: '',
      allowance_amount: '',
      advanced_paid: '',
      advance_amount: '',
      ticket: '',
      arranged_by: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          // user_id: userDetails.id,
          primary_Project: values.primary_Project,
          client_Name: values.client_Name,
          location: values.location,
          support_Type: values.support_Type,
          duration: values.duration,
          reporting_date: values.reporting_date,
          project_Manager: values.project_Manager,
          accomadation: values.accomadation,
          travel_Arrangement: values.travel_Arrangement,
          onsite_Allowance: values.onsite_Allowance,
          // kra: values.kra,
          contact_Name: values.contact_Name,
          contact_Number: values.contact_Number,
          mail: values.mail,
          address: values.address,
          allowance_amount: values.allowance_amount,
          advanced_paid: values.advanced_paid,
          advance_amount: values.advance_amount,
          ticket: values.ticket,
          arranged_by: values.arranged_by
        };
        await dispatch(postProjectDetailsAsync(payload));

        setSubmitting(false);
        // enqueueSnackbar('Updated successfully', { variant: 'success' });
        // enqueueSnackbar('Updated successfully', { variant: 'success' });
        // enqueueSnackbar('Updated successfully', {
        //   autoHideDuration: 2000,
        //   variant: 'success'
        // });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
      // navigate(PATH_DASHBOARD.task.taskAssigned);
    }
  });

  const handleStartDate = (value) => {
    setStartDate(value);
  };

  const handleAllowanceChange = (event) => {
    formik.setFieldValue('onsite_Allowance', event.target.value);
  };

  const handleAdvancedPaidChange = (event) => {
    formik.setFieldValue('advanced_paid', event.target.value);
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.6 + ITEM_PADDING_TOP,
        width: 160
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
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
    dispatch(getAllManagersActionAsync());
    dispatch(getListOfDesignationActionAsync());
    dispatch(getAllGroupsAsync());
    dispatch(getAllProjectsAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setFieldValue]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Unable to Update', {
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
      enqueueSnackbar(msg, {
        variant: 'success'
      });

      dispatch(setMsgNull());
      setFieldValue('primary_Project', '');
      setFieldValue('client_Name', '');
      setFieldValue('location', '');
      setFieldValue('support_Type', '');
      setFieldValue('duration', '');
      setFieldValue('project_Manager', '');
      setFieldValue('accomadation', '');
      setFieldValue('travel_Arrangement', '');
      setFieldValue('onsite_Allowance', '');
      // setFieldValue('kra', '');
      setFieldValue('contact_Name', '');
      setFieldValue('contact_Number', '');
      setFieldValue('mail', '');
      setFieldValue('reporting_date', '');
      setFieldValue('address', '');
      setFieldValue('advanced_paid', '');
      setFieldValue('ticket', '');
      setFieldValue('arranged_by', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  useEffect(() => {
    console.log('this is param value', userDetails.id);
    dispatch(getPostProjectAsync(userDetails.id));
  }, []);

  return (
    <Page title={title}>
      <Container sx={{ mt: -3 }} maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ mt: -3 }}
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User Management', href: PATH_DASHBOARD.admin.userManagement },
            { name: 'Onsite details' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: -3 }}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={10}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="Primary-Project-label" sx={{}}>
                          Primary Project *
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="Primary-Project-label"
                          id="Project-select"
                          label="Primary Project"
                          name="Primary Project"
                          {...getFieldProps('primary_Project')}
                          error={Boolean(touched.primary_Project && errors.primary_Project)}
                          helperText={touched.primary_Project && errors.primary_Project}
                          MenuProps={MenuProps}
                        >
                          {projects.map((_x, i) => (
                            <MenuItem key={i} value={_x.proj_Name}>
                              {_x.proj_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        fullWidth
                        label="Client Name"
                        {...getFieldProps('client_Name')}
                        error={Boolean(touched.client_Name && errors.client_Name)}
                        helperText={touched.client_Name && errors.client_Name}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Location"
                        {...getFieldProps('location')}
                        error={Boolean(touched.location && errors.location)}
                        helperText={touched.location && errors.location}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="Status-Project-label" sx={{}}>
                          Support Type
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="Status-Project-label"
                          id="Status-select"
                          label="Support Type"
                          name="Support Type"
                          {...getFieldProps('support_Type')}
                          error={Boolean(touched.support_Type && errors.support_Type)}
                          helperText={touched.support_Type && errors.support_Type}
                          MenuProps={MenuProps}
                        >
                          {status.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {/* <Grid item lg={10} sm={12} xl={3} xs={12}>
                        <TextField
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          id="duration"
                          label="Duration"
                          variant="outlined"
                          name="duration"
                          type="date"
                          {...formik.getFieldProps('duration')}
                          error={Boolean(formik.touched.duration && formik.errors.duration)}
                          helperText={formik.touched.duration && formik.errors.duration}
                        />
                      </Grid> */}
                      <Grid item lg={10} sm={12} xl={3} xs={12}>
                        <TextField
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          id="reporting"
                          label="Reporting Date"
                          variant="outlined"
                          name="reporting"
                          type="date"
                          {...formik.getFieldProps('reporting_date')}
                          error={Boolean(formik.touched.reporting_date && formik.errors.reporting_date)}
                          helperText={formik.touched.reporting_date && formik.errors.reporting_date}
                          inputProps={{
                            min: new Date().toISOString().split('T')[0]
                          }}
                        />
                      </Grid>
                      <TextField
                        size="small"
                        fullWidth
                        label="Duration"
                        {...getFieldProps('duration')}
                        error={Boolean(touched.duration && errors.duration)}
                        helperText={touched.duration && errors.duration}
                      />
                      <FormControl fullWidth error={Boolean(touched.project_Manager && errors.project_Manager)}>
                        <InputLabel id="manager-id-label">Project Manager</InputLabel>
                        <Select
                          size="small"
                          labelId="manager-id-label"
                          id="manager-id"
                          label="Project Manager"
                          {...getFieldProps('project_Manager')}
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
                        <FormHelperText>{errors.project_Manager ? errors.project_Manager : null}</FormHelperText>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {/* <TextField
                        size="small"
                        fullWidth
                        label="Accommodation"
                        {...getFieldProps('accomadation')}
                        error={Boolean(touched.accomadation && errors.accomadation)}
                        helperText={touched.accomadation && errors.accomadation}
                      /> */}
                      <FormControl fullWidth>
                        <InputLabel id="accomodation-Project-label" sx={{}}>
                          Accommodation
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="accomodation-Project-label"
                          id="accomodation-select"
                          label="Accommodation"
                          name="Accommodation"
                          {...getFieldProps('accomadation')}
                          error={Boolean(touched.accomadation && errors.accomadation)}
                          helperText={touched.accomadation && errors.accomadation}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="Arranged">Arranged</MenuItem>
                          <MenuItem value="Not Arranged">Not Arranged</MenuItem>
                        </Select>
                      </FormControl>
                      {/* <TextField
                        size="small"
                        fullWidth
                        label="Travel arrangement"
                        {...getFieldProps('travel_Arrangement')}
                        error={Boolean(touched.travel_Arrangement && errors.travel_Arrangement)}
                        helperText={touched.travel_Arrangement && errors.travel_Arrangement}
                      /> */}
                      <FormControl fullWidth>
                        <InputLabel id="travel-Project-label" sx={{}}>
                          Travel
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="travel-Project-label"
                          id="travel-select"
                          label="Travel"
                          name="Travel"
                          {...getFieldProps('travel_Arrangement')}
                          error={Boolean(touched.travel_Arrangement && errors.travel_Arrangement)}
                          helperText={touched.travel_Arrangement && errors.travel_Arrangement}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="Train">Train</MenuItem>
                          <MenuItem value="Bus">Bus</MenuItem>
                          <MenuItem value="Air">Air</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="Ticket-Project-label" sx={{}}>
                          Ticket
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="Ticket-Project-label"
                          id="Ticket-select"
                          label="Ticket"
                          name="Ticket"
                          {...getFieldProps('ticket')}
                          error={Boolean(touched.ticket && errors.ticket)}
                          helperText={touched.ticket && errors.ticket}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="Confirmed">Confirmed</MenuItem>
                          <MenuItem value="Not Confirmed">Not Confirmed</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="arrangedby-Project-label" sx={{}}>
                          Arranged by
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="arrangedby-Project-label"
                          id="arrangedby-select"
                          label="Arranged by"
                          name="Arranged by"
                          {...getFieldProps('arranged_by')}
                          error={Boolean(touched.arranged_by && errors.arranged_by)}
                          helperText={touched.arranged_by && errors.arranged_by}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="FocusR">FocusR</MenuItem>
                          <MenuItem value="Client">Client</MenuItem>
                        </Select>
                      </FormControl>
                      {/* <TextField
                        size="small"
                        fullWidth
                        label="OSA"
                        {...getFieldProps('onsite_Allowance')}
                        error={Boolean(touched.onsite_Allowance && errors.onsite_Allowance)}
                        helperText={touched.onsite_Allowance && errors.onsite_Allowance}
                      /> */}
                      {/* <TextField
                        size="small"
                        fullWidth
                        label="KRA"
                        {...getFieldProps('kra')}
                        error={Boolean(touched.kra && errors.kra)}
                        helperText={touched.kra && errors.kra}
                      />{' '} */}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="POC"
                        {...getFieldProps('contact_Name')}
                        error={Boolean(touched.contact_Name && errors.contact_Name)}
                        helperText={touched.contact_Name && errors.contact_Name}
                      />
                      <TextField
                        size="small"
                        type="number"
                        fullWidth
                        label="POC Number"
                        {...getFieldProps('contact_Number')}
                        error={Boolean(touched.contact_Number && errors.contact_Number)}
                        helperText={touched.contact_Number && errors.contact_Number}
                      />{' '}
                      <TextField
                        size="small"
                        fullWidth
                        label="POC Mail"
                        {...getFieldProps('mail')}
                        error={Boolean(touched.mail && errors.mail)}
                        helperText={touched.mail && errors.mail}
                      />
                    </Stack>
                    <stack>
                      <TextField
                        size="small"
                        fullWidth
                        label="Address"
                        {...getFieldProps('address')}
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="allowance-Project-label" sx={{}}>
                          Allowance
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="allowance-Project-label"
                          id="allowance-select"
                          label="Allowance"
                          name="onsite_Allowance"
                          value={formik.values.onsite_Allowance}
                          onChange={handleAllowanceChange}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                        {touched.onsite_Allowance && errors.onsite_Allowance && (
                          <FormHelperText error>{errors.onsite_Allowance}</FormHelperText>
                        )}
                      </FormControl>
                      {/* <TextField
                        size="small"
                        fullWidth
                        label="Allowance Amount"
                        {...getFieldProps('allowance_amount')}
                        error={Boolean(touched.allowance_amount && errors.allowance_amount)}
                        helperText={touched.allowance_amount && errors.allowance_amount}
                        disabled={allowance === 'No'}
                      /> */}

                      <TextField
                        size="small"
                        fullWidth
                        label="Allowance Amount"
                        {...formik.getFieldProps('allowance_amount')}
                        error={Boolean(formik.touched.allowance_amount && formik.errors.allowance_amount)}
                        helperText={formik.touched.allowance_amount && formik.errors.allowance_amount}
                        disabled={formik.values.onsite_Allowance === 'No'}
                      />

                      {formik.touched.allowance && formik.errors.allowance && (
                        <FormHelperText error>{formik.errors.allowance}</FormHelperText>
                      )}
                      <FormControl fullWidth>
                        <InputLabel id="advanced_paid-Project-label" sx={{}}>
                          Advanced Paid
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId="advanced_paid-Project-label"
                          id="advanced_paid-select"
                          label=" Advanced Paid"
                          name="advanced_paid"
                          value={formik.values.advanced_paid}
                          onChange={handleAdvancedPaidChange}
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                        {touched.advanced_paid && errors.advanced_paid && (
                          <FormHelperText error>{errors.advanced_paid}</FormHelperText>
                        )}
                      </FormControl>
                      {/* <TextField
                        size="small"
                        fullWidth
                        label="Advanced Amount"
                        {...getFieldProps('advance_amount')}
                        error={Boolean(touched.advance_amount && errors.advance_amount)}
                        helperText={touched.advance_amount && errors.advance_amount}
                      /> */}
                      <TextField
                        size="small"
                        fullWidth
                        label="Advance Amount"
                        {...formik.getFieldProps('advance_amount')}
                        error={Boolean(formik.touched.advance_amount && formik.errors.advance_amount)}
                        helperText={formik.touched.advance_amount && formik.errors.advance_amount}
                        disabled={formik.values.advanced_paid === 'no'}
                      />

                      {formik.touched.advanced_paid && formik.errors.advanced_paid && (
                        <FormHelperText error>{formik.errors.advanced_paid}</FormHelperText>
                      )}
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
                        Submit
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
