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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
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
  // eslint-disable-next-line prefer-destructuring
  const weekNumber = params.weekNumber;
  const year = params.year;

  const token = localStorage.getItem('accessToken');
  console.log('Year', year);
  console.log('WeekNumber', weekNumber);
  console.log('ticket', ticketSummary);

  const fetchProjectdata = () => {
    axios
      .get(
        `https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getSupportWeekNOStatus/${weekNumber}/${year}`,
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
    }
  };

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

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getOverAllProjStatusfchart/${projectName}`,
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
      })
      .catch((err) => {
        console.log('chart', err);
      });

    axios
      .get(`https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getPrevWeekData/${projectName}`, {
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
        `https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/getSchedulerVarience/${projectName}`,
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

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getActionPoint/${projectName}/${standardWeekNumber}/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('this is response data', res.data);
        setActionPoints(res.data);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, [projectName]);

  console.log('4444', actionPoints);

  const updateStatus = async () => {
    try {
      const response = await axios.post(
        'https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/createActionReview',
        {
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
    color: '#FF8080'
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
          backgroundColor: '#FF8080',
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
            <span style={labelStyle}>End Date:</span>
            {/* {String(endDate).slice(0, 10)} */}
            {endDate &&
              `${String(endDate).split('-')[2].slice(0, 2)}-${new Date(endDate).toLocaleString('en-us', {
                month: 'short'
              })}-${String(endDate).split('-')[0]}`}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            <span style={labelStyle}>Resource:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {resourceUpdate.map((resource, index) => (
                <Typography key={index} style={{ whiteSpace: 'nowrap', marginRight: '8px' }}>
                  {resource.name},
                </Typography>
              ))}
            </div>
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            <span style={labelStyle}>Project Manager:</span> {projectManager}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            <span style={labelStyle}>Schedule Variance:</span> {scheduleVariance}{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>Inc/Req Reported:</span> {reported}{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>
            {' '}
            <span style={labelStyle}>Inc/Req Closed:</span> : {closed}{' '}
          </Typography>
          <Divider orientation="vertical" />
        </Grid>
      </Grid>

      <hr style={hrStyle} />
      <Grid container direction="row" spacing={3}>
        <Grid container item xs={12} md={8}>
          <Grid item xs={12} md={2.5} sx={{ borderRight: '2px solid black' }}>
            <Stack spacing={2}>
              <Typography style={labelStyle}>Open Tickets {weekNumber}</Typography>
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
                    <Bar dataKey="closed" fill="#228B22" name="Closed" />
                    <Bar dataKey="module_TOTAL" fill="#FF0000" name="Open" />
                    <Bar dataKey="repoted" fill="#4169E1" name="Reported" />
                  </BarChart>
                </div>
              ))}
            </Stack>
            <CustomLegend />
          </Grid>
        </Grid>

        <Grid direction="row" item xs={12} md={4}>
          <Typography style={labelStyle}>Project Overall Status</Typography>
          <BarChart width={150} height={150} data={chartSupport}>
            <XAxis dataKey="name" />
            <YAxis />
            {/* <CartesianGrid strokeDasharray="2 2" /> */}
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="total_CLOSED" fill="#228B22" name="Closed" />
            <Bar dataKey="total_MODULE_TOTAL" fill="#FF0000" name="Open" />
            <Bar dataKey="total_REPOTED" fill="#4169E1" name="Reported" />
          </BarChart>
          <CustomLegend />
        </Grid>
      </Grid>
      <hr style={hrStyle} />
      <Grid container direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={5} sx={{ mt: 1 }}>
          <Typography sx={fieldStyle}>
            <span style={labelStyle}>Project Highlight:</span> {projectHighlights}
          </Typography>
        </Grid>
        <Grid item xs={12} md={7} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={2}>
            <Typography sx={fieldStyle}>
              <span style={labelStyle}>Resource Update: </span>
              {resource}
            </Typography>
            <Typography sx={fieldStyle}>
              <span style={labelStyle}>CR: </span> {customerRequest}/{customerRequestOne}
            </Typography>
            <Typography sx={fieldStyle}>
              <span style={labelStyle}>SR: </span> {serviceRequest}/{serviceRequestOne}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Typography sx={fieldStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {risk.map((risk, index) => (
            <div
              key={risk.risk_mitigation_id}
              style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}
            >
              {risk.riskNo && (
                <div>
                  <span style={{ color: '#FF8080', fontWeight: 'bold' }}>Risk: </span>
                  {risk.riskNo}
                </div>
              )}
              {risk.riskPlan && (
                <div>
                  <span style={{ color: '#4BB543', fontWeight: 'bold' }}>Mitigation Plan: </span>
                  {risk.riskPlan}
                </div>
              )}
            </div>
          ))}
          {/* Conditionally render "Risk" and "Mitigation Plan" here */}
          {!risk.length && (
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
              <div>
                <span style={{ color: '#FF8080', fontWeight: 'bold' }}>Risk: </span>
                <span style={{ color: '#FF8080', fontWeight: 'bold', marginLeft: 150 }}>Risk: </span>
                <span style={{ color: '#FF8080', fontWeight: 'bold', marginLeft: 150 }}>Risk: </span>
              </div>
              <div>
                <span style={{ color: '#4BB543', fontWeight: 'bold' }}>Mitigation Plan: </span>
                <span style={{ color: '#4BB543', fontWeight: 'bold', marginLeft: 67 }}>Mitigation Plan: </span>
                <span style={{ color: '#4BB543', fontWeight: 'bold', marginLeft: 67 }}>Mitigation Plan: </span>
              </div>
            </div>
          )}
        </div>
      </Typography>
      <Box sx={{ mt: 1, ml: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          sx={{ mr: 1, backgroundColor: '#B2C8BA' }}
          variant="contained"
          onClick={() => backNavigate()}
        >
          Back
        </Button>
        <Button size="small" sx={{ mr: 1 }} variant="contained" onClick={() => handleDeleteClick()}>
          Action Points
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleOpenPopOver}
          sx={{
            mr: 1,
            backgroundColor: '  #ffcccc',
            color: 'black',
            height: 30
            // '@media (max-width: 768px)': {
            //   width: 120,
            //   ml: 83,
            //   mt: -106
            // }
          }}
        >
          List
        </Button>
        <Button size="small" sx={{ mr: 1, backgroundColor: '#666666' }} variant="contained" onClick={previousData}>
          PREV
        </Button>
        <Button size="small" sx={{ backgroundColor: '#5900a6' }} variant="contained" onClick={updateData}>
          NEXT
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Action Points</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <DialogContentText>
              {/* <TextField
              sx={{ mt: 2, width: 400 }}
              rows={4}
              multiline
              label="Action Points"
              value={actionPoints}
              onChange={(e) => setActionPoints(e.target.value)}
            />{' '} */}
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
      </div>
    </>
  );
}
