import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
  Drawer,
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Stack,
  IconButton,
  ListItem,
  List,
  ListItemText,
  Card,
  Divider,
  Tooltip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { format } from 'date-fns';
import { DatePicker } from '@mui/lab';

import Scrollbar from '../../../components/Scrollbar';

TaskEdit.propTypes = {
  isEditEnabled: PropTypes.bool.isRequired,
  setEditRow: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  handleEditSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  managers: PropTypes.array,
  statuses: PropTypes.array,
  projects: PropTypes.array
};

export default function TaskEdit({
  isEditEnabled,
  setEditRow,
  drawerWidth,
  handleEditSave,
  isLoading,
  managers,
  statuses,
  projects
}) {
  const validationSchema = Yup.object().shape({
    manager: Yup.object().required('Manager name is required'),
    project: Yup.object().required('Project name is required'),
    epic: Yup.string().required('EPIC is required'),
    work_load_status: Yup.string().required('Work Load is required'),
    start_date: Yup.string().required('Start date is required'),
    end_date: Yup.string().required('End date is required'),
    comment: Yup.string().max(255)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      manager: null,
      project: '',
      epic: '',
      work_load_status: '',
      start_date: '',
      end_date: '',
      comment: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log(values);
      handleEditSave();
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const activities = [
    {
      id: 1,
      activity: 'Activity 1'
    },
    {
      id: 2,
      activity: 'Activity 1'
    },
    {
      id: 3,
      activity: 'Activity 1'
    }
  ];

  const comments = [
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 2,
      comment: 'Comment 2',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    }
  ];

  return (
    <Drawer anchor="right" open={isEditEnabled} onClose={() => setEditRow(!isEditEnabled)} hideBackdrop>
      <Box m={5} sx={{ width: { sm: 'auto', md: drawerWidth } }} role="presentation">
        <Typography variant="h6" gutterBottom component="div" align="center">
          Edit details
        </Typography>
        <Scrollbar>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl fullWidth error={Boolean(touched.manager && errors.manager)}>
                    <InputLabel id="manager-id-label">Manager</InputLabel>
                    <Select
                      labelId="manager-id-label"
                      id="manager-id"
                      label="Manager Name"
                      size="small"
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
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl fullWidth error={Boolean(touched.project && errors.project)}>
                    <InputLabel id="project-id-label">Project</InputLabel>
                    <Select
                      labelId="project-id-label"
                      id="project-id"
                      label="Project"
                      size="small"
                      {...getFieldProps('project')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {projects.map((_x, i) => (
                        <MenuItem key={i} value={_x}>
                          {_x.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.reportingManager ? errors.reportingManager : null}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    fullWidth
                    label="EPIC"
                    size="small"
                    {...getFieldProps('epic')}
                    error={Boolean(touched.epic && errors.epic)}
                    helperText={touched.epic && errors.epic}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Stack
                    direction={{ xs: 'column', sm: 'column', md: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    justifyContent="space-between"
                  >
                    <DatePicker
                      label="Start Date"
                      value={values.start_date}
                      inputFormat="dd/MM/yyyy"
                      disablePast
                      fullWidth
                      onChange={(newValue) => {
                        if (newValue) {
                          const parseddate = format(newValue, 'yyyy-MM-dd');
                          setFieldValue('start_date', parseddate);
                        } else {
                          setFieldValue('start_date', '');
                        }
                      }}
                      // onChangeRaw={(e) => e.preventDefault()}
                      onKeyDown={(e) => e.preventDefault()}
                      disabled={isLoading}
                      renderInput={(params) => (
                        <Field component={TextField} size="small" {...params} label="Start Date" />
                      )}
                    />
                    <DatePicker
                      label="End Date"
                      value={values.end_date}
                      inputFormat="dd/MM/yyyy"
                      disablePast
                      fullWidth
                      onChange={(newValue) => {
                        if (newValue) {
                          const parseddate = format(newValue, 'yy-MM-dd');
                          setFieldValue('end_date', parseddate);
                        } else {
                          setFieldValue('end_date', '');
                        }
                      }}
                      // onChangeRaw={(e) => e.preventDefault()}
                      onKeyDown={(e) => e.preventDefault()}
                      disabled={isLoading}
                      renderInput={(params) => (
                        <Field component={TextField} size="small" {...params} label="End Date" />
                      )}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="Status-select-label">Work Load </InputLabel>
                    <Select
                      labelId="Status-select-label"
                      id="Status-select"
                      label="Work Load"
                      name="status"
                      {...getFieldProps('work_load')}
                      error={Boolean(touched.epic && errors.epic)}
                      helperText={touched.epic && errors.epic}
                    >
                      {statuses.map((_x, i) => (
                        <MenuItem key={i} value={_x.value}>
                          {_x.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Stack
                    direction={{ xs: 'column', sm: 'column', md: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    justifyContent="space-between"
                  >
                    <TextField fullWidth label="Activity" size="small" />
                    <Tooltip title="Add Activity" placement="top">
                      <IconButton color="primary" aria-label="Add sub epic" component="span">
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>

                {activities.length > 0 && (
                  <Grid item xs={12} sm={12} md={12}>
                    <Card variant="outlined">
                      <List>
                        {activities.map((_x, i) => (
                          <div key={i}>
                            <ListItem
                              secondaryAction={
                                <Tooltip title="Delete activity" placement="top">
                                  <IconButton edge="end" aria-label="delete" size="small" color="info">
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                            >
                              <ListItemText secondary={_x.activity} />
                            </ListItem>
                            <Divider variant="fullWidth" component="li" />
                          </div>
                        ))}
                      </List>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12} sm={12} md={12}>
                  <Stack
                    direction={{ xs: 'column', sm: 'column', md: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    justifyContent="space-between"
                  >
                    <TextField fullWidth multiline maxRows={3} minRows={2} label="Comments" size="small" />
                    <Tooltip title="Add Comments" placement="top">
                      <IconButton color="primary" aria-label="Add comments" component="span">
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Attcahments" placement="top">
                      <IconButton color="primary" aria-label="Attach files" component="span">
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>

                {comments.length > 0 && (
                  <Grid item xs={12} sm={12} md={12}>
                    <Card variant="outlined">
                      <List>
                        {comments.map((_x, i) => (
                          <div key={i}>
                            <ListItem
                              secondaryAction={
                                <Tooltip title="Delete comment" placement="top">
                                  <IconButton edge="end" aria-label="delete" size="small" color="info">
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                            >
                              <ListItemText
                                primary={_x.comment}
                                secondary={`By ${_x.created_by} at ${format(_x.created_at, 'yy-MMM-dd HH:mm:ss')}`}
                              />
                              <IconButton edge="start" aria-label="delete" size="small" color="info">
                                <DownloadingIcon />
                              </IconButton>
                            </ListItem>
                            <Divider variant="fullWidth" component="li" />
                          </div>
                        ))}
                      </List>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12} sm={12} md={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ClearIcon />}
                    onClick={() => setEditRow(!isEditEnabled)}
                    disabled={isLoading}
                  >
                    Close
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Button variant="contained" fullWidth type="submit" startIcon={<SaveIcon />} disabled={isLoading}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Scrollbar>
      </Box>
    </Drawer>
  );
}
