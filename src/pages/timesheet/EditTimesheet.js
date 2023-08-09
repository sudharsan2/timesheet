import * as Yup from 'yup';
import React from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  TextField,
  Stack,
  Card,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CardContent,
  CardHeader,
  Button,
  Container,
  FormHelperText,
  IconButton
} from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker } from '@mui/lab';
import {
  getIsLoadingFromTS,
  createTimeSheetEntryAsync,
  getCategoryLOVAsync,
  getCategoryLOVFromTS,
  getDateFromTS,
  getEditTimesheetListFromTS,
  getStatusLOVAsync,
  getStatusLOVFromTS,
  getProjectLOVFromTS,
  getProjectLOVAsync,
  getTimesheetIdFromTS
} from '../../redux/slices/timesheetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';

export default function EditTimsheet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryLOV = useSelector(getCategoryLOVFromTS);
  const status = useSelector(getStatusLOVFromTS);
  const projectLOV = useSelector(getProjectLOVFromTS);
  const timesheetId = useSelector(getTimesheetIdFromTS);
  const values = useSelector(getEditTimesheetListFromTS);
  const date = useSelector(getDateFromTS);
  const { themeStretch } = useSettings();
  const title = 'Edit Timesheet';
  const isLoading = useSelector(getIsLoadingFromTS);
  const [buttonState, setButtonState] = React.useState('Save');

  const ResetPasswordSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    project: Yup.string().required('Project is required'),
    description: Yup.string().required('Description is required'),
    timespent: Yup.string().required('Timespent is required'),
    status: Yup.string().required('Status is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: values.category || '',
      project: values.project || '',
      description: values.activity || '',
      timespent: values.minutes || '',
      status: values.status || '',
      remarks: values.remarks || ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log('here');
      try {
        const payload = {
          submitPayload: {
            requestHeader: {
              SourceSystem: '',
              UUID: '',
              TimeStamp: ''
            },
            requestData: {
              timesheetId,
              date: date.date,
              hours: date.hours,
              minutes: date.minutes.toString(),
              usercomments: values.remarks,
              action: buttonState,
              taskDetails: [
                {
                  taskId: date.taskId,
                  phase: '',
                  activity: values.description,
                  minutes: values.timespent,
                  project: values.project,
                  category: values.category,
                  remarks: values.remarks,
                  status: values.status
                }
              ]
            }
          },
          queryPayload: {
            requestHeader: {
              SourceSystem: '',
              UUID: '',
              TimeStamp: ''
            },
            requestData: {
              date: date.date
            }
          }
        };
        dispatch(createTimeSheetEntryAsync(payload));
        resetForm();
        navigate(PATH_DASHBOARD.timesheet.timesheet);
      } catch (err) {
        console.log(err);
      }
    }
  });

  const { errors, touched, isSubmitting, submitForm, handleSubmit, getFieldProps } = formik;

  const handleSubmission = (state) => {
    setButtonState(state);
    submitForm();
  };

  const handleBack = () => {
    navigate(PATH_DASHBOARD.timesheet.timesheet);
  };

  React.useEffect(() => {
    dispatch(getCategoryLOVAsync());
    dispatch(getStatusLOVAsync());
    dispatch(getProjectLOVAsync());
  }, [dispatch]);

  return (
    <div>
      <Page title={title}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={title}
            links={[
              { name: 'Dashboard', href: '/' },
              { name: 'Timesheet', href: PATH_DASHBOARD.timesheet.timesheet },
              { name: 'Edit Timesheet' }
            ]}
          />
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader
                    title="Enter Your Daily Activity"
                    action={
                      <>
                        <DatePicker
                          label="Date"
                          value={date.date || ''}
                          inputFormat="dd/MM/yyyy"
                          disableFuture
                          // minDate={previousWeek}
                          onChange={(newValue) => {
                            console.log(newValue);
                          }}
                          disabled
                          renderInput={(params) => <TextField size="small" {...params} />}
                        />{' '}
                        <MHidden width="lgDown">
                          <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            disabled={isSubmitting || isLoading}
                          >
                            Back
                          </Button>{' '}
                          <Button
                            variant="contained"
                            onClick={() => handleSubmission('Save')}
                            startIcon={<SaveIcon />}
                            disabled={isSubmitting || isLoading}
                          >
                            Save
                          </Button>
                        </MHidden>
                        <MHidden width="lgUp">
                          <IconButton color="primary" aria-label="back" component="span">
                            <ArrowBackIcon />
                          </IconButton>
                          <IconButton color="primary" aria-label="save" component="span">
                            <SaveIcon />
                          </IconButton>
                        </MHidden>
                      </>
                    }
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <Grid container spacing={5}>
                        <Grid item xs={12} sm={12} md={3}>
                          <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                              labelId="category-select-label"
                              id="category-select"
                              label="Category"
                              name="category"
                              {...getFieldProps('category')}
                            >
                              {categoryLOV.map((_x, i) => (
                                <MenuItem key={i} value={_x.value}>
                                  {_x.value}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={Boolean(touched.project && errors.project)}
                          >
                            <InputLabel id="Project-select-label">Project</InputLabel>
                            <Select
                              labelId="Project-select-label"
                              id="Project-select"
                              name="Project"
                              label="Project"
                              defaultValue=""
                              {...getFieldProps('project')}
                            >
                              {projectLOV.map((_x, i) => (
                                <MenuItem key={i} value={_x.projectName}>
                                  {_x.projectName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{errors.project ? errors.project : null}</FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={3}>
                          <FormControl fullWidth variant="outlined" size="small">
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
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            {...getFieldProps('timespent')}
                            type="number"
                            label="Time Spent(IN MINS)"
                            error={Boolean(touched.timespent && errors.timespent)}
                            helperText={touched.timespent && errors.timespent}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <TextField
                            fullWidth
                            multiline
                            size="small"
                            {...getFieldProps('description')}
                            maxRows={4}
                            label="Activity Description"
                            error={Boolean(touched.description && errors.description)}
                            helperText={touched.description && errors.description}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <TextField
                            multiline
                            maxRows={4}
                            fullWidth
                            size="small"
                            {...getFieldProps('remarks')}
                            label="Remarks / Comments (if any)"
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Form>
          </FormikProvider>
        </Container>
      </Page>
    </div>
  );
}
