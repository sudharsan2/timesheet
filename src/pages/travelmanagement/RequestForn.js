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
import { MultiSelect } from 'primereact/multiselect';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
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
import { getProjectLOVFromTS, getProjectLOVAsync } from '../../redux/slices/timesheetSlice';
import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
// import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';

export default function RequestForm() {
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
  console.log('9099', calender);
  const navigate = useNavigate();

  const [selectedCities, setSelectedCities] = useState(null);

  const timesZone = [
    { value: 'ACWST' },
    { value: 'ACST' },
    { value: 'AEST' },
    { value: 'AFT' },
    { value: 'AKDT' },
    { value: 'ANAT' },
    { value: 'AOE' },
    { value: 'ART' },
    { value: 'BST' },
    { value: 'CDT' },
    { value: 'CEST' },
    { value: 'CHAST' },
    { value: 'CST' },
    { value: 'CVT' },
    { value: 'EDT' },
    { value: 'EEST' },
    { value: 'GST' },
    { value: 'HDT' },
    { value: 'HST' },
    { value: 'IRST' },
    { value: 'IST' },
    { value: 'JST' },
    { value: 'LHST' },
    { value: 'LINT' },
    { value: 'MART' },
    { value: 'MMT' },
    { value: 'NDT' },
    { value: 'NPT' },
    { value: 'NUT' },
    { value: 'PDT' },
    { value: 'SBT' },
    { value: 'SCT' },
    { value: 'TOT' },
    { value: 'UZT' },
    { value: 'WGST' },
    { value: 'WIB' }
  ];

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleCheckbox = (event) => {
    setIsCheck(event.target.checked);
  };

  const handleCheckboxChanges = (event) => {
    setIsCheckeds(event.target.checkeds);
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

  const title = 'Request Form';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Create Request', href: PATH_DASHBOARD.travel.travelSummary },
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
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="project-type-label">Project Name *</InputLabel>
                        <Select
                          size="small"
                          labelId="Project-type-label"
                          id="Project-select"
                          label="Project Name"
                          name="Project Name"
                          {...getFieldProps('project')}
                          error={Boolean(touched.project && errors.project)}
                          helperText={touched.project && errors.project}
                          MenuProps={MenuProps}
                        >
                          {projects.map((_x, i) => (
                            <MenuItem key={i} value={_x.proj_Name}>
                              {_x.proj_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <DatePicker
                            required
                            fullWidth
                            label="Date of Travel *"
                            value={values.date_of_travel}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                handleStartDate(newValue);
                                const parseddate = format(newValue, 'yyyy-MM-dd');
                                setFieldValue('date_of_travel', parseddate);
                              } else {
                                setFieldValue('date_of_travel', '');
                              }
                            }}
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
                            size="small"
                            label="Time"
                            {...getFieldProps('time')}
                            error={Boolean(touched.time && errors.time)}
                            helperText={touched.time && errors.time}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel id="timezone-type-label">Time ZOne *</InputLabel>
                          <Select
                            size="small"
                            labelId="timezone-type-label"
                            id="timezone-select"
                            label="Time Zone"
                            name="Time Zone"
                            {...getFieldProps('time_zone')}
                            error={Boolean(touched.time_zone && errors.time_zone)}
                            helperText={touched.time_zone && errors.time_zone}
                            MenuProps={MenuProps}
                          >
                            {timesZone.map((_x, i) => (
                              <MenuItem key={i} value={_x.value}>
                                {_x.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel id="travel-type-label">Travel Mode</InputLabel>
                          <Select
                            size="small"
                            labelId="travel-type-label"
                            id="travel-select"
                            label="Travel Mode"
                            name="Travel Mode"
                            {...getFieldProps('travel_mode')}
                            error={Boolean(touched.travel_mode && errors.travel_mode)}
                            helperText={touched.travel_mode && errors.travel_mode}
                            MenuProps={MenuProps}
                          >
                            {modeofTravel.map((_x, i) => (
                              <MenuItem key={i} value={_x.value}>
                                {_x.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* <div className="card flex justify-content-center" style={{ width: '100%' }}> */}
                        {/* <FormControl fullWidth>
                            <MultiSelect
                              // style={{ width: 840, height: 55 }}
                              fullWidth
                              options={modeofTravel}
                              optionLabel="value"
                              optionValue="value"
                              filter
                              placeholder="Travel Mode"
                              maxSelectedLabels={7}
                              {...getFieldProps('empNames')}
                              className="w-full"
                            />
                          </FormControl>
                        </div> */}
                        <TextField
                          required
                          fullWidth
                          size="small"
                          label="Location From"
                          {...getFieldProps('location_from')}
                          error={Boolean(touched.location_from && errors.location_from)}
                          helperText={touched.location_from && errors.location_from}
                        />
                        <TextField
                          required
                          fullWidth
                          size="small"
                          label="Location To"
                          {...getFieldProps('location_to')}
                          error={Boolean(touched.location_to && errors.location_to)}
                          helperText={touched.location_to && errors.location_to}
                        />
                      </Stack>
                    </Grid>
                    <div style={{ marginLeft: '1%' }}>
                      <Stack direction={{ xs: 'row', sm: 'row' }} spacing={{ xs: 3, sm: 1 }}>
                        <Checkbox
                          sx={{ marginTop: '-2%' }}
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          label="label"
                        />
                        <Typography sx={{ marginTop: '0%' }}>Accommodation</Typography>
                        <Checkbox
                          sx={{ marginTop: '-2%' }}
                          checked={isCheck}
                          onChange={handleCheckbox}
                          label="label"
                        />{' '}
                        <Typography sx={{ marginTop: '0%' }}>Office guest house</Typography>
                        {/* <FormControlLabel control={<Checkbox />} label="Office Guest House" /> */}
                        {/* <Typography sx={{ fontWeight: 'bold' }}>Office guest house</Typography> */}
                      </Stack>

                      {isChecked && (
                        <Grid item xs={12} sm={12} md={12}>
                          <Stack
                            sx={{ marginTop: '2%' }}
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 3, sm: 2 }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label="Hotel Location"
                              {...getFieldProps('acc_location;')}
                              error={Boolean(touched.acc_location && errors.acc_location)}
                              helperText={touched.acc_location && errors.acc_location}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              label="Hotel Name"
                              {...getFieldProps('hotel_name')}
                              error={Boolean(touched.hotel_name && errors.hotel_name)}
                              helperText={touched.hotel_name && errors.hotel_name}
                            />
                          </Stack>
                          <Stack
                            sx={{ marginTop: '2%' }}
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 3, sm: 2 }}
                          >
                            {/* <FormControl fullWidth>
                              <DatePicker
                                required
                                fullWidth
                                label="CheckIn Date *"
                                value={values.checkin_date_time}
                                inputFormat="dd/MM/yyyy"
                                disablePast
                                onChange={(newValue) => {
                                  if (newValue) {
                                    handleStartDate(newValue);
                                    const parseddate = format(newValue, 'yyyy-MM-dd');
                                    setFieldValue('checkin_date_time', parseddate);
                                  } else {
                                    setFieldValue('checkin_date_time', '');
                                  }
                                }}
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
                            </FormControl> */}
                            {/* <TextField
                              required
                              fullWidth
                              size="small"
                              label="Time"
                              {...getFieldProps('time')}
                              error={Boolean(touched.description && errors.description)}
                              helperText={touched.description && errors.description}
                            /> */}
                            <FormControl fullWidth>
                              <DatePicker
                                required
                                fullWidth
                                label="CheckIn Date"
                                value={values.checkin_date_time}
                                inputFormat="dd/MM/yyyy"
                                disablePast
                                onChange={(newValue) => {
                                  if (newValue) {
                                    handleStartDate(newValue);
                                    const parseddate = format(newValue, 'yyyy-MM-dd');
                                    setFieldValue('checkin_date_time', parseddate);
                                  } else {
                                    setFieldValue('checkin_date_time', '');
                                  }
                                }}
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
                                fullWidth
                                label="CheckOut Date"
                                value={values.checkout_date_time}
                                minDate={endDate}
                                inputFormat="dd/MM/yyyy"
                                disablePast
                                onChange={(newValue) => {
                                  if (newValue) {
                                    handleEndDate(newValue);
                                    const parseddate = format(newValue, 'yyyy-MM-dd');
                                    setFieldValue('checkout_date_time', parseddate);
                                  } else {
                                    setFieldValue('checkout_date_time', '');
                                  }
                                }}
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
                            {/* <TextField
                              required
                              fullWidth
                              size="small"
                              label="Time"
                              {...getFieldProps('time')}
                              error={Boolean(touched.description && errors.description)}
                              helperText={touched.description && errors.description}
                            /> */}
                          </Stack>
                        </Grid>
                      )}
                    </div>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      {/* <LoadingButton variant="contained" onClick={click}>
                          CANCEL
                        </LoadingButton> */}

                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        SUBMIT
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
