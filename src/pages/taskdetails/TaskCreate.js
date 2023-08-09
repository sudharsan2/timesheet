import * as Yup from 'yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';

import { DatePicker, LoadingButton } from '@mui/lab';

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
import { createDispatchHook, useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  createOrUpdateManagerAsync,
  getListOfManagerTypeAsync,
  getListofManagerNamesAsync,
  getListOfpriorityAsync,
  getListOfStatusAsync,
  getListOfProjectsAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser
} from '../../redux/slices/taskSlice';

import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { MIconButton } from '../../components/@material-extend';

// ----------------------------------------------------------------------

/**
 * TODO Intergrate with service donot use this
 */

export default function TaskCreate() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();

  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const title = 'CREATE TASK';

  const { types } = useSelector((state) => state.task);
  const { names } = useSelector((state) => state.task);
  const { client } = useSelector((state) => state.task);
  const { priority } = useSelector((state) => state.task);
  const { status } = useSelector((state) => state.task);

  const NewUserSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    client: Yup.string().required('Client is required'),
    date_assiened: Yup.string().required('Date Assigned is required'),
    target_completion_date: Yup.string().required('Target Completion Date is required'),

    assigned_to: Yup.string().required('Assigned To is required'),
    description: Yup.string().required('Description is required'),
    priority: Yup.string().required('Priority is required'),
    status: Yup.string().required('Status is required'),
    remarks: Yup.string().required('Remarks is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: '',
      client: '',
      date_assiened: '',
      target_completion_date: '',

      assigned_to: '',
      description: '',
      priority: '',
      status: '',
      remarks: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,

          client: values.client,
          date_assiened: values.date_assiened,
          target_completion_date: values.target_completion_date,

          assigned_to: values.assigned_to,
          description: values.description,
          priority: values.priority,
          status: values.status,
          remarks: values.remarks
        };
        await dispatch(createOrUpdateManagerAsync(payload));

        setSubmitting(false);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('Creation failed', { variant: 'error' });
        setErrors(error);
      }
      navigate(PATH_DASHBOARD.task.taskList);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectClient, setSelectedClient] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

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
    dispatch(getListOfManagerTypeAsync());
    dispatch(getListofManagerNamesAsync());
    dispatch(getListOfpriorityAsync());
    dispatch(getListOfStatusAsync());
    dispatch(getListOfProjectsAsync());
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

      setFieldValue('type', '');
      setFieldValue('client', '');
      setFieldValue('date_assiened', '');
      setFieldValue('target_completion_date', '');
      setFieldValue('assigned_to', '');

      setFieldValue('description', '');
      setFieldValue('priority', '');
      setFieldValue('status', '');
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
            { name: 'Task Details', href: PATH_DASHBOARD.task.taskList },
            { name: 'Create' }
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
                      <FormControl fullWidth error={Boolean(touched.type && errors.type)}>
                        <Autocomplete
                          disablePortal
                          autoHighlight
                          id="type-id"
                          value={selectedDesignation}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedDesignation(newValue);
                              setFieldValue('type', newValue.value);
                            } else {
                              setSelectedDesignation('');
                              setFieldValue('type', '');
                            }
                          }}
                          options={types}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.value || ''}
                          getOptionSelected={(option, value) => option.value === value.value}
                          renderInput={(params) => <Field component={TextField} {...params} label="Type" />}
                        />

                        <FormHelperText>{errors.type ? errors.type : null}</FormHelperText>
                      </FormControl>

                      <FormControl fullWidth error={Boolean(touched.client && errors.client)}>
                        <Autocomplete
                          id="client"
                          value={selectClient}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedClient(newValue);
                              setFieldValue('client', newValue.projectName);
                            } else {
                              setSelectedClient('');
                              setFieldValue('client', '');
                            }
                          }}
                          options={client}
                          isOptionEqualToValue={(option, value) => option.projectName === value.projectName}
                          getOptionLabel={(option) => option.projectName || ''}
                          getOptionSelected={(option, value) => option.projectName === value.projectName}
                          renderInput={(params) => <Field component={TextField} {...params} label="Client" />}
                        />

                        <FormHelperText>{errors.client ? errors.client : null}</FormHelperText>
                      </FormControl>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(touched.assigned_to && errors.assigned_to)}>
                        <Autocomplete
                          id="assigned_to"
                          value={selectedManager}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedManager(newValue);
                              setFieldValue('assigned_to', newValue.value);
                            } else {
                              setSelectedManager('');
                              setFieldValue('assigned_to', '');
                            }
                          }}
                          options={names}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.value || ''}
                          getOptionSelected={(option, value) => option.value === value.value}
                          renderInput={(params) => <Field component={TextField} {...params} label="Assigned To" />}
                        />

                        <FormHelperText>{errors.assigned_to ? errors.assigned_to : null}</FormHelperText>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Task Details"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(touched.priority && errors.priority)}>
                        <Autocomplete
                          id="priority"
                          value={selectedPriority || {}}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedPriority(newValue);
                              setFieldValue('priority', newValue.value);
                            } else {
                              setSelectedPriority('');
                              setFieldValue('priority', '');
                            }
                          }}
                          options={priority}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.value || ''}
                          getOptionSelected={(option, value) => option.value === value.value}
                          renderInput={(params) => <Field component={TextField} {...params} label="Priority" />}
                        />

                        <FormHelperText>{errors.priority ? errors.priority : null}</FormHelperText>
                      </FormControl>

                      <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                        <Autocomplete
                          id="status"
                          value={selectedStatus || {}}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedStatus(newValue);

                              setFieldValue('status', newValue.value);
                            } else {
                              setSelectedStatus('');

                              setFieldValue('status', '');
                            }
                          }}
                          options={status}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.value || ''}
                          getOptionSelected={(option, value) => option.value === value.value}
                          renderInput={(params) => <Field component={TextField} {...params} label="Status" />}
                        />

                        <FormHelperText>{errors.status ? errors.status : null}</FormHelperText>
                      </FormControl>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        multiline
                        {...getFieldProps('remarks')}
                        error={Boolean(touched.remarks && errors.remarks)}
                        helperText={touched.remarks && errors.remarks}
                      />
                    </Stack>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 14, sm: 12 }}>
                        <DatePicker
                          label="Target Date"
                          value={values.date_assiened}
                          inputFormat="dd/MM/yyyy"
                          disablePast
                          fullWidth
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('date_assiened', parseddate);
                            } else {
                              setFieldValue('date_assiened', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="Assign Date" />
                          )}
                        />
                        <DatePicker
                          label="Final Completion Date"
                          value={values.target_completion_date}
                          inputFormat="dd/MM/yyyy"
                          disablePast
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('target_completion_date', parseddate);
                            } else {
                              setFieldValue('target_completion_date', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="Final  Date" />
                          )}
                        />
                      </Stack>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
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
