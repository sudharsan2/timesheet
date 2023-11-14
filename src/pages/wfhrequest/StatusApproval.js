import {
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Container,
  Card,
  Stack,
  TextField,
  Box,
  Autocomplete,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MultiSelect } from 'primereact/multiselect';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format, addDays } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { createDispatchHook, useDispatch, useSelector } from 'react-redux';
import {
  createTravelDetailsAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser
} from '../../redux/slices/projectSlice';
import { getAllManagersActionAsync } from '../../redux/slices/userSlice';
import { getProjectLOVFromTS, getProjectLOVAsync } from '../../redux/slices/timesheetSlice';
import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
// import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';

/* eslint-disable */

export default function StatusApproval() {
  // return <Typography variant="h3">Ajay</Typography>;
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckeds, setIsCheckeds] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const isLoading = useSelector(getIsLoadingFromUser);
  const { calender: userList } = useSelector((state) => state.project);
  const { calender } = useSelector((state) => state.project);
  const { projects } = useSelector((state) => state.proj);
  const projectLOV = useSelector(getProjectLOVFromTS);
  const modeofTravel = [{ value: 'Bus' }, { value: 'Train' }, { value: 'Air' }, { value: 'cab' }];
  const { managers } = useSelector((state) => state.user);
  console.log('managers', managers);
  console.log('9099', calender);
  const navigate = useNavigate();
  const [text, setText] = useState(' • ');

  const modules = {
    toolbar: [[{ list: 'bullet' }]]
  };

  const handleChange = (value) => {
    setText(value);
  };

  const [numberOfDays, setNumberOfDays] = useState(0);

  const [selectedCities, setSelectedCities] = useState(null);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleCheckbox = (event) => {
    setIsCheck(event.target.checked);
  };

  const handleCheckboxChanges = (event) => {
    setIsCheckeds(event.target.checkeds);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setText(text + '\n • ');
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 160
      }
    }
  };

  const NewUserSchema = Yup.object().shape({
    project: Yup.string().required('Project name is required'),
    date_of_travel: Yup.string().required('Date of Travel is required'),
    time: Yup.string().required(' Time is required'),
    time_zone: Yup.string().required('Time Zone is required'),
    travel_mode: Yup.string().required('Travel mode is required'),
    location_from: Yup.string().required('Location From is required'),
    location_to: Yup.string().required('Location To is required')
  });

  const [startDate, setStartDate] = useState('12/03/23');
  const [endDate, setEndDate] = useState('12/06/23');

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
    setNumberOfDays(0);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date) {
      const start = new Date(startDate);
      const end = new Date(date);
      const daysDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      setNumberOfDays(daysDifference + 1); // Add 1 to include both the start and end dates
    } else {
      setNumberOfDays(0);
    }
  };

  const handleStartDate = (value) => {
    setStartDate(value);
    setEndDate(value);
  };

  const handleEndDate = (value) => {
    setEndDate(value);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project: '',
      date_of_travel: '',
      time: '',
      time_zone: 'IST',
      travel_mode: '',
      location_from: '',
      location_to: '',
      acc_location: '',
      hotel_name: '',
      checkin_date_time: '',
      checkout_date_time: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        const payload = {
          ...values,
          project: values.project,
          date_of_travel: values.date_of_travel,
          time: values.time,
          time_zone: values.time_zone,
          travel_mode: values.travel_mode,
          location_from: values.location_from,
          location_to: values.location_to,
          acc_location: values.acc_location,
          hotel_name: values.hotel_name,
          checkin_date_time: values.checkin_date_time,
          checkout_date_time: values.checkout_date_time
        };
        await dispatch(createTravelDetailsAsync(payload));
        resetForm();
        // enqueueSnackbar('Created successfully', {
        //   variant: 'success',
        //   action: (key) => (
        //     <MIconButton size="small" onClick={() => closeSnackbar(key)}>
        //       <Icon icon={closeFill} />
        //     </MIconButton>
        //   )
        // });
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // enqueueSnackbar('Creation failed', { variant: 'error' });
        setErrors(error);
      }
      navigate(PATH_DASHBOARD.travel.travelSummary);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    dispatch(getAllProjectsAsync());
    dispatch(getAllProjectsAsync());
    dispatch(getAllManagersActionAsync());
  }, [dispatch]);

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
  React.useEffect(() => {
    dispatch(getProjectLOVAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (msg) {
      enqueueSnackbar(msg, 'Created Successfully', { variant: 'success' });
      dispatch(setMsgNull());

      setFieldValue('proj_Name', '');
      setFieldValue('calendarName', '');
      setFieldValue('description', '');
      setFieldValue('start_Date', '');
      setFieldValue('end_Date', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  const title = 'Status List';

  return (
    <Page title={title}>
      <Container sx={{ mt: -4 }} maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Summary', href: PATH_DASHBOARD.travel.requestApproval },
            { name: 'Req' }
          ]}
        />

        <FormikProvider value={formik}>
          <Form noValiddate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={10}>
                <Card sx={{ p: 1, mt: -4 }}>
                  <Stack spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <DatePicker
                            required
                            fullWidth
                            label="Start Date"
                            value={startDate}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={handleStartDateChange}
                            // onChange={(newValue) => {
                            //   if (newValue) {
                            //     handleStartDate(newValue);
                            //     const parseddate = format(newValue, 'yyyy-MM-dd');
                            //     setFieldValue('date_of_travel', parseddate);
                            //   } else {
                            //     setFieldValue('date_of_travel', '');
                            //   }
                            // }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => (
                              <Field
                                component={TextField}
                                size="small"
                                {...params}
                                onKeyDown={(e) => e.preventDefault()}
                              />
                            )}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <DatePicker
                            required
                            fullWidth
                            label="End Date *"
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            value={endDate}
                            minDate={startDate ? addDays(startDate, 1) : null}
                            maxDate={startDate ? addDays(startDate, 4) : null}
                            onChange={handleEndDateChange}
                            // onChange={(newValue) => {
                            //   if (newValue) {
                            //     handleStartDate(newValue);
                            //     const parseddate = format(newValue, 'yyyy-MM-dd');
                            //     setFieldValue('date_of_travel', parseddate);
                            //   } else {
                            //     setFieldValue('date_of_travel', '');
                            //   }
                            // }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => (
                              <Field
                                component={TextField}
                                size="small"
                                {...params}
                                onKeyDown={(e) => e.preventDefault()}
                              />
                            )}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <TextField
                            required
                            type="number"
                            size="small"
                            label="No of Days"
                            // value={numberOfDays}
                            value="4"
                            InputProps={{
                              readOnly: true
                            }}
                          />
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <TextField label="Reason" value="Health Issue" />
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <TextField size="small" value="MuthuGanesh" label="Project Manager" />
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="project-type-label">PDO Manager</InputLabel>
                        <Select
                          size="small"
                          labelId="Project-type-label"
                          id="Project-select"
                          label="PDO Manager"
                          name="PDO Manager"
                          value="Manager"
                          //   {...getFieldProps('project')}
                          //   error={Boolean(touched.project && errors.project)}
                          //   helperText={touched.project && errors.project}
                          MenuProps={MenuProps}
                        >
                          {managers.map((_x, i) => (
                            <MenuItem key={i} value={_x.designation}>
                              {_x.designation}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        {/* <TextField
                            fullWidth
                            label="Backlogs/Planned Activities"
                            // {...getFieldProps('location_to')}
                            // error={Boolean(touched.location_to && errors.location_to)}
                            // helperText={touched.location_to && errors.location_to}
                          /> */}
                        {/* <div>
                            <ReactQuill
                              style={{ width: 850 }}
                              value={text}
                              onChange={handleChange}
                              modules={modules}
                              placeholder="Planned Activites / Backlogs"
                            />
                          </div> */}
                        <TextField
                          fullWidth
                          label="Backlogs/Planned Activities"
                          value={text}
                          onChange={handleTextChange}
                          onKeyPress={handleKeyPress}
                          multiline
                          variant="outlined"
                        />
                      </Stack>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <FormControl fullWidth>
                        <TextField label="Remarks" />
                      </FormControl>
                      <LoadingButton
                        style={{ marginLeft: '1%', height: 35, marginTop: 15 }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        Approval
                      </LoadingButton>
                      <LoadingButton
                        style={{ marginLeft: '1%', height: 35, marginTop: 15 }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        Reject
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
