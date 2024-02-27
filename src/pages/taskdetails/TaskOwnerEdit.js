import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';

import { DatePicker, LoadingButton } from '@mui/lab';

import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  FormHelperText,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  getListOfManagerTypeAsync,
  getListofManagerNamesAsync,
  getListOfpriorityAsync,
  getListOfStatusAsync,
  getListOfProjectsAsync,
  getListOfManagerType,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser,
  ManagersStatusChangeAsync
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

export default function TaskOwnerEdit() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { themeStretch } = useSettings();
  const isLoading = useSelector(getIsLoadingFromUser);

  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const title = 'EDIT TASK';
  const { tasks } = useSelector((state) => state.task);

  const types = useSelector(getListOfManagerType);
  const { names } = useSelector((state) => state.task);
  const { client } = useSelector((state) => state.task);
  const { priority } = useSelector((state) => state.task);
  const { status } = useSelector((state) => state.task);

  const taskDetails = tasks.find((_x) => _x.manager_id === Number(params.type));

  console.log('userdetails', taskDetails);

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
    type: Yup.string().required('Type is required'),
    client: Yup.string().required('Client is required'),
    date_assiened: Yup.string().required('Date Assigned is required'),
    target_completion_date: Yup.string().required('Target Completion Date is required'),
    assigned_by: Yup.string().required('Assigned By is required'),
    assigned_to: Yup.string().required('Assigned To is required'),
    description: Yup.string().required('Description is required'),
    priority: Yup.string().required('Priority is required'),
    status: Yup.string().required('Status is required'),
    remarks: Yup.string().required('Remarks is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      manager_id: taskDetails.manager_id || '',
      type: taskDetails.type || '',
      client: taskDetails.client || '',
      date_assiened: taskDetails.date_assiened || '',
      target_completion_date: taskDetails.target_completion_date || '',
      assigned_by: taskDetails.assigned_by || '',
      assigned_to: taskDetails.assigned_to || '',
      description: taskDetails.description || '',
      priority: taskDetails.priority || '',
      status: taskDetails.status || '',
      remarks: taskDetails.remarks || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          type: values.type,
          client: values.client,
          date_assiened: values.date_assiened,
          target_completion_date: values.target_completion_date,
          assigned_by: values.assigned_by,
          assigned_to: values.assigned_to,
          description: values.description,
          priority: values.priority,
          status: values.status,
          remarks: values.remarks
        };
        await dispatch(ManagersStatusChangeAsync(payload));

        setSubmitting(false);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('Update failed', { variant: 'error' });
        setErrors(error);
      }
      navigate(PATH_DASHBOARD.task.taskList);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    dispatch(getListOfManagerTypeAsync());
    dispatch(getListofManagerNamesAsync());
    dispatch(getListOfpriorityAsync());
    dispatch(getListOfStatusAsync());
    dispatch(getListOfProjectsAsync());
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
                      <FormControl fullWidth variant="outlined" size="large">
                        <InputLabel id="Type-select-label">Type</InputLabel>
                        <Select
                          labelId="Type-select-label"
                          id="Type-select"
                          label="Type"
                          name="Type"
                          {...getFieldProps('type')}
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                        >
                          {types.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="large"
                        error={Boolean(touched.client && errors.client)}
                      >
                        <InputLabel id="Client-select-label">Client</InputLabel>
                        <Select
                          labelId="Client-select-label"
                          id="Client-select"
                          name="Client"
                          label="Client"
                          MenuProps={MenuProps}
                          defaultValue=""
                          {...getFieldProps('client')}
                        >
                          {client.map((_x, i) => (
                            <MenuItem key={i} value={_x.projectName}>
                              {_x.projectName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.client ? errors.client : null}</FormHelperText>
                      </FormControl>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth variant="outlined" size="large">
                        <InputLabel id="assigned_to-select-label">Assigned_To</InputLabel>
                        <Select
                          labelId="assigned_to-select-label"
                          id="assigned_to-select"
                          label="Assigned_To"
                          name="Assigned_To"
                          {...getFieldProps('assigned_to')}
                          error={Boolean(touched.assigned_to && errors.assigned_to)}
                          helperText={touched.assigned_to && errors.assigned_to}
                        >
                          {names.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
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
                      <FormControl fullWidth variant="outlined" size="large">
                        <InputLabel id="Priority-select-label">Priority</InputLabel>
                        <Select
                          labelId="Priority-select-label"
                          id="Priority-select"
                          label="Priority"
                          name="Priority"
                          {...getFieldProps('priority')}
                          error={Boolean(touched.priority && errors.priority)}
                          helperText={touched.priority && errors.priority}
                        >
                          {priority.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth variant="outlined" size="large">
                        <InputLabel id="Status-select-label">Status</InputLabel>
                        <Select
                          labelId="Status-select-label"
                          id="Status-select"
                          label="Status"
                          name="Status"
                          {...getFieldProps('status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
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
                      <TextField
                        fullWidth
                        label="Remarks"
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
                          fullWidth
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('target_completion_date', parseddate);
                            } else {
                              setFieldValue('target_completion_date', '');
                            }
                          }}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="Final Completion Date" />
                          )}
                        />
                      </Stack>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
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
