import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
// import { BarChart } from '@mui/x-charts/BarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Button, Divider, Grid, List, ListItem, ListItemText, Popover, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CustomLegend from './CustomLegend';

/*eslint-disable*/

export default function DashboardReview() {
  const params = useParams();
  const [projectName, setProjectName] = useState([]);
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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line prefer-destructuring

  const token = localStorage.getItem('accessToken');
  console.log('Year', currentYear);

  console.log('ticket', ticketSummary);

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

  const previousWeek = standardWeekNumber - 1;
  console.log('PreviousWeek', previousWeek);
  console.log('standardWeekNumber', standardWeekNumber);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setCurrentYear(currentYear);
  }, []);

  useEffect(() => {
    axios
      .get(`https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/getAllProjects`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('this is response data', res.data);
        console.log('params', params);

        const newArr = res.data.filter((val) => {
          return val.proj_Name == params.projectName;
        });

        console.log('newarr234', newArr);
        setProjectName(newArr[0].proj_Name);
        setStartDate(newArr[0].start_Date);
        setEndDate(newArr[0].end_Date);
        setProjectManager(newArr[0].project_Manager);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, [projectName]);

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getSupportWeekNOStatus/${previousWeek}/${currentYear}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((response) => {
        console.log('This Is Response Data', response.data);
        console.log('This Is Params Id', params.projectName);

        const newArr = response.data.filter((val) => {
          return val.projectName == params.projectName;
        });
        console.log('newArr', newArr);
        setCurrentProjectIndex(0);
        setResource(newArr[0].resource);
        setReported(newArr[0].repoted);
        setClosed(newArr[0].closed);
        setTicketSummary(newArr[0].openTicketSummary);
        setProjectHighlights(newArr[0].projectHighlights);
        setResourceUpdate(newArr[0].projectResource);
        setCustomerRequest(newArr[0].no_Cr);
        setCustomerRequestOne(newArr[0].no_CR_Reff);
        setServiceRequest(newArr[0].no_Sr);
        setServiceRequestOne(newArr[0].no_SR_Reff);
        setRisk(newArr[0].riskMitigation);
      })
      .catch((err) => {
        console.log('Error', err);
      });

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
        Support Project Status Review Week of {previousWeek}
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
            {startDate &&
              `${String(startDate).split('-')[2].slice(0, 2)}-${new Date(startDate).toLocaleString('en-us', {
                month: 'short'
              })}-${String(startDate).split('-')[0]}`}{' '}
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
              <Typography style={labelStyle}>Open Tickets {previousWeek}</Typography>
              {ticketSummary.map((summary, index) => (
                <Stack direction="row" spacing={2} key={`openTicketSummary${index}`}>
                  {summary.projectModule && <Typography>{summary.projectModule} :</Typography>}
                  <Typography>{summary.moduleCount}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={9.5} sx={{ borderRight: '2px solid black' }}>
            <Typography style={labelStyle}>Last 4 Week Status {projectName}</Typography>
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
          <Typography style={labelStyle}>Project Overall Summary for {projectName}</Typography>
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
    </>
  );
}
