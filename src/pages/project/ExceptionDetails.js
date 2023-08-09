import * as Yup from 'yup';
import {
  Container,
  TextField,
  Grid,
  FormHelperText,
  Card,
  Stack,
  FormControl,
  Box,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import {
  exceptionOnOffAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser,
  getListOfCalendarAsync
} from '../../redux/slices/projectSlice';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';

export default function ExceptionDetails() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const title = 'Exception List';
  const navigate = useNavigate();
  const { tasks } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoadingFromUser);
  const params = useParams();
  const { projects } = useSelector((state) => state.proj);
  console.log('cal', projects);

  const ExceptionDetails = projects.find((_x) => _x.proj_Id === Number(params.projId));

  console.log('projectdetails', ExceptionDetails);

  const click = () => {
    navigate('/dashboard/project/project-create');
  };

  const NewUserSchema = Yup.object().shape({
    description: Yup.string().required('Exception Description is required'),
    exception: Yup.string().required('Exception is required'),
    date: Yup.string().required('Exception Date is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      proj_Id: ExceptionDetails.proj_Id || '',
      proj_Name: ExceptionDetails.proj_Name || '',
      calendarName: ExceptionDetails.calendarName || '',
      description: '',
      exception: ExceptionDetails.exception || '',
      date: ExceptionDetails.date || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        const payload = {
          ...values,
          proj_Id: values.proj_Id,
          proj_Name: values.proj_Name,
          calendarName: values.calendarName,
          description: values.description,
          exception: values.exception,
          date: values.date
        };
        await dispatch(exceptionOnOffAsync(payload));
        resetForm();
        setSubmitting(false);
        // enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('Update failed', { variant: 'error' });
        setErrors(error);
      }
    }
  });

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const exceptions = [{ value: 'ON' }, { value: 'OFF' }];
  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Project Details', href: PATH_DASHBOARD.project.projectCreate },
            { name: 'Exception' }
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
                      <TextField
                        fullWidth
                        disabled
                        label="Project Name"
                        {...getFieldProps('proj_Name')}
                        error={Boolean(touched.proj_Name && errors.proj_Name)}
                        helperText={touched.proj_Name && errors.proj_Name}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        disabled
                        label="Calendar Name"
                        {...getFieldProps('calendarName')}
                        error={Boolean(touched.calendarName && errors.calendarName)}
                        helperText={touched.calendarName && errors.calendarName}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        rows={2}
                        multiline
                        label="Holiday Description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth variant="outlined" size="large">
                        <InputLabel id="Exception-list">Exception</InputLabel>
                        <Select
                          labelId="Exception-list"
                          id="Exception-list"
                          label="Exception"
                          name="Exception"
                          {...getFieldProps('exception')}
                          error={Boolean(touched.exception && errors.exception)}
                          helperText={touched.exception && errors.exception}
                        >
                          {exceptions.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth variant="outlined" size="large">
                        <DatePicker
                          label="Date"
                          value={values.date}
                          inputFormat="dd/MM/yyyy"
                          // disablePast
                          fullWidth
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('date', parseddate);
                            } else {
                              setFieldValue('date', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="Date" />
                          )}
                        />
                      </FormControl>
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton variant="contained" onClick={click}>
                        CANCEL
                      </LoadingButton>
                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        UPDATE
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
