/* eslint-disable import/named */
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
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
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
  createUpdateProjectAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser,
  getListOfCalendarAsync
} from '../../redux/slices/projectSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';

export default function CreateProject() {
  // return <Typography variant="h3">Ajay</Typography>;
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const isLoading = useSelector(getIsLoadingFromUser);
  const { calender: userList } = useSelector((state) => state.project);
  const { calender } = useSelector((state) => state.project);
  console.log('9099', calender);
  const navigate = useNavigate();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const NewUserSchema = Yup.object().shape({
    proj_Name: Yup.string().required('Project name is required'),
    description: Yup.string().required('Project Description is required'),
    start_Date: Yup.string().required('Start date is required'),
    calendarName: Yup.string().required('calendar Type is required')
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
      proj_Name: '',
      calendarName: '',
      description: '',
      start_Date: '',
      end_Date: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        const payload = {
          ...values,
          proj_Name: values.proj_Name,
          calendarName: values.calendarName,
          description: values.description,
          start_Date: values.start_Date,
          end_Date: values.end_Date
        };
        await dispatch(createUpdateProjectAsync(payload));
        resetForm();
        enqueueSnackbar('Created successfully', { variant: 'success' });
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // enqueueSnackbar('Creation failed', { variant: 'error' });
        setErrors(error);
      }
      setTimeout(() => navigate('/dashboard/project/project-create'), 1000);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    dispatch(getListOfCalendarAsync());
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

  const title = 'Create Project';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Project Details', href: PATH_DASHBOARD.project.projectCreate },
            { name: 'Create' }
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
                      <TextField
                        required
                        fullWidth
                        label="Project Name"
                        {...getFieldProps('proj_Name')}
                        error={Boolean(touched.proj_Name && errors.proj_Name)}
                        helperText={touched.proj_Name && errors.proj_Name}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Calendar Name *</InputLabel>
                        <Select
                          labelId="Calendar-type-label"
                          id="Calendar-select"
                          label="Calendar Type"
                          name="Calendar Type"
                          {...getFieldProps('calendarName')}
                          error={Boolean(touched.calendarName && errors.calendarName)}
                          helperText={touched.calendarName && errors.calendarName}
                          MenuProps={MenuProps}
                        >
                          {calender.map((_x, i) => (
                            <MenuItem key={i} value={_x.calendarname}>
                              {_x.calendarname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 14, sm: 12 }}>
                        <TextField
                          required
                          fullWidth
                          label="Project Description"
                          {...getFieldProps('description')}
                          rows={2}
                          multiline
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 14, sm: 12 }}>
                        <FormControl fullWidth>
                          <DatePicker
                            required
                            fullWidth
                            label="Start Date *"
                            value={values.start_Date}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                handleStartDate(newValue);
                                const parseddate = format(newValue, 'yyyy-MM-dd');
                                setFieldValue('start_Date', parseddate);
                              } else {
                                setFieldValue('start_Date', '');
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
                            label="End Date *"
                            value={values.end_Date}
                            minDate={endDate}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                handleEndDate(newValue);
                                const parseddate = format(newValue, 'yyyy-MM-dd');
                                setFieldValue('end_Date', parseddate);
                              } else {
                                setFieldValue('end_Date', '');
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
                      </Stack>
                    </Grid>

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
                        CREATE
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
