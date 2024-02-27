/* eslint-disable react/style-prop-object */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
// import { BarChart } from '@mui/x-charts/BarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Card,
  DialogTitle
} from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CustomLegend from './CustomLegend';

/*eslint-disable*/

// eslint-disable-next-line import/no-named-as-default

export default function SupportProjectReview() {
  const params = useParams();
  const [projectName, setProjectName] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [resource, setResource] = useState('');
  const [reported, setReported] = useState('');
  const [closed, setClosed] = useState('');
  const [ticketSummary, setTicketSummary] = useState([]);
  const [chartSupport, setChartSupport] = useState([]);
  const [closedCount, setClosedCount] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [reportedCount, setReportedCount] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [supportProject, setSupportProject] = useState([]);
  const [prevChart, setPevChart] = useState([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [projectHighlights, setProjectHighlights] = useState('');
  const [resourceUpdate, setResourceUpdate] = useState([]);
  const [customerRequest, setCustomerRequest] = useState('');
  const [customerRequestOne, setCustomerRequestOne] = useState('');
  const [serviceRequest, setServiceRequest] = useState('');
  const [serviceRequestOne, setServiceRequestOne] = useState('');
  const [scheduleVariance, setScheduleVariance] = useState('');
  const [risk, setRisk] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [actionPoints, setActionPoints] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [actions, setActions] = useState('');
  const [actionId, setActionId] = useState('');
  // eslint-disable-next-line prefer-destructuring
  const weekNumber = params.weekNumber;
  const year = params.year;

  const [showMessage, setShowMessage] = useState(false);

  const token = localStorage.getItem('accessToken');
  console.log('Year', year);
  console.log('WeekNumber', weekNumber);
  console.log('ticket', ticketSummary);

  const fetchProjectdata = () => {
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getSupportWeekNOStatus/${weekNumber}/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('Response Support', res.data[0].action_Point);
        setSupportProject(res.data);
        if (res.data.length > 0) {
          setCurrentProjectIndex(0);
          setProjectName(res.data[0].projectName);
          setStartDate(res.data[0].startDate);
          setEndDate(res.data[0].endDate);
          setProjectManager(res.data[0].projectManager);
          setResource(res.data[0].resource);
          setReported(res.data[0].repoted);
          setClosed(res.data[0].closed);
          setTicketSummary(res.data[0].openTicketSummary);
          setProjectHighlights(res.data[0].projectHighlights);
          setResourceUpdate(res.data[0].projectResource);
          setCustomerRequest(res.data[0].no_Cr);
          setCustomerRequestOne(res.data[0].no_CR_Reff);
          setServiceRequest(res.data[0].no_Sr);
          setServiceRequestOne(res.data[0].no_SR_Reff);
          setRisk(res.data[0].riskMitigation);
          setActions(res.data[0].action_Point);
          const isLastProject = currentProjectIndex === res.data.length - 1;
          if (isLastProject) {
            setShowMessage(true);
          }
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };
  console.log('first', actions);

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

  const updateProjectData = (index) => {
    if (supportProject[index] && supportProject[index].projectName) {
      setProjectName(supportProject[index].projectName);
      setStartDate(supportProject[index].startDate);
      setEndDate(supportProject[index].endDate);
      setProjectManager(supportProject[index].projectManager);
      setResource(supportProject[index].resource);
      setReported(supportProject[index].repoted);
      setClosed(supportProject[index].closed);
      setTicketSummary(supportProject[index].openTicketSummary);
      setProjectHighlights(supportProject[index].projectHighlights);
      setResourceUpdate(supportProject[index].projectResource);
      setCustomerRequest(supportProject[index].no_Cr);
      setCustomerRequestOne(supportProject[index].no_CR_Reff);
      setServiceRequest(supportProject[index].no_Sr);
      setServiceRequestOne(supportProject[index].no_SR_Reff);
      setRisk(supportProject[index].riskMitigation);
      setActions(supportProject[index].action_Point);
    }
  };

  useEffect(() => {
    // Update the project data when the index changes
    updateProjectData(currentProjectIndex);
  }, [currentProjectIndex, supportProject]);

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

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getOverAllProjStatusfchart/${projectName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('supportChart', res.data);
        setChartSupport(res.data);
        setClosedCount(res.data[0].total_CLOSED);
        setTotalCount(res.data[0].total_MODULE_TOTAL);
        setReportedCount(res.data[0].total_REPOTED);
      })
      .catch((err) => {
        console.log('chart', err);
      });

    axios
      .get(`https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getPrevWeekData/${projectName}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('supportChart', res.data);
        setPevChart(res.data);
      })
      .catch((err) => {
        console.log('chart', err);
      });

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
        console.log('scheduleVariance', res.data);
        setScheduleVariance(res.data);
      })
      .catch((err) => {
        console.log('chart', err);
      });
  }, [projectName]);

  console.log('total', totalCount);

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

  console.log('Action-id', actionId);

  console.log('4444', actionPoints);

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
        handleClose();
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
        handleCloses();
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

  const [opens, setOpens] = useState(false); // State to control the dialog
  const [rowToDeletes, setRowToDeletes] = useState(null); // State to track the row to delete

  const handleDeleteClicks = (index) => {
    setRowToDeletes(index); // Set the index of the row to delete
    setOpens(true); // Open the confirmation dialog
  };

  const handleCloses = () => {
    setRowToDeletes(null); // Reset the row to delete
    setOpens(false); // Close the confirmation dialog
  };

  const [open, setOpen] = useState(false); // State to control the dialog
  const [rowToDelete, setRowToDelete] = useState(null); // State to track the row to delete

  const handleDeleteClick = (index) => {
    setRowToDelete(index); // Set the index of the row to delete
    setOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    // Delete the row using the index in rowToDelete
    // deleteRow(rowToDelete);
    setRowToDelete(null); // Reset the row to delete
    setOpen(false); // Close the confirmation dialog
  };

  const handleClose = () => {
    setRowToDelete(null); // Reset the row to delete
    setOpen(false); // Close the confirmation dialog
  };

  useEffect(() => {
    fetchProjectdata();
  }, []);

  useEffect(() => {
    // Update the project data when the index changes
    updateProjectData(currentProjectIndex);
  }, [currentProjectIndex, supportProject]);

  const handleOpenPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleClosePopOver = (event) => {
  //   setAnchorEl(null);
  // };

  const closeMessage = () => {
    setShowMessage(false);
  };

  const handleClosePopOver = (event) => {
    // Check if the event target is not a project list item
    if (!event.target.classList.contains('project-list-item')) {
      setAnchorEl(null);
    }
  };

  const hrStyle = {
    // width: '100%',
    // height: '2px',
    // borderStyle: 'dotted',
    // background: 'linear-gradient(to right, yellow, green)'
    border: '1px solid black'
  };

  const fieldStyle = {
    border: '1px solid #ccc', // Add borders to the fields
    padding: '4px',
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

  const backNavigate = () => {
    window.history.back();
  };

  return (
    <>
      <Typography
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#87CEEB',
          mt: -3,
          '@media (max-width: 768px)': {
            ml: -40
          }
        }}
      >
        Support Project Status Review Week of {weekNumber}
      </Typography>
      <Grid container direction="row" sx={{ marginBottom: 2 }} style={fieldStyle}>
        <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>Project Name:</span> {projectName}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            <span style={labelStyle}>Project Manager:</span> {projectManager}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>Start Date: </span>
            {/* {String(startDate).slice(0, 10)} */}
            {startDate &&
              `${String(startDate).split('-')[2].slice(0, 2)}-${new Date(startDate).toLocaleString('en-us', {
                month: 'short'
              })}-${String(startDate).split('-')[0]}`}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>End Date: </span>
            {/* {String(endDate).slice(0, 10)} */}
            {endDate &&
              `${String(endDate).split('-')[2].slice(0, 2)}-${new Date(endDate).toLocaleString('en-us', {
                month: 'short'
              })}-${String(endDate).split('-')[0]}`}
          </Typography>
        </Grid>

        {/* <Grid item xs={12} md={3}>
          <Typography style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={labelStyle}>Resource: </span>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {resourceUpdate.map((resource, index) => (
                <Typography key={index} style={{ whiteSpace: 'nowrap', marginRight: '8px' }}>
                  {resource.name},
                </Typography>
              ))}
            </div>
          </Typography>
        </Grid> */}
        {/* <Grid item xs={12} md={3}>
          <Typography style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={labelStyle}>Resource:</span>
            {resourceUpdate.map((resource, index) => (
              <Typography key={index} component="span" style={{ whiteSpace: 'nowrap', marginRight: '8px' }}>
                {resource.name},
              </Typography>
            ))}
          </Typography>
        </Grid> */}
        {/* <Grid item xs={12} md={3}>
          <Typography>
            <span style={labelStyle}>Project Manager:</span> {projectManager}
          </Typography>
        </Grid> */}
        {/* <Grid item xs={12} md={3}>
          <Typography>
            <span style={labelStyle}>Schedule Variance:</span> {scheduleVariance}{' '}
          </Typography>
        </Grid> */}
        {/* <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>Inc/Req Reported:</span> {reported}{' '}
          </Typography>
        </Grid> */}
        {/* <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>Inc/Req Closed:</span> : {closed}{' '}
          </Typography>
          <Divider orientation="vertical" />
        </Grid> */}
        <Grid item xs={12} md={12}>
          <Typography>
            <span style={labelStyle}>ConsultantName:</span>
            {resourceUpdate.map((resource, index) => (
              <Typography key={index} display="inline">
                {resource.name},
              </Typography>
            ))}
          </Typography>
        </Grid>
      </Grid>

      <hr style={hrStyle} />
      <Grid container direction="row" spacing={3}>
        <Grid container item xs={12} md={8}>
          <Grid item xs={12} md={2.5} sx={{ borderRight: '2px solid black' }}>
            <Stack spacing={0.5}>
              <Typography>
                {' '}
                <span style={labelStyle}>Inc/Req Reported:</span> {reported}{' '}
              </Typography>
              <Typography>
                {' '}
                <span style={labelStyle}>Inc/Req Closed</span> : {closed}{' '}
              </Typography>
              <Typography style={labelStyle}>Open Tickets</Typography>
              {ticketSummary.map((summary, index) => (
                <Stack direction="row" spacing={2} key={`openTicketSummary${index}`}>
                  {summary.projectModule && <Typography>{summary.projectModule} :</Typography>}
                  <Typography>{summary.moduleCount}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={9.5} sx={{ borderRight: '2px solid black' }}>
            <Typography style={labelStyle}>Last 4 Weeks Status</Typography>
            <Stack direction="row">
              {prevChart.map((chartData, index) => (
                <div key={index} style={{ margin: 'none' }}>
                  <BarChart width={150} height={150} data={[chartData]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week_NO" />
                    <YAxis />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Bar dataKey="repoted" fill="#4169E1" name="Reported" />
                    <Bar dataKey="closed" fill="#228B22" name="Closed" />
                    <Bar dataKey="module_TOTAL" fill="#FF0000" name="Open" />
                  </BarChart>
                </div>
              ))}
            </Stack>
            <CustomLegend />
          </Grid>
        </Grid>

        <Grid direction="row" item xs={12} md={4}>
          <Typography style={labelStyle}>Project Overall Status</Typography>
          <Stack direction="row">
            <BarChart width={150} height={150} data={chartSupport}>
              <XAxis dataKey="name" />
              <YAxis />
              {/* <CartesianGrid strokeDasharray="2 2" /> */}
              <Tooltip />
              {/* <Legend /> */}
              <Bar dataKey="total_REPOTED" fill="#4169E1" name="Reported" />
              <Bar dataKey="total_CLOSED" fill="#228B22" name="Closed" />
              <Bar dataKey="total_MODULE_TOTAL" fill="#FF0000" name="Open" />
            </BarChart>
            <div style={{ flexDirection: 'row' }}>
              <Typography sx={{ ml: 7, mt: 2, color: '#4169E1' }}>Reported: {reportedCount}</Typography>
              <Typography sx={{ ml: 7, mt: 2, color: '#228B22' }}>Closed: {closedCount}</Typography>
              <Typography sx={{ ml: 7, mt: 2, color: '#FF0000' }}>Open: {totalCount}</Typography>
            </div>
          </Stack>
          <CustomLegend />
        </Grid>
      </Grid>
      <hr style={hrStyle} />
      <Grid container direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Typography sx={fieldStyle} style={{ minHeight: 150 }}>
            <span style={{ color: '#008080', fontWeight: 'bold' }}>Project Highlights:</span>
            <div style={{ whiteSpace: 'pre-line' }}>{projectHighlights}</div>{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{ mt: 1 }}>
          <Typography sx={fieldStyle} style={{ minHeight: 150 }}>
            <span style={labelStyle}>Resource Update: </span> {resource}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{ mt: 1 }}>
          <Typography sx={fieldStyle} style={{ minHeight: 75, overflow: 'hidden' }}>
            <span style={labelStyle}>CR: </span>
            {customerRequest}/{customerRequestOne}
          </Typography>
          <Typography sx={fieldStyle} style={{ minHeight: 75, overflow: 'hidden' }}>
            <span style={labelStyle}>SR: </span> {serviceRequest}/{serviceRequestOne}
          </Typography>
        </Grid>
      </Grid>
      <Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Grid container direction="row" spacing={2} sx={{ marginBottom: 2 }}>
            {risk.map((risk, index) => (
              <Grid item key={index} xs={12} md={4} sx={{ mt: 0.5 }}>
                <Typography sx={fieldStyle}>
                  <span style={{ color: '#1E90FF', fontWeight: 'bold' }}>Risk: </span>
                  {risk.riskNo}
                  <br />
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Mitigation Plan: </span>
                  {risk.riskPlan}
                </Typography>
              </Grid>
            ))}
          </Grid>
          {!risk.length && (
            <Grid container direction="row" spacing={2} sx={{ marginBottom: 2 }}>
              {[1, 2, 3].map((_, index) => (
                <Grid item key={index} xs={12} md={4} sx={{ mt: 1 }}>
                  <Typography sx={fieldStyle}>
                    <div>
                      <span style={{ color: '#1E90FF', fontWeight: 'bold' }}>Risk: </span>
                      {/* <span style={{ color: '#1E90FF', fontWeight: 'bold', marginLeft: 150 }}>Risk: </span>
                      <span style={{ color: '#1E90FF', fontWeight: 'bold', marginLeft: 150 }}>Risk: </span> */}
                    </div>
                    <div>
                      <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Mitigation Plan: </span>
                      {/* <span style={{ color: '#4CAF50', fontWeight: 'bold', marginLeft: 67 }}>Mitigation Plan: </span>
                      <span style={{ color: '#4CAF50', fontWeight: 'bold', marginLeft: 67 }}>Mitigation Plan: </span> */}
                    </div>
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </Typography>
      <Box sx={{ mt: 1, ml: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button sx={{ color: 'red', backgroundColor: '#F3E5F5', mr: 75 }} onClick={() => handleDeleteClicks()}>
          Dispatch Action Points
        </Button>
        <Dialog open={opens} onClose={handleCloses}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The Action points have been successfully dispatched to all meeting attendees
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloses} color="primary">
              Cancel
            </Button>
            <Button onClick={actionMail} color="primary">
              Dispatch Action Points
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          sx={{ color: '#4CAF50', backgroundColor: '#F3E5F5', mr: 1 }}
          // sx={{ mr: 1, backgroundColor: '#4CAF50', color: 'white' }} // Green color,
          // variant="contained"
          onClick={() => backNavigate()}
        >
          Back
        </Button>
        <Button sx={{ color: '#1E90FF', backgroundColor: '#F3E5F5', mr: 1 }} onClick={() => handleDeleteClick()}>
          Action Points
        </Button>
        <Button onClick={handleOpenPopOver} sx={{ color: '#008080', backgroundColor: '#F3E5F5', mr: 1 }}>
          List
        </Button>
        <IconButton
          sx={{ mr: 1, backgroundColor: '#F3E5F5', color: '#666666' }}
          onClick={previousData}
          disabled={isPreviousDisabled}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton
          sx={{ color: '#9C27B0', backgroundColor: '#F3E5F5', mr: 1 }}
          onClick={updateData}
          disabled={isNextDisabled}
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Action Points</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <DialogContentText>
              <Typography sx={{ width: 200, mt: 1.5 }}>
                <span style={{ color: '#4a4a4a', fontWeight: 'bold' }}> Previous Week Points: </span>
                {actions}
              </Typography>
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
          <Button onClick={handleClose} color="primary">
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
          onClose={handleClosePopOver}
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
                  className="project-list-item" // Add this class name
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
            <p>The review for the Support project has been successfully concluded.</p>
            <Button sx={{ color: 'red', mr: 1 }} onClick={closeMessage}>
              Close
            </Button>{' '}
          </div>
        )}
      </div>
    </>
  );
}
