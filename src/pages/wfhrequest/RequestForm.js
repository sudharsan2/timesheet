import {
  FormControl,
  FormHelperText,
  Grid,
  Container,
  Card,
  Stack,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { DatePicker, LoadingButton } from '@mui/lab';
import { addDays, format, isWithinInterval } from 'date-fns';
import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  createWorkFromRequestAsync,
  selectIsWfhLoading,
  selectWfhData,
  setErrorNull,
  selectWfhError
} from '../../redux/slices/WfhSlice';
import { getManagersListFromUser, getAllManagersActionAsync } from '../../redux/slices/userSlice';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';

import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';

/* eslint-disable */

export default function RequestForm() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const error = useSelector(selectWfhError);
  console.log('Error In WFH :', error);
  const msg = useSelector(selectWfhData);
  const [loading, setLoading] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const isLoading = useSelector(selectIsWfhLoading);
  const [reason, setReason] = useState('');
  const [pdoManager, setPdoManager] = useState('');
  const [backLogs, setBackLogs] = useState('');
  const [maxEndDate, setMaxEndDate] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // const { calender } = useSelector((state) => state.project);

  const managers = useSelector(getManagersListFromUser);
  console.log('managers', managers);
  // console.log('9099', calender);
  const navigate = useNavigate();
  const [text, setText] = useState('• ');

  const Manager = localStorage.getItem('manager');
  console.log('Manager', Manager);

  const token = localStorage.getItem('accessToken');
  console.log('Token', token);

  // const handleChange = (value) => {
  //   setText(value);
  // };

  const [numberOfDays, setNumberOfDays] = useState(0);

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

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const calculateWeekdayDifference = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let days = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (!holidays.includes(format(currentDate, 'EEEE'))) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);

    // Calculate the maximum selectable end date based on the selected start date
    const maxSelectableEndDate = addDays(date, 4);

    // Adjust maxSelectableEndDate based on the day of the week (position)
    const dayPosition = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    let additionalDays = 0;

    if (dayPosition === 2) {
      additionalDays = 2; // Add an extra day if the day is Monday (position 1)
    } else if (dayPosition === 3) {
      additionalDays = 2; // Add two extra days if the day is Tuesday (position 2)
    } else if (dayPosition === 4) {
      additionalDays = 2; // Add three extra days if the day is Wednesday (position 3)
    } else if (dayPosition === 5) {
      additionalDays = 2; // Add four extra days if the day is Thursday (position 4)
    } else if (dayPosition === 6) {
      additionalDays = 2; // Add Two extra days if the day is Saturday (position 4)
    } else if (dayPosition === 1) {
      additionalDays = 2; // Add One extra days if the day is Monday (position 4)
    } else if (dayPosition === 0) {
      additionalDays = 2; // Add One extra days if the day is Monday (position 4)
    }

    if (endDate && !isWithinInterval(endDate, { start: date, end: maxSelectableEndDate })) {
      setEndDate(null); // Reset end date if it's outside the allowed range
    }

    // Set the maximum selectable end date considering the additional days
    const adjustedMaxSelectableEndDate = addDays(maxSelectableEndDate, additionalDays);
    setMaxEndDate(adjustedMaxSelectableEndDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date) {
      const daysDifference = calculateWeekdayDifference(startDate, date, holidays);
      setNumberOfDays(daysDifference); // Update the number of days excluding weekends
      // setEndDate('numberOfDays', daysDifference); // Update the form value
    } else {
      setNumberOfDays(0);
      // setFieldValue('numberOfDays', 0); // Reset the form value
    }
  };

  const handleSave = async () => {
    let isFormValid = true;
    setLoading(true);
    if (!startDate || !endDate || !reason || !numberOfDays || !Manager || !pdoManager || !backLogs) {
      isFormValid = false;
      if (!startDate) {
        setLoading(false);
        enqueueSnackbar('StartDate is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!endDate) {
        setLoading(false);
        enqueueSnackbar('EndDate is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!reason) {
        setLoading(false);
        enqueueSnackbar('Reason is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!numberOfDays) {
        setLoading(false);
        enqueueSnackbar('Number of Days is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!Manager) {
        setLoading(false);
        enqueueSnackbar('Manager is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!pdoManager) {
        setLoading(false);
        enqueueSnackbar('Project Manager is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!backLogs) {
        setLoading(false);
        enqueueSnackbar('BackLogs is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    }

    if (isFormValid) {
      const payload = {
        fromdate: startDate,
        todate: endDate,
        reason: reason,
        numberOfDays: numberOfDays,
        manager: Manager,
        projectmanager: pdoManager,
        backlog: backLogs,
        status: 'saved' // Set status to 'saved' for save action
      };
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          'https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/wfhrequest',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            }
          }
        );

        if (response.status === 200) {
          setLoading(false);

          if (response.data.id === 0) {
            enqueueSnackbar('Failed: Already You Request The Given Date', { variant: 'error' });
            // Optionally handle other specific error cases if needed
            navigate(PATH_DASHBOARD.travel.reqWFH);
          } else {
            enqueueSnackbar('Saved successfully', { variant: 'success' });
            navigate(PATH_DASHBOARD.travel.reqWFH);
          }
        } else {
          enqueueSnackbar('Save failed', { variant: 'error' });
          navigate(PATH_DASHBOARD.travel.reqWFH);
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data && error.response.data.message) {
          enqueueSnackbar(error.response.data.message, { variant: 'error' });
        } else {
          enqueueSnackbar('Save failed', { variant: 'error' });
        }
        navigate(PATH_DASHBOARD.travel.reqWFH);
      }
    }
  };

  const handleSubmit = async () => {
    let isFormValid = true;
    setLoadingReject(true);
    if (!startDate || !endDate || !reason || !numberOfDays || !Manager || !pdoManager || !backLogs) {
      isFormValid = false;
      if (!startDate) {
        setLoadingReject(false);
        enqueueSnackbar('StartDate is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!endDate) {
        setLoadingReject(false);
        enqueueSnackbar('EndDate is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!reason) {
        setLoadingReject(false);
        enqueueSnackbar('Reason is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!numberOfDays) {
        setLoadingReject(false);
        enqueueSnackbar('Number of Days is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!Manager) {
        setLoadingReject(false);
        enqueueSnackbar('Manager is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!pdoManager) {
        setLoadingReject(false);
        enqueueSnackbar('Project Manager is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      if (!backLogs) {
        setLoadingReject(false);
        enqueueSnackbar('BackLogs is required', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    }

    if (isFormValid) {
      const payload = {
        fromdate: startDate,
        todate: endDate,
        reason: reason,
        numberOfDays: numberOfDays,
        manager: Manager,
        projectmanager: pdoManager,
        backlog: backLogs,
        status: 'submitted' // Set status to 'submitted' for submission action
      };

      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          'https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/wfhrequest',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            }
          }
        );

        if (response.status === 200) {
          setLoadingReject(false);

          if (response.data.id === 0) {
            enqueueSnackbar('Failed: Already You Request The Given Date', { variant: 'error' });
            // Optionally handle other specific error cases if needed
            navigate(PATH_DASHBOARD.travel.reqWFH);
          } else {
            enqueueSnackbar('Submitted successfully', { variant: 'success' });
            navigate(PATH_DASHBOARD.travel.reqWFH);
          }
        } else {
          enqueueSnackbar('Submit failed', { variant: 'error' });
          navigate(PATH_DASHBOARD.travel.reqWFH);
        }
      } catch (error) {
        setLoadingReject(false);
        if (error.response && error.response.data && error.response.data.message) {
          enqueueSnackbar(error.response.data.message, { variant: 'error' });
        } else {
          enqueueSnackbar('Submit failed', { variant: 'error' });
        }
        navigate(PATH_DASHBOARD.travel.reqWFH);
      }
    }
  };

  useEffect(() => {
    dispatch(getAllManagersActionAsync());
  }, []);

  const title = 'WFH Request';

  // const isWeekend = (date) => {
  //   const day = date.getDay();
  //   return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  // };

  useEffect(() => {
    const fetchHolidays = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(
          'https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/holiday',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            }
          }
        );
        setHolidays(response.data); // ["Sunday", "Monday"]
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };

    fetchHolidays();
  }, []);

  // const isWeekend = async (date) => {
  //   // Fetch the list of holidays
  //   const holidays = await fetchHolidays();

  //   // Get the day name of the provided date (e.g., "Sunday", "Monday", etc.)
  //   const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

  //   // Check if the day name is included in the list of holidays
  //   return holidays.includes(dayName);
  // };
  const isWeekend = (date) => {
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    return holidays.includes(dayName);
  };

  return (
    <Page title={title}>
      <Container sx={{ mt: -3 }} maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Create Request', href: PATH_DASHBOARD.travel.reqWFH },
            { name: 'Req' }
          ]}
        />

        <Grid container spacing={3}>
          <Grid item xs={30} md={1}></Grid>

          <Grid item xs={12} md={10}>
            <Card sx={{ p: 3, mt: -3 }}>
              <Stack spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormControl fullWidth>
                      <FormControl fullWidth>
                        <DatePicker
                          label="From Date"
                          value={startDate}
                          inputFormat="yyyy-MM-dd"
                          disablePast
                          fullWidth
                          shouldDisableDate={isWeekend} // Disable weekends
                          onChange={(newValue) => {
                            if (newValue instanceof Date && !isNaN(newValue)) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setStartDate(parseddate);
                              handleStartDateChange(newValue); // Call the function to update the number of days
                              console.log('Date', newValue);
                            } else {
                              // Handle cases where newValue is not a valid date
                              console.error('Invalid date:', newValue);
                              // You might handle this situation by setting an appropriate default value or showing an error message.
                            }
                          }}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => <TextField size="small" {...params} label="From Date" />}
                        />
                      </FormControl>
                    </FormControl>
                    <FormControl fullWidth>
                      <FormControl fullWidth>
                        <DatePicker
                          label="To Date"
                          value={endDate}
                          inputFormat="yyyy-MM-dd"
                          // minDate={startDate ? addDays(startDate, 1) : null}
                          // maxDate={startDate ? addDays(startDate, 4) : null}
                          minDate={startDate}
                          maxDate={maxEndDate}
                          disablePast
                          shouldDisableDate={isWeekend} // Disable weekends
                          // onChange={(newValue) => {
                          //   if (newValue) {
                          //     const parseddate = format(newValue, 'yyyy-MM-dd');
                          //     setEndDate(parseddate);
                          //     handleEndDateChange(newValue); // Call the function to update the number of days
                          //   }
                          // }}
                          onChange={(newValue) => {
                            if (newValue instanceof Date && !isNaN(newValue)) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setEndDate(parseddate);
                              handleEndDateChange(newValue); // Call the function to update the number of days
                            } else {
                              // Handle cases where newValue is not a valid date
                              console.error('Invalid date:', newValue);
                              // You might handle this situation by setting an appropriate default value or showing an error message.
                            }
                          }}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => <TextField size="small" {...params} label="To Date" />}
                        />
                      </FormControl>
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        required
                        type="number"
                        size="small"
                        label="No of Days"
                        value={numberOfDays}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      label="Reason"
                      multiline
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="Reporting Manager" multiline disabled size="small" value={Manager} />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="project-type-label">PDO Manager</InputLabel>
                    <Select
                      size="small"
                      labelId="Project-type-label"
                      id="Project-select"
                      label="PDO Manager"
                      name="PDO Manager"
                      value={pdoManager}
                      onChange={(e) => setPdoManager(e.target.value)}
                      // MenuProps={MenuProps}
                    >
                      {managers.map((_x, i) => (
                        <MenuItem key={i} value={_x.name}>
                          {_x.name} ({_x.designation})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Grid item xs={12} sm={12} md={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="BackLog"
                      multiline
                      value={backLogs}
                      onChange={(e) => setBackLogs(e.target.value)}
                    />
                  </Stack>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton
                    style={{ marginLeft: '1%' }}
                    variant="contained"
                    onClick={handleSave}
                    loading={loading}
                  >
                    SAVE
                  </LoadingButton>
                  <LoadingButton
                    style={{ marginLeft: '1%' }}
                    variant="contained"
                    onClick={handleSubmit}
                    loading={loadingReject}
                  >
                    SUBMIT
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
