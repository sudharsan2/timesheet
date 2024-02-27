import {
  Card,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
  FormControl,
  TableBody,
  TableContainer,
  Table,
  InputLabel,
  Drawer,
  List,
  Popover,
  Paper,
  MenuItem,
  ListItem,
  ListItemText,
  Select,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { DatePicker } from '@mui/lab';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { MHidden } from '../../../components/@material-extend';

/*eslint-disable*/

export default function FixedStatusReview() {
  const token = localStorage.getItem('accessToken');
  const params = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [projectName, setProjectName] = useState('');
  const [projManagerName, setProjManagerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [actual, setActual] = useState('');
  const [description, setDescription] = useState('');
  const [resource, setResource] = useState([]);
  const [resourceUpdate, setResourceUpdate] = useState('');
  const [statusLOV, setStatusLOV] = useState([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(null);
  const [projectHighlights, setProjectHighlights] = useState('');
  const [supportManagement, setSupportManagement] = useState('');
  const [projeId, setProjeId] = useState('');
  const [projName, setProjName] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // State to control the position of the popover
  const [nextPrev, setNextPrev] = useState('');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0); // Track the current project index
  const [supportProject, setSupportProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scheduleVariance, setScheduleVariance] = useState();
  const [actionPoints, setActionPoints] = useState('');
  const [actions, setActions] = useState('');
  const [open, setOpen] = useState(false); // State to control drawer open/close
  const [data, setData] = useState([]);
  const [actionId, setActionId] = useState('');

  const weekNumber = params.weekNumber;
  const year = params.year;

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

  const currentDate = new Date();

  console.log('date cy', currentDate);

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

  const [riskIssue, setRiskIssue] = useState([
    {
      risk_id: '',
      riskIssue: '',
      impact: '',
      resolution: ''
    },
    {
      risk_id: '',
      riskIssue: '',
      impact: '',
      resolution: ''
    },
    {
      risk_id: '',
      riskIssue: '',
      impact: '',
      resolution: ''
    }
  ]);

  const handleInputChange = (index, header, value) => {
    const updatedData = [...tableData];
    updatedData[index][header] = value;
    setTableData(updatedData);
  };

  const handleInputChangeRisk = (index, header, value) => {
    const updatedData = [...riskIssue];
    updatedData[index][header] = value;
    setRiskIssue(updatedData);
  };

  function formatDateToDDMMYYYY(apiDateString) {
    if (!apiDateString) {
      return '';
    }

    const dateObject = new Date(apiDateString);
    const day = dateObject.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObject.getMonth()];
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
  }

  function getStandardWeekNumber(date) {
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));
    const week1 = new Date(currentDate.getFullYear(), 0, 1);
    const daysDifference = Math.floor((currentDate - week1) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.floor(daysDifference / 7) + 1;
    return weekNumber;
  }

  const today = new Date(); // Your date
  const standardWeekNumber = getStandardWeekNumber(today);
  console.log(`Week number (Standard): ${standardWeekNumber}`);

  const [showMessage, setShowMessage] = useState(false);

  const closeDialogUpdate = () => {
    window.history.back();
  };

  const fetchProjectdata = () => {
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getFixedWeekNOStatus/${weekNumber}/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('Response Support', res.data);
        setSupportProject(res.data);
        if (res.data.length > 0) {
          setProjectName(res.data[0].projectName);
          setProjManagerName(res.data[0].projectManager);
          setProjectHighlights(res.data[0].projectHighlights);
          setSupportManagement(res.data[0].supportManagement);
          setDescription(res.data[0].description);
          setStartDate(res.data[0].startDate);
          setActual(res.data[0].endDate);
          setProjeId(res.data[0].proj_Id);
          setResource(res.data[0].projectResource);
          setResourceUpdate(res.data[0].resource);
          setActions(res.data[0].action_Point);
          setTableData(res.data[0].mileStone); // Set tableData based on the API response
          if (res.data[0] && Array.isArray(res.data[0].fixedRiskMitigation)) {
            const tableDataFromAPI = res.data[0].fixedRiskMitigation.map((item) => ({
              risk_id: item.risk_id,
              riskIssue: item.riskIssue || '',
              impact: item.impact || '',
              resolution: item.resolution || ''
            }));
            console.log('table', tableDataFromAPI);
            setRiskIssue(tableDataFromAPI);
          }
          if (res.data[0] && Array.isArray(res.data[0].mileStone)) {
            const tableDataFromAPIs = res.data[0].mileStone.map((item) => ({
              milestone_Number: item.milestone_Number,
              milestone_Description: item.milestone_Description || '',
              status: item.status || '',
              target_Date: item.target_Date || '',
              actual_Date: item.actual_Date || '',
              remarks: item.remarks || ''
            }));
            console.log('table', tableDataFromAPIs);
            setTableData(tableDataFromAPIs);
            const isLastProject = currentProjectIndex === res.data.length - 1;
            if (isLastProject) {
              setShowMessage(true);
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  const updateProjectData = (index) => {
    if (supportProject[index] && supportProject[index].projectName) {
      setProjectName(supportProject[index].projectName);
      setProjManagerName(supportProject[index].projectManager);
      setProjectHighlights(supportProject[index].projectHighlights);
      setStartDate(supportProject[index].startDate);
      setActual(supportProject[index].endDate);
      setDescription(supportProject[index].description);
      setSupportManagement(supportProject[index].supportManagement);
      setResource(supportProject[index].projectResource);
      setResourceUpdate(supportProject[index].resource);
      setActions(supportProject[index].action_Point);
      if (Array.isArray(supportProject.fixedRiskMitigation)) {
        setRiskIssue(
          supportProject.fixedRiskMitigation.map((item) => ({
            risk_id: item.risk_id,
            riskIssue: item.riskIssue || '',
            impact: item.impact || '',
            resolution: item.resolution || ''
          }))
        );
      } else {
        // Handle the case when fixedRiskMitigation is not an array
        setRiskIssue([]);
      }
      console.log('riskIssues', riskIssue);
      setTableData(
        supportProject[index].mileStone.map((item) => ({
          milestone_Number: item.milestone_Number,
          milestone_Description: item.milestone_Description || '',
          status: item.status || '',
          target_Date: item.target_Date || '',
          actual_Date: item.actual_Date || '',
          remarks: item.remarks || ''
        }))
      );
    }
  };

  console.log('proj id', projeId);

  useEffect(() => {
    // Update the project data when the index changes
    updateProjectData(currentProjectIndex);
  }, [currentProjectIndex, supportProject]);

  // useEffect(() => {
  //   // Update the project data when the index changes
  //   updateProjectData(currentProjectIndex);
  // }, [currentProjectIndex, supportProject]);

  // const updateData = () => {
  //   // Increment the index
  //   setCurrentProjectIndex(currentProjectIndex + 1);

  //   // Check if there's another project available
  //   if (currentProjectIndex < supportProject.length) {
  //     updateProjectData(currentProjectIndex);
  //   }
  // };

  useEffect(() => {
    if (currentProjectIndex === supportProject.length - 1) {
      setShowMessage(true);
    }
  }, [currentProjectIndex, supportProject]);

  const updateData = () => {
    // Increment the index
    setCurrentProjectIndex(currentProjectIndex + 1);

    // Check if there's another project available
    if (currentProjectIndex < supportProject.length) {
      updateProjectData(currentProjectIndex);
    }
  };

  // Function to navigate to the previous project
  const previousData = () => {
    // Increment the index
    setCurrentProjectIndex(currentProjectIndex - 1);

    // Check if there's another project available
    if (currentProjectIndex < supportProject.length) {
      updateProjectData(currentProjectIndex);
    }
  };

  const isPreviousDisabled = currentProjectIndex <= 0;

  const isNextDisabled = currentProjectIndex >= supportProject.length - 1;

  const [opens, setOpens] = useState(false); // State to control the dialog
  const [rowToDelete, setRowToDelete] = useState(null); // State to track the row to delete

  const handleDeleteClick = (index) => {
    setRowToDelete(index); // Set the index of the row to delete
    setOpen(true); // Open the confirmation dialog
  };

  // const handleConfirmDelete = () => {
  //   // Delete the row using the index in rowToDelete
  //   deleteRow(rowToDelete);
  //   setRowToDelete(null); // Reset the row to delete
  //   setOpen(false); // Close the confirmation dialog
  // };

  const handleClose = () => {
    setRowToDelete(null); // Reset the row to delete
    setOpen(false); // Close the confirmation dialog
  };

  const closeMessage = () => {
    setShowMessage(false);
  };

  const [opened, setOpened] = useState(false); // State to control the dialog
  const [rowToDeleted, setRowToDeleted] = useState(null); // State to track the row to delete

  const handleDeleteClicked = (index) => {
    setRowToDeleted(index); // Set the index of the row to delete
    setOpened(true); // Open the confirmation dialog
  };

  // const handleConfirmDelete = () => {
  //   // Delete the row using the index in rowToDelete
  //   deleteRow(rowToDelete);
  //   setRowToDelete(null); // Reset the row to delete
  //   setOpen(false); // Close the confirmation dialog
  // };

  const handleClosed = () => {
    setRowToDeleted(null); // Reset the row to delete
    setOpened(false); // Close the confirmation dialog
  };
  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/getSchedulerVarience/${projectName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('SV', res.data);
        const responseData = res.data;
        if (responseData !== null && responseData !== 0) {
          setScheduleVariance(responseData);
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  });

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

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getActionPoint/${projectName}/${standardWeekNumber}/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('this is response data', res.data);
        setActionPoints(res.data.action_Points);
        setActionId(res.data.action_Id);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, [projectName]);

  console.log('action-id', actionId);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget); // Open the popover next to the button
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Close the popover
  };

  // Now, log the state after it's updated
  console.log('gt', statusLOV);

  useEffect(() => {
    fetchProjectdata();
  }, []);

  const fieldStyle = {
    border: '1px solid #ccc', // Add borders to the fields
    padding: '8px',
    borderRadius: '6px', // Rounded corners
    transition: 'box-shadow 0.3s', // Smooth transition for hover effect
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)' // Add shadow to the fields
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#008080'
  };

  // Apply hover effect on fields
  fieldStyle[':hover'] = {
    borderColor: 'blue' // Change border color on hover
  };
  const hrStyle = {
    // width: '100%',
    // height: '2px',
    // borderStyle: 'dotted',
    // background: 'linear-gradient(to right, yellow, green)'
    border: '1px solid black'
  };

  const updateStatus = async () => {
    try {
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createActionReview',
        {
          action_id: actionId,
          project_Name: projectName,
          project_Type: 'Support',
          week_No: weekNumber,
          year: year,
          action_Points: String(actionPoints)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Ok', response.data);
      setTimeout(() => {
        handleClosed();
      }, 1000);
      console.log('response status', response.status);
      enqueueSnackbar('Submitted Successfully', {
        autoHideDuration: 500,
        variant: 'success'
      });
      setSuccess(true);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error
        console.log('Validation error:', error.message);
        enqueueSnackbar('Error Occured in Submitted', {
          autoHideDuration: 2000,
          variant: 'error'
        });
      } else {
        // Other errors (network error, API response error, etc.)
        console.log('Error:', error);
        if (error.response) {
          console.log('Error response status', error.response.status);
          console.log('Error response data', error.response.data.message);
          enqueueSnackbar('Error Occured in Submitted', {
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

  const actionMail = async () => {
    try {
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/sendactionmail',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Ok', response.data);
      setTimeout(() => {
        handleClose();
      }, 1000);
      console.log('response status', response.status);
      enqueueSnackbar(response.data, {
        autoHideDuration: 1500,
        variant: 'success'
      });
      setSuccess(true);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error
        console.log('Validation error:', error.message);
        enqueueSnackbar('Unable to Send', {
          autoHideDuration: 2000,
          variant: 'error'
        });
      } else {
        // Other errors (network error, API response error, etc.)
        console.log('Error:', error);
        if (error.response) {
          enqueueSnackbar('Error Occured in Submitted', {
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

  const backNavigate = () => {
    window.history.back();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={30}>
        <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
          {/* {touched.avatarUrl && errors.avatarUrl} */}
        </FormHelperText>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: -5,
              p: 1
            }}
          >
            <Typography
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                backgroundColor: '#87CEEB',
                '@media (max-width: 768px)': {
                  ml: -40
                }
              }}
            >
              Fixed Bid Project Status Review Week of {weekNumber}
            </Typography>
            <Stack spacing={-1}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container direction="row" rowGap={2} sx={{ marginBottom: 2 }} style={fieldStyle}>
                  <Grid item xs={12} md={3}>
                    <Typography>
                      {' '}
                      <span style={labelStyle}>Project Name:</span> {projectName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography>
                      {' '}
                      <span style={labelStyle}>Start Date: </span>
                      {startDate &&
                        `${String(startDate).split('-')[2].slice(0, 2)}-${new Date(startDate).toLocaleString('en-us', {
                          month: 'short'
                        })}-${String(startDate).split('-')[0]}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography>
                      {' '}
                      <span style={labelStyle}>End Date:</span>
                      {/* {String(actual).slice(0, 10)} */}
                      {actual &&
                        `${String(actual).split('-')[2].slice(0, 2)}-${new Date(actual).toLocaleString('en-us', {
                          month: 'short'
                        })}-${String(actual).split('-')[0]}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography>
                      <span style={labelStyle}>Schedule Variance:</span>{' '}
                      {scheduleVariance !== null ? scheduleVariance : 'On Migration'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography>
                      <span style={labelStyle}>Project Manager:</span> {projManagerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <span style={labelStyle}>Consultant Name: </span>
                      {resource.map((projectResource, index) => (
                        <Typography key={index} display="inline">
                          {projectResource.name}
                          {index !== resource.length - 1 && ','}
                        </Typography>
                      ))}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography>
                      <span style={labelStyle}>Description:</span> {description}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <div
                style={{
                  marginTop: -1,
                  display: 'flex'
                  // justifyContent: 'space-between'
                }}
              >
                {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}> */}
                <TableContainer component={Paper} style={{ flex: 2, minHeight: 220 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ p: 0.1, color: '#008080' }}>Milestone</TableCell>
                        <TableCell sx={{ p: 0.1, color: '#008080', width: '400px' }}>Milestone Desc</TableCell>
                        <TableCell sx={{ p: 0.1, color: '#008080', width: '150px' }}>Status</TableCell>
                        <TableCell sx={{ p: 0.1, color: '#008080', width: '150px' }}>TargetDate</TableCell>
                        <TableCell sx={{ p: 0.1, color: '#008080', width: '150px' }}>CompletionDate</TableCell>
                        <TableCell sx={{ p: 0.1, color: '#008080', width: '200px' }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((rowData, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ p: 1 }}>
                            <Typography>{rowData.milestone_Number}</Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Typography>{rowData.milestone_Description}</Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Typography>{rowData.status}</Typography>
                          </TableCell>
                          <TableCell
                            sx={{ p: 1, color: parseISO(rowData.target_Date) < currentDate ? '#F30A49' : 'inherit' }}
                          >
                            <Typography>{formatDateToDDMMYYYY(rowData.target_Date)}</Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Typography>{formatDateToDDMMYYYY(rowData.actual_Date)}</Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Typography>{rowData.remarks}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <hr style={hrStyle} /> */}
                {/* </Paper> */}
              </div>
            </Stack>
            <Grid container direction="row" spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} md={5} sx={{ mt: 0.2, minHeight: 5 }}>
                {/* <Stack direction="row" spacing={1}> */}
                <Typography sx={fieldStyle} style={{ minHeight: 163 }}>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Project Highlights:</span>
                  <div style={{ whiteSpace: 'pre-line' }}>{projectHighlights}</div>{' '}
                </Typography>
              </Grid>
              <TableContainer sx={fieldStyle} component={Paper} style={{ flex: 1, marginTop: 18 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ p: 0.2, color: '#4CAF50' }}>Risk</TableCell>
                      <TableCell sx={{ p: 0.1, color: '#4CAF50' }}>Impact</TableCell>
                      <TableCell sx={{ p: 0.1, color: '#4CAF50' }}>Resolution</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskIssue.map((rowData, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ p: 1 }}>
                          <Typography>{rowData.riskIssue}</Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Typography>{rowData.impact}</Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Typography>{rowData.resolution}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <Divider orientation="vertical" /> */}
            </Grid>
            <Grid container direction="row" spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} md={6} sx={{ mt: -1 }}>
                <Typography sx={fieldStyle}>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Support Required from Management: </span>
                  {supportManagement}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mt: -1 }}>
                <Typography sx={fieldStyle}>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Resource Update: </span> {resourceUpdate}
                </Typography>
              </Grid>
              {/* </Stack> */}
            </Grid>
            <Box sx={{ mt: 1, ml: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button sx={{ color: 'red', backgroundColor: '#F3E5F5', mr: 1 }} onClick={() => handleDeleteClick()}>
                Dispatch Action Points
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    The Action points have been successfully dispatched to all meeting attendees
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={actionMail} color="primary">
                    Dispatch Action Points
                  </Button>
                </DialogActions>
              </Dialog>
              <Button sx={{ color: '#4CAF50', backgroundColor: '#F3E5F5', mr: 1 }} onClick={() => backNavigate()}>
                Back
              </Button>
              <Button
                sx={{ color: '#1E90FF', backgroundColor: '#F3E5F5', mr: 1 }}
                onClick={() => handleDeleteClicked()}
              >
                Action Points
              </Button>
              <Button onClick={handleOpenPopover} sx={{ color: '#008080', backgroundColor: '#F3E5F5', mr: 1 }}>
                List
              </Button>
              {/* <Button sx={{ color: '#666666', backgroundColor: '#F3E5F5', mr: 1 }} onClick={goToPreviousProject}>
                PREV
              </Button>
              <Button sx={{ color: '#9C27B0', backgroundColor: '#F3E5F5', mr: 1 }} onClick={updateData}>
                NEXT
              </Button> */}
              <IconButton
                aria-label="fingerprint"
                sx={{ mr: 1, backgroundColor: '#F3E5F5', color: '#666666' }}
                onClick={previousData}
                disabled={isPreviousDisabled}
              >
                <KeyboardDoubleArrowLeftIcon />
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                sx={{ color: '#9C27B0', backgroundColor: '#F3E5F5', mr: 1 }}
                onClick={updateData}
                disabled={isNextDisabled}
              >
                <KeyboardDoubleArrowRightIcon />
              </IconButton>
            </Box>
          </Card>
        </Grid>
      </Grid>{' '}
      <Dialog open={opened} onClose={handleClosed} maxWidth="md">
        <DialogTitle>Action Points</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <DialogContentText>
              <Typography sx={{ width: 200, mt: 1.5 }}>
                <span style={{ color: '#4a4a4a', fontWeight: 'bold' }}> Previous Week Points: </span>
                {actions}
              </Typography>{' '}
            </DialogContentText>
            <DialogContentText>
              <TextField
                sx={{ mt: 2, width: 400 }}
                rows={4}
                multiline
                label="Action Points"
                value={actionPoints}
                onChange={(e) => setActionPoints(e.target.value)}
              />{' '}
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosed} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={updateStatus}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          {supportProject.length > 0 ? (
            <List>
              {supportProject.map((item, index) => (
                <ListItem
                  key={item.id}
                  button
                  onClick={(e) => {
                    updateProjectData(index);
                    setAnchorEl(null); // Close the Popover
                    e.stopPropagation();
                  }}
                >
                  <ListItemText primary={item.projectName} />
                </ListItem>
              ))}
            </List>
          ) : (
            <div>Loading projects...</div>
          )}
        </Popover>
        {showMessage && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              padding: '20px',
              background: '#87CEEB',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p>The review for the Fixed Bit project has been successfully concluded.</p>
            <Button sx={{ color: 'red', mr: 1 }} onClick={closeMessage}>
              Close
            </Button>{' '}
          </div>
        )}
      </div>
    </Grid>
  );
}
