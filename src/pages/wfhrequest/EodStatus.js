/* eslint-disable no-restricted-globals */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable arrow-body-style */
/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */

/////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Paper,
  Stack,
  Alert,
  AlertTitle,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { DatePicker, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router';
import { MIconButton } from '../../components/@material-extend';

import { PATH_DASHBOARD } from '../../routes/paths';

function EodStatus() {
  const initialTableData = [
    { time: '1st hour', taskPlan: '' },
    { time: '2nd hour', taskPlan: '' },
    { time: '3rd hour', taskPlan: '' },
    { time: '4th hour', taskPlan: '' },
    { time: '5th hour', taskPlan: '' },
    { time: '6th hour', taskPlan: '' },
    { time: '7th hour', taskPlan: '' },
    { time: '8th hour', taskPlan: '' }
  ];

  const Manager = localStorage.getItem('manager');
  console.log('Manager', Manager);

  const [formData, setFormData] = useState({
    reason: '',
    plannedtask: '',
    backlog: '',
    remarks: '',
    manager: Manager,
    pdomanager: '',
    status: '',
    taskdate: new Date()
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableData, setTableData] = useState(initialTableData);
  const [plannedTaskError, setPlannedTaskError] = useState(false);
  const [taskDetails, setTaskDetails] = useState([]);
  const [apiResponse, setApiResponse] = useState([]);
  console.log('Response', apiResponse);
  const [taskPlanErrors, setTaskPlanErrors] = useState(new Array(initialTableData.length).fill(false));
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [managerComments, setManagerComments] = useState('');
  const [status, setStatus] = useState('');
  const [reqStatus, setReqStatus] = useState('');
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFormChange = async (field, value) => {
    setTaskDetails([]);
    if (field === 'taskdate') {
      const selectedDate = new Date(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        taskdate: selectedDate
      }));
      setTableData(initialTableData);
      setTaskPlanErrors(new Array(initialTableData.length).fill(false));
      setPlannedTaskError(false);

      try {
        const formattedDate = formatDate(value);
        const token = localStorage.getItem('accessToken');

        const response = await axios.post(
          'https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/initiateTask',
          {
            taskdate: formattedDate
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            }
          }
        );

        if (response.data) {
          // If response is received, update form fields with fetched data
          console.log('Response', response.data);

          setStatus(response.data.status);
          setReqStatus(response.data.wfhstatus);
          setManagerComments(response.data.comments);
          setTaskDetails(
            response.data.taskDetailsList.map((x, i) => {
              return x.task;
            })
          );
          setApiResponse(response.data);

          setFormData((prevFormData) => ({
            ...prevFormData,
            taskdate: response.data.taskdate || '',
            reason: response.data.reason || '',
            plannedtask: response.data.plannedtask || '',
            manager: response.data.manager || '',
            backlog: response.data.backlog || '',
            remarks: response.data.remarks || 'Default Remarks',
            pdomanager: response.data.pdomanager || ''
          }));
        } else {
          // If no response received, reset form fields to empty values
          setStatus('');
          setReqStatus('');
          setApiResponse([]);
          setTaskDetails([]);
          setFormData({
            reason: '',
            plannedtask: '',
            backlog: '',
            remarks: '',
            manager: Manager,
            pdomanager: '',
            status: '',
            taskdate: selectedDate
          });
          setTableData(initialTableData);
          setTaskPlanErrors(new Array(initialTableData.length).fill(false));
          setPlannedTaskError(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error if the API call fails
      }
    } else {
      // ... your existing code for handling other field changes
    }
  };

  console.log('reqstatyus', status);

  const handleInputChange = (index, header, value) => {
    const updatedData = [...tableData];
    updatedData[index][header] = value;
    setTableData(updatedData);

    const newErrors = updatedData.map((row) => row.taskPlan.trim() === '');
    setTaskPlanErrors(newErrors);
  };

  const handleSubmitButtonClick = async () => {
    const hasEmptyTaskPlans = taskPlanErrors.some((error) => error);
    const allTaskPlansFilled = tableData.every((row) => row.taskPlan.trim() !== '');

    if (hasEmptyTaskPlans || !allTaskPlansFilled) {
      // alert('Please fill in all fields before submitting.');
      enqueueSnackbar('Please fill in all fields before submitting.', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      return;
    }

    setIsSubmitting(true); // Set submitting state to true
    setIsLoading(true); // Show loading indicator

    const token = localStorage.getItem('accessToken');
    const dataToSend = {
      ...formData,
      // taskdate: formatDate(formData.taskdate),
      status: 'submitted', // Update the status to 'submitted'
      taskDetailsList: tableData.map((row) => ({ task: row.taskPlan }))
    };

    try {
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/wfhdailyrequest',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );

      if (response.status === 200) {
        // alert('Data submitted successfully');
        enqueueSnackbar('Task Submitted Successfully', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        navigate(PATH_DASHBOARD.travel.reqWFH);
      } else {
        // alert('Data submission failed');
        enqueueSnackbar('Task Submitted Failed', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred while submitting data');
      if (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleBack = () => {
    // Logic to handle the back button click, for example, navigate to a previous page or route
    navigate(PATH_DASHBOARD.travel.reqWFH);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" paragraph>
        Plan For Work From Home
      </Typography>
      <Stack spacing={2}>
        {status === 'Reviewed' && (
          <Alert severity="success">
            <AlertTitle>Reviewed</AlertTitle>Your task for the day has been reviewed by your manager
          </Alert>
        )}
        {status === 'DRAFT' && (
          <Alert severity="info">
            <AlertTitle>Submitted</AlertTitle>You have submitted your Task for the day. Awaiting your manager response
            to your tasks
          </Alert>
        )}
        {reqStatus === 'rejected' && (
          <Alert severity="error">
            <AlertTitle>Rejected</AlertTitle>Your Request for the day has not been Approved by your manager
          </Alert>
        )}
        {reqStatus === 'approved' && (
          <Alert severity="success">
            <AlertTitle>Approved</AlertTitle>Your Request for the day has been Approved by your manager
          </Alert>
        )}
        {reqStatus === 'submitted' && (
          <Alert severity="warning">
            <AlertTitle>Submitted</AlertTitle>Your Request for the day has been Submitted Succesfully
          </Alert>
        )}
        {managerComments && (
          <Alert severity="info">
            <AlertTitle>Manager Comments</AlertTitle>
            {managerComments}
          </Alert>
        )}
      </Stack>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <DatePicker
              label="Task Date"
              value={formData.taskdate}
              onChange={(date) => {
                const selectedDate = new Date(date); // Ensure 'date' is parsed into a Date object
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  taskdate: selectedDate
                }));
                handleFormChange('taskdate', selectedDate);
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Reason"
              size="small"
              disabled
              value={formData.reason}
              onChange={(e) => handleFormChange('reason', e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField label="Reporting Manager" disabled size="small" value={formData.manager} />
          </Grid>

          <Grid item>
            {/* <TextField label="Reporting Manager" disabled size="small" value={formData.manager} /> */}
            <TextField
              label="PDO Manager"
              size="small"
              disabled
              value={formData.pdomanager}
              onChange={(e) => handleFormChange('pdoManager', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Backlogs" disabled value={formData.backlog} multiline size="small" fullWidth />
          </Grid>
          <Grid item xs={5.5}>
            <TextField label="Remarks" disabled value={formData.remarks} multiline size="small" fullWidth />
          </Grid>
        </Grid>
      </Paper>
      <TableContainer sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Task Plan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskDetails.length === 0 ? (
              <>
                {tableData.map((rowData, index) => (
                  <TableRow key={index}>
                    <TableCell>{rowData.time}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={rowData.taskPlan}
                        onChange={(e) => handleInputChange(index, 'taskPlan', e.target.value)}
                        error={taskPlanErrors[index]}
                        helperText={taskPlanErrors[index] ? 'Task Plan is required' : ''}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {tableData.map((rowData, index) => (
                  <TableRow key={index}>
                    <TableCell>{rowData.time}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        disabled
                        value={taskDetails[index]}
                        onChange={(e) => handleInputChange(index, 'taskPlan', e.target.value)}
                        error={taskPlanErrors[index]}
                        helperText={taskPlanErrors[index] ? 'Task Plan is required' : ''}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <LoadingButton
        type="submit"
        variant="contained"
        loading={isSubmitting || isLoading}
        onClick={handleSubmitButtonClick}
        // disabled={
        //   status === 'DRAFT' ||
        //   reqStatus === 'rejected' ||
        //   reqStatus === 'submitted' ||
        //   status === 'Reviewed' ||
        //   reqStatus === 'saved'
        // }
        disabled={reqStatus !== 'approved' || status !== 'ONPROCESS'}
      >
        {isSubmitting || isLoading ? 'Submitting...' : 'Submit'}
      </LoadingButton>
      <IconButton onClick={handleBack} aria-label="back">
        <ArrowBackIcon sx={{ color: 'blue' }} />
      </IconButton>
    </Container>
  );
}

export default EodStatus;
