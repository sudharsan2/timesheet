/* eslint-disable import/named */
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
import { useNavigate, useParams } from 'react-router';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack';
import { Dropdown } from 'primereact/dropdown';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import { useForceUpdate } from '@react-spring/shared';
import React, { useState, useEffect } from 'react';
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

export default function EditReview() {
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
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [milestoneNumber, setMilestoneNumber] = useState('');
  const { employees } = useSelector((state) => state.asset);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [projType, setProjType] = useState('');
  const [projName, setProjName] = useState('');
  const [projManager, setProjManager] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [description, setDesc] = useState('');
  const params = useParams();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actual, setActual] = useState('');
  const token = localStorage.getItem('accessToken');
  const [isChecked, setIsChecked] = useState(false);
  const forceUpdate = useForceUpdate();
  const [milestoneNumberState, setMilestoneNumberState] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [targetDates, setTargetDates] = useState('');
  const [status, setStatus] = useState('');
  const [actualDate, setActualDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [review_Status, setReviewStatus] = useState('N'); // Initialize to 'N'
  const [statusLOV, setStatusLOV] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [reviewStat, setReviewStat] = useState('');
  const [loading, setLoading] = React.useState(false);
  const temp1 = [];

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
        width: 200
      }
    }
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

  const handleInputChange = (index, header, value) => {
    const updatedData = [...tableData];
    updatedData[index][header] = value;
    setTableData(updatedData);
  };
  // Function to format a date to "dd-mm-yyyy" format and back to the API format
  function formatDateToDDMMYYYY(apiDateString) {
    if (!apiDateString) {
      return '';
    }

    const dateParts = apiDateString.split('T')[0].split('-');
    if (dateParts.length !== 3) {
      return ''; // Invalid date format
    }

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    axios
      .get(`https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/getAllProjects`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('this is response data', res.data);
        console.log('params', params);

        const newArr = res.data.find((val) => {
          return val.proj_Id == params.projId;
        });

        console.log('4', newArr);

        console.log('098765', newArr.proj_Id);
        setSelectedProjectType(newArr.project_Type);
        console.log('5', selectedProjectType);
        setProjName(newArr.proj_Name);
        console.log('6', projName);
        forceUpdate(); // Force a re-render
        setProjManager(newArr.project_Manager);
        console.log('fds', projManager);
        setCalendarName(newArr.calendarName);
        setDesc(newArr.description);
        setStartDate(newArr.start_Date);
        setEndDate(newArr.end_Date);
        setActual(newArr.actual_Date);
        setMilestoneNumberState(newArr.milestone);
        setReviewStat(newArr.review_Status);
        setIsChecked(newArr.review_Status === 'Y' || false);
        console.log('2', milestoneNumberState);
        setEmpName(
          newArr.emp_Projects.map((emp) => {
            console.log('Four', emp);
            return emp.name;
          })
        );
        // setData(res.data[0].skills)
        console.log('empNames', empName);

        if (newArr && Array.isArray(newArr.milestone)) {
          // Map the 'milestone' array to the 'tableData' format
          const tableDataFromAPI = newArr.milestone.map((item) => ({
            milestone_Number: item.milestone_Number || '',
            milestone_Description: item.milestone_Description || '',
            status: item.status || '',
            target_Date: formatDateToDDMMYYYY(item.target_Date) || '',
            actual_Date: formatDateToDDMMYYYY(item.actual_Date) || '',
            remarks: item.remarks || ''
          }));
          setTableData(tableDataFromAPI);

          console.log('secnd', tableData);
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, []);

  console.log('Selected Project Type (outside useEffect):', selectedProjectType);
  console.log('list66', reviewStat);

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

  const editProject = async () => {
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

      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/createUpdateProject',
        {
          proj_Id: params.projId,
          project_Type: String(selectedProjectType),
          proj_Name: String(projName),
          project_Manager: String(projManager),
          calendarName: String(calendarName),
          description: String(description),
          start_Date: String(startDate),
          end_Date: String(endDate),
          actual_Date: String(actual),
          empNames: empName,
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

      enqueueSnackbar('Support Project Updated Successfully', {
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

  const editFixed = async () => {
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

      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/createUpdateProject',
        {
          proj_Id: params.projId,
          project_Type: String(selectedProjectType),
          proj_Name: String(projName),
          project_Manager: String(projManager),
          calendarName: String(calendarName),
          description: String(description),
          start_Date: String(startDate),
          end_Date: String(endDate),
          actual_Date: String(actual),
          milestone: tableData,
          empNames: empName,
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
      enqueueSnackbar('Fixed Project Updated Successfully', {
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

  const title = 'Edit Project';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Project Details', href: PATH_DASHBOARD.project.projectCreate },
            { name: 'Edit' }
          ]}
        />
        {selectedProjectType && (
          <Grid item xs={12} mt={-5}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="project-type"
                name="projectType"
                value={selectedProjectType}
                onChange={(e) => setSelectedProjectType(e.target.value)}
              >
                {/* <FormControlLabel value="Support" disabled control={<Radio />} label="Support Project" />
                <FormControlLabel value="Fixed" disabled control={<Radio />} label="Fixed Bid Project" /> */}
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
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
                            fullWidth
                            options={employees}
                            optionLabel="value"
                            optionValue="value"
                            // placeholder="Project Manager"
                            filter
                            className="w-full md:w-14rem"
                            value={projManager}
                            onChange={(e) => setProjManager(e.target.value)}
                          />
                          <label htmlFor="dd-city" style={{ marginTop: 1.6 }}>
                            Project Manager
                          </label>
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
                        <div className="card flex justify-content-center" style={{ width: '100%' }}>
                          <FormControl fullWidth>
                            <MultiSelect
                              // style={{ width: 840, height: 55 }}
                              fullWidth
                              options={employees}
                              optionLabel="value"
                              optionValue="value"
                              filter
                              placeholder="Consultant Name"
                              maxSelectedLabels={7}
                              value={empName}
                              onChange={(e) => setEmpName(e.target.value)}
                              className="w-full"
                            />
                          </FormControl>
                        </div>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          {/* <DatePicker
                            required
                            fullWidth
                            label="Start Date *"
                            value={startDate}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');

                                setStartDate(parseddate);

                                console.log('startDate', parseddate);
                              } else {
                                setStartDate('');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          /> */}
                          <TextField
                            type="date"
                            size="small"
                            value={formatDateToDDMMYYYY(startDate)} // Format date when displaying
                            // onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          {/* <DatePicker
                            fullWidth
                            label="End Date *"
                            value={endDate}
                            minDate={endDate}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');

                                setEndDate(parseddate);

                                console.log('startDate', parseddate);
                              } else {
                                setEndDate('');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          /> */}
                          <TextField
                            type="date"
                            size="small"
                            value={formatDateToDDMMYYYY(endDate)} // Format date when displaying
                            // onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          {/* <DatePicker
                            fullWidth
                            label="Actual Completion Date *"
                            value={actual}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');

                                setActual(parseddate);

                                console.log('startDate', parseddate);
                              } else {
                                setActual('');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          /> */}
                          <TextField
                            type="date"
                            size="small"
                            value={formatDateToDDMMYYYY(actual)} // Format date when displaying
                            // onChange={(e) => handleInputChange(index, 'actual', e.target.value)}
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
                          control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} color="primary" />}
                          label="Review Project"
                        />
                        {/* <p> {isChecked ? 'Y' : 'N'}</p> */}
                      </div>

                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        loading={loading}
                        type="submit"
                        variant="contained"
                        onClick={editProject}
                      >
                        Update
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
                            fullWidth
                            options={employees}
                            optionLabel="value"
                            optionValue="value"
                            placeholder="Project Manager"
                            filter
                            className="w-full md:w-14rem"
                            value={projManager}
                            onChange={(e) => setProjManager(e.target.value)}
                          />
                          <label htmlFor="dd-city" style={{ marginTop: 1.6 }}>
                            Project Manager
                          </label>
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
                        <div className="card flex justify-content-center" style={{ width: '100%' }}>
                          <FormControl fullWidth>
                            <MultiSelect
                              // style={{ width: 840, height: 55 }}
                              fullWidth
                              options={employees}
                              optionLabel="value"
                              optionValue="value"
                              filter
                              placeholder="Consultant Name"
                              maxSelectedLabels={7}
                              value={empName}
                              onChange={(e) => setEmpName(e.target.value)}
                              className="w-full"
                            />
                          </FormControl>
                        </div>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          {/* <DatePicker
                            required
                            fullWidth
                            label="Start Date *"
                            value={startDate}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');

                                setStartDate(parseddate);

                                console.log('startDate', parseddate);
                              } else {
                                setStartDate('');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          /> */}
                          <TextField
                            type="date"
                            size="small"
                            value={formatDateToDDMMYYYY(startDate)} // Format date when displaying
                            // onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          {/* <DatePicker
                            fullWidth
                            label="End Date *"
                            value={endDate}
                            minDate={endDate}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');

                                setEndDate(parseddate);

                                console.log('startDate', parseddate);
                              } else {
                                setEndDate('');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          /> */}
                          <TextField
                            type="date"
                            size="small"
                            value={formatDateToDDMMYYYY(endDate)} // Format date when displaying
                            // onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          {/* <DatePicker
                            fullWidth
                            label="Actual Completion Date *"
                            value={actual}
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');

                                setActual(parseddate);

                                console.log('startDate', parseddate);
                              } else {
                                setActual('');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          /> */}
                          <TextField
                            type="date"
                            size="small"
                            value={formatDateToDDMMYYYY(actual)} // Format date when displaying
                            // onChange={(e) => handleInputChange(index, 'actual', e.target.value)}
                            onChange={(e) => setActual(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </Grid>
                    <TableContainer>
                      <Table size="small">
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
                              <TableCell>
                                <TextField
                                  size="small"
                                  sx={{ width: 50 }}
                                  value={rowData.milestone_Number}
                                  onChange={(e) => handleInputChange(index, 'milestone_Number', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  rows={2}
                                  sx={{ width: 220 }}
                                  multiline
                                  value={rowData.milestone_Description}
                                  onChange={(e) => handleInputChange(index, 'milestone_Description', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                {/* <TextField
                                  size="small"
                                  value={rowData.status}
                                  onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                /> */}
                                <FormControl sx={{ width: 130 }}>
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
                              <TableCell>
                                <TextField
                                  type="date"
                                  size="small"
                                  value={formatDateToDDMMYYYY(rowData.target_Date)} // Format date when displaying
                                  onChange={(e) => handleInputChange(index, 'target_Date', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="date"
                                  size="small"
                                  value={formatDateToDDMMYYYY(rowData.actual_Date)} // Format date when displaying
                                  onChange={(e) => handleInputChange(index, 'actual_Date', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={rowData.remarks}
                                  onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
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
                          ml: 128,
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
                      <LoadingButton onClick={editFixed} style={{ marginLeft: '1%' }} type="submit" variant="contained">
                        Update
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
