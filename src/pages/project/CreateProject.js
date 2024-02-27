/* eslint-disable import/named */
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Container,
  Card,
  Button,
  Stack,
  TextField,
  Box,
  InputLabel,
  Select,
  TableBody,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import DateFnsUtils from '@date-io/date-fns';
import * as Yup from 'yup';
import axios from 'axios';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { Dropdown } from 'primereact/dropdown';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import { MultiSelect } from 'primereact/multiselect';
// import { Form, FormikProvider, useFormik, Field } from 'formik';
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
import { getListofNamesAsync, getListofNames } from '../../redux/slices/assetSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';

/*eslint-disable*/

export default function CreateProject() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const isLoading = useSelector(getIsLoadingFromUser);
  const [loading, setLoading] = React.useState(false);
  const { calender: userList } = useSelector((state) => state.project);
  const { calender } = useSelector((state) => state.project);
  console.log('9099', calender);
  const navigate = useNavigate();
  const [selectedProjectType, setSelectedProjectType] = useState('Support');
  const [milestoneNumber, setMilestoneNumber] = useState('');
  const { employees } = useSelector((state) => state.asset);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [projType, setProjType] = useState('');
  const [projName, setProjName] = useState('');
  const [projManager, setProjManager] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [statusLOV, setStatusLOV] = useState([]);
  const [description, setDesc] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actual, setActual] = useState('');
  const token = localStorage.getItem('accessToken');
  const [isChecked, setIsChecked] = useState(false);
  const [review_Status, setReviewStatus] = useState('N'); // Initialize to 'N'
  const [endDateDisabled, setEndDateDisabled] = useState(true);
  const [endDateError, setEndDateError] = useState('');

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    // Enable the "End Date" input when a "Start Date" is selected
    setEndDateDisabled(false);
  };

  const handleEndDateChange = (event) => {
    const selectedEndDate = event.target.value;

    if (selectedEndDate >= startDate) {
      setEndDate(selectedEndDate);
      setEndDateError('');
    } else {
      setEndDateError('End date must be greater than or equal to the start date');
    }
  };

  const handleCheckboxChange = (event) => {
    const valueToSend = event.target.checked ? 'Y' : 'N';
    setIsChecked(event.target.checked);
    setReviewStatus(event.target.checked ? 'Y' : 'N'); // Update review_Status based on checkbox state
    console.log(valueToSend);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 120
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date();

    const selectedDateObject = new Date(selectedDate);

    if (selectedDateObject < currentDate) {
      return;
    }

    setStartDate(selectedDate);
  };

  const NewUserSchema = Yup.object().shape({
    proj_Name: Yup.string().required('Project name is required'),
    description: Yup.string().required('Project Description is required'),
    start_Date: Yup.string().required('Start date is required'),
    calendarName: Yup.string().required('calendar Type is required')
  });

  const handleStartDate = (value) => {
    setStartDate(value);
    setEndDate(value);
  };

  const handleEndDate = (value) => {
    setEndDate(value);
  };

  const [tableData, setTableData] = useState([
    {
      milestone_Number: '1',
      milestone_Description: '',
      status: '',
      target_Date: '',
      actual_Date: '',
      remarks: ''
    }
  ]);

  const endChange = (event) => {
    const selectedEndDate = event.target.value;
    if (selectedEndDate >= startDate) {
      setEndDate(selectedEndDate);
      setEndDateError('');
    } else {
      setEndDateError('End date must be greater than or equal to the start date');
    }
  };

  const startChange = (event) => {
    const selectedStartDate = event.target.value;
    setStartDate(selectedStartDate);
    if (endDate && selectedStartDate >= endDate) {
      setEndDate('');
      setEndDateError('End date must be greater than the start date');
    } else {
      setEndDateError('');
    }
  };

  const addRow = () => {
    const highestMilestoneNumber = Math.max(...tableData.map((row) => parseInt(row.milestone_Number, 10)));
    const nextMilestoneNumber = highestMilestoneNumber + 1;

    const newRow = {
      milestone_Number: nextMilestoneNumber.toString(),
      milestone_Description: '',
      status: '',
      target_Date: '',
      actual_Date: '',
      remarks: ''
    };

    setTableData([...tableData, newRow]);
  };

  console.log('log', addRow);

  const deleteRow = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  const handleInputChange = (index, header, value) => {
    const updatedData = [...tableData];
    updatedData[index][header] = value;
    setTableData(updatedData);
  };

  const createProject = async () => {
    setLoading(true);
    try {
      const review_Status = isChecked ? 'Y' : 'N';

      // Validate form data using Yup
      await NewUserSchema.validate({
        project_Type: selectedProjectType,
        proj_Name: projName,
        project_Manager: projManager,
        calendarName: calendarName,
        description: description,
        start_Date: startDate,
        end_Date: endDate
      });
      if (/[!@#$%^&*(),.?":{}|<>]/.test(projName)) {
        enqueueSnackbar('Project Name contains special characters. Please remove them.', {
          autoHideDuration: 2000,
          variant: 'error'
        });
        return;
      }
      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/createUpdateProject',
        {
          project_Type: String(selectedProjectType),
          proj_Name: String(projName),
          project_Manager: String(projManager),
          calendarName: String(calendarName),
          description: String(description),
          start_Date: String(startDate),
          end_Date: String(endDate),
          actual_Date: String(actual),
          review_Status: review_Status
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );
      navigate(PATH_DASHBOARD.project.projectCreate);
      console.log('Ok', response.data);
      setLoading(false);
      enqueueSnackbar('Support Project Created Successfully', {
        autoHideDuration: 2000,
        variant: 'success'
      });
      setSuccess(true);
      console.log('response status', response.status);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error
        console.log('Validation error:', error.message);
        setLoading(false);
        enqueueSnackbar(error.message, {
          autoHideDuration: 2000,
          variant: 'error'
        });
      } else {
        // Other errors (network error, API response error, etc.)
        console.log('Error:', error);
        if (error.response) {
          console.log('Error response status', error.response.status);
          console.log('Error response data', error.response.data.message);
          setLoading(false);
          enqueueSnackbar(error.response.data.message, {
            autoHideDuration: 2000,
            variant: 'error'
          });
        } else {
          console.log('Network error or request was canceled:', error.message);
          // Handle other types of errors here
        }
      }
    }
  };

  useEffect(() => {
    axios
      .get(`https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/getListOfStatus`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('this is LOV', res.data);
        setStatusLOV(res.data); // Set the state here
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  // Now, log the state after it's updated
  console.log('gt', statusLOV);

  console.log('gt', statusLOV);

  useEffect(() => {
    dispatch(getListOfCalendarAsync());
    dispatch(getListofNamesAsync());
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

  const createFixed = async () => {
    setLoading(true);
    try {
      // Validate form data using Yup
      await NewUserSchema.validate({
        project_Type: selectedProjectType,
        proj_Name: projName,
        project_Manager: projManager,
        calendarName: calendarName,
        description: description,
        start_Date: startDate,
        end_Date: endDate
      });

      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/createUpdateProject',
        {
          project_Type: String(selectedProjectType),
          proj_Name: String(projName),
          project_Manager: String(projManager),
          calendarName: String(calendarName),
          description: String(description),
          start_Date: String(startDate),
          end_Date: String(endDate),
          actual_Date: String(actual),
          milestone: tableData,
          review_Status: review_Status
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );
      navigate(PATH_DASHBOARD.project.projectCreate);
      console.log('Ok', response.data);
      setLoading(false);
      enqueueSnackbar('Fixed Project Created Successfully', {
        autoHideDuration: 2000,
        variant: 'success'
      });

      setSuccess(true);
      console.log('response status', response.status);
      // navigate(PATH_DASHBOARD.admin.userManagement);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error
        console.log('Validation error:', error.message);
        setLoading(false);
        enqueueSnackbar(error.message, {
          autoHideDuration: 2000,
          variant: 'error'
        });
      } else {
        // Other errors (network error, API response error, etc.)
        console.log('Error:', error);
        if (error.response) {
          console.log('Error response status', error.response.status);
          console.log('Error response data', error.response.data.message);
          setLoading(false);
          enqueueSnackbar(error.response.data.message, {
            autoHideDuration: 2000,
            variant: 'error'
          });
        } else {
          console.log('Network error or request was canceled:', error.message);
          // Handle other types of errors here
        }
      }
    }
  };

  useEffect(() => {
    dispatch(getListOfCalendarAsync());
    dispatch(getListofNamesAsync());
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

  const clearTextFields = () => {
    setProjName('');
    setProjManager('');
    setCalendarName('');
    setDesc('');
    setStartDate('');
    setEndDate('');
    setActual('');
    setIsChecked('');
  };

  const handleProjectTypeChange = (e) => {
    // Handle the project type change here
    const newProjectType = e.target.value;
    setSelectedProjectType(newProjectType);

    // Clear text fields when switching from Support to Fixed Bid Project
    if (newProjectType === 'Fixed' || newProjectType === 'Support') {
      clearTextFields();
    }
  };

  const [open, setOpen] = useState(false); // State to control the dialog
  const [rowToDelete, setRowToDelete] = useState(null); // State to track the row to delete

  const handleDeleteClick = (index) => {
    setRowToDelete(index); // Set the index of the row to delete
    setOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    // Delete the row using the index in rowToDelete
    deleteRow(rowToDelete);
    setRowToDelete(null); // Reset the row to delete
    setOpen(false); // Close the confirmation dialog
  };

  const handleClose = () => {
    setRowToDelete(null); // Reset the row to delete
    setOpen(false); // Close the confirmation dialog
  };

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
        <Grid item xs={12} mt={-5}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="project-type"
              name="projectType"
              defaultValue="Support"
              // value={values.projectType}
              // onChange={(e) => setFieldValue('projectType', e.target.value)}
              value={selectedProjectType}
              onChange={handleProjectTypeChange}
            >
              <FormControlLabel value="Support" control={<Radio />} label="Support Project" />
              <FormControlLabel value="Fixed" control={<Radio />} label="Fixed Bid Project" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {selectedProjectType === 'Support' ? (
          <Grid container spacing={3}>
            <Grid item xs={30} md={1}>
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {/* {touched.avatarUrl && errors.avatarUrl} */}
              </FormHelperText>
            </Grid>
            <Grid container>
              {' '}
              <Grid item xs={12} md={15}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        size="small"
                        required
                        fullWidth
                        label="Project Name"
                        value={projName}
                        onChange={(e) => setProjName(e.target.value)}
                      />
                      {/* <div className="card flex justify-content-center" style={{ width: '100%' }}>
                            <FormControl fullWidth>
                              <MultiSelect
                                // style={{ width: 840, height: 55 }}
                                fullWidth
                                options={employees}
                                optionLabel="value"
                                optionValue="value"
                                filter
                                placeholder="Employee Name"
                                maxSelectedLabels={7}
                                {...getFieldProps('empNames')}
                                className="w-full"
                              />
                            </FormControl>
                          </div> */}
                      <div className="card flex justify-content-center">
                        <span className="p-float-label">
                          <Dropdown
                            style={{ height: 40 }}
                            fullWidth
                            required
                            options={employees}
                            optionLabel="value"
                            optionValue="value"
                            placeholder="Project Manager*"
                            filter
                            className="w-full md:w-16rem"
                            value={projManager}
                            onChange={(e) => setProjManager(e.target.value)}
                          />
                          <label htmlFor="dd-city">Project Manager</label>
                        </span>
                      </div>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Calendar Name *</InputLabel>
                        <Select
                          size="small"
                          labelId="Calendar-type-label"
                          id="Calendar-select"
                          label="Calendar Type"
                          name="Calendar Type"
                          value={calendarName}
                          onChange={(e) => setCalendarName(e.target.value)}
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
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          required
                          fullWidth
                          label="Project Description"
                          rows={2}
                          multiline
                          value={description}
                          onChange={(e) => setDesc(e.target.value)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'gray', ml: 1, mt: -2 }}>Start Date</Typography>
                          <TextField
                            type="date"
                            size="small"
                            required
                            fullWidth
                            value={startDate}
                            onChange={startChange}
                            // inputProps={{
                            //   min: new Date().toISOString().split('T')[0] // Set the minimum date to today
                            // }}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'gray', ml: 1, mt: -2 }}>End Date</Typography>
                          <TextField
                            type="date"
                            size="small"
                            required
                            fullWidth
                            value={endDate}
                            onChange={endChange}
                            inputProps={{ min: startDate }}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'gray', ml: 1, mt: -2 }}>Actual Completion Date</Typography>
                          <TextField
                            type="date"
                            size="small"
                            required
                            fullWidth
                            value={actual}
                            onChange={(e) => setActual(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      {/* <LoadingButton variant="contained" onClick={click}>
                          CANCEL
                        </LoadingButton> */}
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isChecked}
                              // value={review_Status}
                              onChange={handleCheckboxChange}
                              color="primary"
                            />
                          }
                          label="Review Project"
                        />
                        {/* <p> {isChecked ? 'Y' : 'N'}</p> */}
                      </div>

                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        loading={loading}
                        type="submit"
                        variant="contained"
                        onClick={createProject}
                      >
                        CREATE
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          // <FormikProvider value={formik}>
          //   <Form noValiddate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={30} md={1}>
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {/* {touched.avatarUrl && errors.avatarUrl} */}
              </FormHelperText>
            </Grid>
            <Grid container>
              {' '}
              <Grid item xs={12} md={15}>
                <Card sx={{ p: 2 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        size="small"
                        required
                        fullWidth
                        label="Project Name"
                        value={projName}
                        onChange={(e) => setProjName(e.target.value)}
                      />
                      <div className="card flex justify-content-center">
                        <span className="p-float-label">
                          <Dropdown
                            style={{ height: 40 }}
                            fullWidth
                            required
                            options={employees}
                            optionLabel="value"
                            optionValue="value"
                            placeholder="Project Manager*"
                            filter
                            className="w-full md:w-16rem"
                            value={projManager}
                            onChange={(e) => setProjManager(e.target.value)}
                          />
                          <label htmlFor="dd-city">Project Manager</label>
                        </span>
                      </div>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Calendar Name *</InputLabel>
                        <Select
                          size="small"
                          labelId="Calendar-type-label"
                          id="Calendar-select"
                          label="Calendar Type"
                          name="Calendar Type"
                          value={calendarName}
                          onChange={(e) => setCalendarName(e.target.value)}
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
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          required
                          fullWidth
                          label="Project Description"
                          rows={2}
                          multiline
                          value={description}
                          onChange={(e) => setDesc(e.target.value)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'gray', ml: 1, mt: -2 }}>Start Date</Typography>
                          <TextField
                            type="date"
                            size="small"
                            required
                            fullWidth
                            value={startDate}
                            onChange={startChange}
                            // inputProps={{
                            //   min: new Date().toISOString().split('T')[0] // Set the minimum date to today
                            // }}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'gray', ml: 1, mt: -2 }}>End Date</Typography>
                          <TextField
                            type="date"
                            size="small"
                            required
                            fullWidth
                            value={endDate}
                            onChange={endChange}
                            inputProps={{ min: startDate }}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'gray', ml: 1, mt: -2 }}>Actual Completion Date</Typography>
                          <TextField
                            type="date"
                            size="small"
                            required
                            fullWidth
                            value={actual}
                            onChange={(e) => setActual(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </Grid>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Milestone</TableCell>
                            <TableCell>Milestone Desc</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Target date</TableCell>
                            <TableCell>Completion Date</TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData.map((rowData, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ p: 1 }}>
                                <TextField
                                  size="small"
                                  sx={{ width: 50 }}
                                  value={rowData.milestone_Number}
                                  onChange={(e) => handleInputChange(index, 'milestone_Number', e.target.value)}
                                />
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <TextField
                                  size="small"
                                  rows={2}
                                  sx={{ width: 220 }}
                                  multiline
                                  value={rowData.milestone_Description}
                                  onChange={(e) => handleInputChange(index, 'milestone_Description', e.target.value)}
                                />
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                {/* <TextField
                                  size="small"
                                  value={rowData.status}
                                  onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                /> */}
                                <FormControl sx={{ width: 100 }}>
                                  <InputLabel id="Status-type-label">Status</InputLabel>
                                  <Select
                                    size="small"
                                    labelId="Status-type-label"
                                    id="Status-select"
                                    label="Status Type"
                                    name="Status Type"
                                    value={rowData.status}
                                    onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                    MenuProps={MenuProps}
                                  >
                                    {statusLOV.map((_x, i) => (
                                      <MenuItem key={i} value={_x.status}>
                                        {_x.status}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <TextField
                                  type="date"
                                  size="small"
                                  value={rowData.target_Date}
                                  onChange={(e) => handleInputChange(index, 'target_Date', e.target.value)}
                                />
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <TextField
                                  type="date"
                                  size="small"
                                  value={rowData.actual_Date}
                                  onChange={(e) => handleInputChange(index, 'actual_Date', e.target.value)}
                                />
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <TextField
                                  size="small"
                                  value={rowData.remarks}
                                  onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                                />
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <Button onClick={() => handleDeleteClick(index)}>Delete</Button>
                              </TableCell>
                              <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogContent>
                                  <DialogContentText>Are you sure you want to delete this row?</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose} color="primary">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleConfirmDelete} color="primary">
                                    Confirm
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Button
                        sx={{
                          color: 'green',
                          ml: 123,
                          mt: -2,
                          '@media (max-width: 768px)': {
                            ml: 70
                          }
                        }}
                        onClick={addRow}
                      >
                        Add Row
                      </Button>
                    </TableContainer>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <div>
                        <FormControlLabel
                          control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} color="primary" />}
                          label="Review Project"
                        />
                        {/* <p> {isChecked ? 'Y' : 'N'}</p> */}
                      </div>
                      <LoadingButton
                        onClick={createFixed}
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        loading={loading}
                        variant="contained"
                      >
                        CREATE
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          //   </Form>
          // </FormikProvider>
        )}
      </Container>
    </Page>
  );
}
