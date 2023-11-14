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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SendIcon from '@mui/icons-material/Send';
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

export default function EodStatus() {
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
  const [text, setText] = useState('• ');

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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const [tableData, setTableData] = useState([
    {
      time: '1st hours',
      taskPlan: ''
    },
    {
      time: '2nd hours',
      taskPlan: ''
    },
    {
      time: '3rd hours',
      taskPlan: ''
    },
    {
      time: '4th hours',
      taskPlan: ''
    },
    {
      time: '5th hours',
      taskPlan: ''
    },
    {
      time: '6th hours',
      taskPlan: ''
    },
    {
      time: '7th hours',
      taskPlan: ''
    },
    {
      time: '8th hours',
      taskPlan: ''
    }
  ]);

  const handleInputChange = (index, header, value) => {
    const updatedData = [...tableData];
    updatedData[index][header] = value;
    setTableData(updatedData);
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

  const title = 'EOD Entry';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" component="h1" paragraph>
          Task Entry
        </Typography>
        <FormikProvider value={formik}>
          <Form noValiddate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={10}>
                <Card sx={{ p: 1, mt: -2 }}>
                  <Stack spacing={2}>
                    {status === 'Reviewed' && (
                      <Alert severity="info">
                        <AlertTitle>Reviewed</AlertTitle>Remarks: Your timesheet for the day has been approved by your
                        manager
                      </Alert>
                    )}
                  </Stack>
                  <Stack spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <DatePicker
                            required
                            label="From Date"
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
                            label="End Date"
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
                          <TextField multiline rows={2} required label="Manager Commends" />
                        </FormControl>
                      </Stack>
                    </Grid>

                    <Stack
                      direction={{ xs: 'column', sm: 'column', md: 'row' }}
                      // spacing={{ xs: 1, sm: 1, md: 4 }}
                      // justifyContent="space-between"
                    >
                      <FormControl fullWidth sx={{ mt: -5, ml: 5 }}>
                        <Typography>Day 1</Typography>
                      </FormControl>
                      <FormControl fullWidth sx={{ mt: -5, ml: -10 }}>
                        <Typography>30/10/2023</Typography>
                      </FormControl>
                    </Stack>
                    <div style={{ marginTop: -10 }}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ p: 0 }}>Time</TableCell>
                              <TableCell sx={{ p: 0 }}>Task Plan</TableCell>
                              <TableCell sx={{ p: 0 }}>
                                <LoadingButton
                                  sx={{ ml: -15.8 }}
                                  size="small"
                                  type="submit"
                                  startIcon={<NavigateNextIcon />}
                                  loading={isSubmitting || isLoading}
                                >
                                  Next
                                </LoadingButton>
                                <LoadingButton
                                  sx={{ ml: 1 }}
                                  size="small"
                                  type="submit"
                                  loading={isSubmitting || isLoading}
                                >
                                  Submit
                                </LoadingButton>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tableData.map((rowData, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ p: 0 }}>
                                  <TextField
                                    disabled
                                    size="small"
                                    sx={{ width: 100 }}
                                    value={rowData.time}
                                    onChange={(e) => handleInputChange(index, 'time', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell sx={{ p: 0 }}>
                                  <TextField
                                    sx={{ width: 700 }}
                                    size="small"
                                    value={rowData.taskPlan}
                                    onChange={(e) => handleInputChange(index, 'taskPlan', e.target.value)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
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
