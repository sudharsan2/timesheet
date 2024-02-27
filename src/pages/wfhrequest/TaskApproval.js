import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

import { getWfhIdDetailsFromWfhApproval, approveTaskAsync } from '../../redux/slices/wfhApprovalSlice';

import { PATH_DASHBOARD } from '../../routes/paths';

export default function TaskApproval() {
  const [tableData, setTableData] = useState([]);
  const [comments, setComments] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const handleComments = (e) => {
    setComments(e.target.value);
  };
  const wfhIdTaskDetails = useSelector(getWfhIdDetailsFromWfhApproval);
  const handleInputChange = (index, header, value) => {
    const updatedData = [...tableData];
    updatedData[index][header] = value;
    setTableData(updatedData);
  };

  const taskStatus = wfhIdTaskDetails.status;
  console.log('taskStatus', taskStatus);
  useEffect(() => {
    // Extract task details from the response
    if (wfhIdTaskDetails && wfhIdTaskDetails.taskDetailsList) {
      const tasks = wfhIdTaskDetails.taskDetailsList.map((taskItem, index) => ({
        time: `${index + 1} hour`, // You can set the time as per your requirement
        taskPlan: taskItem.task || '' // Set task plan from the response
      }));
      setTableData(tasks);
    }
  }, [wfhIdTaskDetails]);

  const handleApprove = () => {
    // Perform logic to approve tasks
    setLoading(true);
    const taskId = wfhIdTaskDetails.taskid; // Fetch task ID from the state
    const commentsForApproval = comments; // Use comments state or modify accordingly

    // Dispatch action to approve task
    dispatch(approveTaskAsync({ taskId, comments: commentsForApproval }))
      .unwrap()
      .then((data) => {
        setLoading(false);
        enqueueSnackbar('Task Reviewed', {
          variant: 'success',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              {/* <CloseIcon /> */}
            </IconButton>
          )
        });
        navigate(PATH_DASHBOARD.travel.reviewStatus);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Failed to Approve Task', {
          variant: 'error',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              {/* <CloseIcon /> */}
            </IconButton>
          )
        });
      });
  };

  const handleBack = () => {
    // Logic to handle the back button click, for example, navigate to a previous page or route
    navigate(PATH_DASHBOARD.travel.reviewStatus);
  };

  const title = 'Task Review';
  return (
    <Container maxWidth="lg">
      <HeaderBreadcrumbs
        heading={title}
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Approval List', href: PATH_DASHBOARD.travel.reviewStatus }
        ]}
      />
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <DatePicker
              label="Task Date"
              value={wfhIdTaskDetails.taskdate}
              disabled
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </Grid>
          <Grid item>
            <TextField label="Reporting Manager" size="small" value={wfhIdTaskDetails.manager} disabled />
          </Grid>
          <Grid item>
            <TextField label="PDO Manager" size="small" value={wfhIdTaskDetails.pdomanager} disabled />
          </Grid>
          <Grid item>
            <TextField label="Emp Name" size="small" value={wfhIdTaskDetails.emp_name} disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Reason" size="small" value={wfhIdTaskDetails.reason} disabled fullWidth />
          </Grid>

          <Grid item xs={5.5}>
            <TextField label="BackLogs" size="small" value={wfhIdTaskDetails.backlog} multiline disabled fullWidth />
          </Grid>

          <Grid item xs={11.5}>
            <TextField label="Remarks" size="small" value={wfhIdTaskDetails.remarks} multiline disabled fullWidth />
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
            {tableData.map((rowData, index) => (
              <TableRow key={index}>
                <TableCell>{rowData.time}</TableCell>
                <TableCell>
                  {/* Textfield to input task plans */}
                  <TextField
                    fullWidth
                    value={rowData.taskPlan}
                    disabled
                    onChange={(e) => handleInputChange(index, 'taskPlan', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item>
        <TextField
          fullWidth
          autoFocus
          size="small"
          label="Enter your comments"
          multiline
          name="comments"
          value={comments}
          disabled={taskStatus === 'Reviewed'}
          onChange={handleComments}
          inputProps={{ maxLength: 255 }}
        />
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Grid item>
          <IconButton onClick={handleBack} aria-label="back">
            <ArrowBackIcon sx={{ color: 'blue' }} />
          </IconButton>
          <LoadingButton loading={loading} disabled={taskStatus === 'Reviewed'} onClick={handleApprove}>
            REVIEWED
          </LoadingButton>
        </Grid>
      </Box>
    </Container>
  );
}
