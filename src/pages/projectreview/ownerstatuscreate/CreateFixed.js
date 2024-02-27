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
  MenuItem,
  Select,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box
} from '@mui/material';
import { DatePicker, LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { MHidden } from '../../../components/@material-extend';
import { PATH_DASHBOARD } from '../../../routes/paths';

/*eslint-disable*/

export default function CreateFixed() {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
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
  const [reviewDate, setReviewDate] = useState('');
  const [formValues, setFormValues] = useState();
  const [currentWeekNumber, setCurrentWeekNumber] = useState(null);
  const [projectHighlights, setProjectHighlights] = useState('');
  const [supportManagement, setSupportManagement] = useState('');
  const [loading, setLoading] = React.useState(false);

  const [projeId, setProjeId] = useState('');

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

  const [tableData, setTableData] = useState([
    {
      milestone_Number: 'Milestone 1',
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

    const dateParts = apiDateString.split('T')[0].split('-');
    if (dateParts.length !== 3) {
      return ''; // Invalid date format
    }

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    return `${year}-${month}-${day}`;
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

  const closeDialogUpdate = () => {
    window.history.back();
  };

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

        setProjectName(newArr.proj_Name);
        setProjManagerName(newArr.project_Manager);
        setStartDate(newArr.start_Date);
        setActual(newArr.end_Date);
        setDescription(newArr.description);
        if (newArr && Array.isArray(newArr.milestone)) {
          // Map the 'milestone' array to the 'tableData' format
          const tableDataFromAPI = newArr.milestone.map((item) => ({
            milestone_Id: item.milestone_Id,
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
        setResource(
          newArr.emp_Projects.map((val) => {
            return val.name;
          })
        );
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, []);

  console.log('8', resource);

  console.log('90', resource);

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  useEffect(() => {
    console.log('standardWeekNumber:', standardWeekNumber);
    console.log('proj Name', projectName);
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getFixeddetails/${projectName}/${standardWeekNumber}/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        const newWeekNumber = getStandardWeekNumber(new Date());
        if (newWeekNumber !== currentWeekNumber) {
          setFormValues(res.data);
          setCurrentWeekNumber(newWeekNumber);
        }
        console.log('response data', res.data);
        console.log('params', params);
        setProjectHighlights(res.data[0].projectHighlights);
        setSupportManagement(res.data[0].supportManagement);
        setProjeId(res.data[0].proj_Id);
        setResourceUpdate(res.data[0].resource);
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
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local storage', JSON.parse(localStorage.getItem('Details')));
  }, [projectName]);

  console.log('proj id', projeId);

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

  const saveStatus = async () => {
    try {
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateFixedProject',
        {
          projectName: String(projectName),
          projectManager: String(projManagerName),
          resource: String(resourceUpdate),
          reviewDate: String(actual),
          projectHighlights: String(projectHighlights),
          supportManagement: String(supportManagement),
          mileStone: tableData,
          fixedRiskMitigation: riskIssue
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Ok', response.data);
      enqueueSnackbar('Created Successfully', {
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

  // const updateStatus = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateFixedProject',
  //       {
  //         proj_Id: projeId,
  //         projectName: String(projectName),
  //         projectManager: String(projManagerName),
  //         resource: String(resourceUpdate),
  //         reviewDate: String(actual),
  //         projectHighlights: String(projectHighlights),
  //         supportManagement: String(supportManagement),
  //         mileStone: tableData,
  //         fixedRiskMitigation: riskIssue
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + token
  //         }
  //       }
  //     );
  //     console.log('Ok', response.data);
  //     setLoading(true);
  //     setTimeout(() => {
  //       navigate(PATH_DASHBOARD.review.findProject);
  //     }, 1000);
  //     enqueueSnackbar('Submitted Successfully', {
  //       autoHideDuration: 2000,
  //       variant: 'success'
  //     });

  //     setSuccess(true);
  //     console.log('response status', response.status);
  //     // navigate(PATH_DASHBOARD.admin.userManagement);
  //   } catch (error) {
  //     if (error.name === 'ValidationError') {
  //       // Yup validation error
  //       console.log('Validation error:', error.message);
  //       enqueueSnackbar(error.message, {
  //         autoHideDuration: 2000,
  //         variant: 'error'
  //       });
  //     } else {
  //       // Other errors (network error, API response error, etc.)
  //       console.log('Error:', error);
  //       if (error.response) {
  //         console.log('Error response status', error.response.status);
  //         console.log('Error response data', error.response.data.message);
  //         enqueueSnackbar(error.response.data.message, {
  //           autoHideDuration: 2000,
  //           variant: 'error'
  //         });
  //       } else {
  //         console.log('Network error or request was canceled:', error.message);
  //         // Handle other types of errors here
  //       }
  //     }
  //     setLoading(true);
  //   }

  const updateStatus = async () => {
    setLoading(true);

    try {
      // Check if projectHighlights is empty or not provided
      if (!projectHighlights) {
        throw new Error('Please fill in the Project Highlights field.');
      }

      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateFixedProject',
        {
          proj_Id: projeId,
          projectName: String(projectName),
          projectManager: String(projManagerName),
          resource: String(resourceUpdate),
          reviewDate: String(actual),
          projectHighlights: String(projectHighlights),
          supportManagement: String(supportManagement),
          mileStone: tableData,
          fixedRiskMitigation: riskIssue
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Ok', response.data);
      setLoading(false);
      setTimeout(() => {
        navigate(PATH_DASHBOARD.review.findProject);
      }, 1000);
      enqueueSnackbar('Submitted Successfully', {
        autoHideDuration: 2000,
        variant: 'success'
      });

      setSuccess(true);
      console.log('response status', response.status);
    } catch (error) {
      if (error.message === 'Please fill in the Project Highlights field.') {
        // Handle specific error message for missing projectHighlights
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
      setLoading(false);
    }
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
                fontWeight: 'bold',
                textAlign: 'center',
                '@media (max-width: 768px)': {
                  ml: -40
                }
              }}
            >
              Fixed Bid Project Status Update Week of {standardWeekNumber}
            </Typography>
            <Stack spacing={3}>
              <Stack sx={{ mt: 1 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                {/* <Typography>Project Name</Typography> */}
                <TextField
                  disabled
                  size="small"
                  sx={{
                    '@media (max-width: 768px)': {
                      width: 400
                    }
                  }}
                  // disabled
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <TextField
                  disabled
                  size="small"
                  // disabled
                  sx={{
                    '@media (max-width: 768px)': {
                      width: 400
                    }
                  }}
                  label="Project Manager"
                  value={projManagerName}
                  onChange={(e) => setProjManagerName(e.target.value)}
                />
                <FormControl
                  sx={{
                    '@media (max-width: 768px)': {
                      width: 400
                    }
                  }}
                >
                  <DatePicker
                    disabled
                    required
                    label="Start Date"
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
                    onChangeRaw={(e) => e.preventDefault()}
                    onKeyDown={(e) => e.preventDefault()}
                    // disabled={isLoading}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </FormControl>
                <TextField
                  disabled
                  size="small"
                  // disabled
                  label="Resource"
                  rows={4}
                  multiline
                  sx={{ width: 380 }}
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                />
              </Stack>
              <Stack sx={{ mt: 1 }} direction={{ xs: 'column', sm: 'row' }}>
                <FormControl
                  sx={{
                    mt: -8,
                    '@media (max-width: 768px)': {
                      mt: -0.5,
                      width: 400
                    }
                  }}
                >
                  <DatePicker
                    disabled
                    required
                    label="Target Date"
                    value={actual}
                    inputFormat="dd/MM/yyyy"
                    disablePast
                    onChange={(newValue) => {
                      if (newValue) {
                        const parseddate = format(newValue, 'yyyy-MM-dd');

                        setActual(parseddate);

                        console.log('actual', parseddate);
                      } else {
                        setActual('');
                      }
                    }}
                    onChangeRaw={(e) => e.preventDefault()}
                    onKeyDown={(e) => e.preventDefault()}
                    // disabled={isLoading}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </FormControl>
                <TextField
                  // sx={{ mt: -8 }}
                  size="small"
                  disabled
                  label="Project Description"
                  rows={2}
                  multiline
                  sx={{
                    mt: -10,
                    ml: 2,
                    width: 450,
                    '@media (max-width: 768px)': {
                      mt: 2,
                      ml: -0.5,
                      width: 400
                    }
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Stack>
              <div
                style={{
                  marginTop: 1
                }}
              >
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ p: 1 }}>Milestone</TableCell>
                        <TableCell sx={{ p: 1 }}>Milestone Desc</TableCell>
                        <TableCell sx={{ p: 1 }}>Status</TableCell>
                        <TableCell sx={{ p: 1 }}>Target date</TableCell>
                        <TableCell sx={{ p: 1 }}>Completion Date</TableCell>
                        <TableCell sx={{ p: 1 }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    {/* <TableBody>
                      {tableData.map((rowData, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              disabled
                              size="small"
                              sx={{ width: '30%' }}
                              value={rowData.milestone_Number}
                              onChange={(e) => handleInputChange(index, 'milestone_Number', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              size="small"
                              rows={2}
                              disabled
                              multiline
                              sx={{ width: '200%', ml: -18 }}
                              value={rowData.milestone_Description}
                              onChange={(e) => handleInputChange(index, 'milestone_Description', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <FormControl sx={{ width: 130, p: 0, m: 0 }}>
                              <InputLabel id="Status-type-label">Status</InputLabel>
                              <Select
                                size="small"
                                labelId="Status-type-label"
                                id="Status-select"
                                label="Status Type"
                                name="Status Type"
                                value={rowData.status}
                                onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                              >
                                {statusLOV.map((_x, i) => (
                                  <MenuItem key={i} value={_x.status}>
                                    {_x.status}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              type="date"
                              disabled
                              sx={{ p: 0, m: 0, width: '90%', ml: 1 }}
                              size="small"
                              value={formatDateToDDMMYYYY(rowData.target_Date)} // Format date when displaying
                              onChange={(e) => handleInputChange(index, 'target_Date', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              type="date"
                              size="small"
                              sx={{ p: 0, m: 0, width: '90%' }}
                              value={formatDateToDDMMYYYY(rowData.actual_Date)} // Format date when displaying
                              onChange={(e) => handleInputChange(index, 'actual_Date', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              size="small"
                              sx={{ p: 0, m: 0, width: '90%' }}
                              value={rowData.remarks}
                              onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody> */}
                    <TableBody>
                      {tableData.map((rowData, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              disabled
                              size="small"
                              sx={{ width: 60 }}
                              value={rowData.milestone_Number}
                              onChange={(e) => handleInputChange(index, 'milestone_Number', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0, ml: -3 }}>
                            <TextField
                              disabled
                              size="small"
                              rows={2}
                              sx={{ width: 230 }}
                              multiline
                              value={rowData.milestone_Description}
                              onChange={(e) => handleInputChange(index, 'milestone_Description', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
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
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              type="date"
                              disabled
                              size="small"
                              value={formatDateToDDMMYYYY(rowData.target_Date)} // Format date when displaying
                              onChange={(e) => handleInputChange(index, 'target_Date', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              type="date"
                              size="small"
                              value={formatDateToDDMMYYYY(rowData.actual_Date)} // Format date when displaying
                              onChange={(e) => handleInputChange(index, 'actual_Date', e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <TextField
                              size="small"
                              value={rowData.remarks}
                              onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <Stack direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  size="small"
                  // disabled
                  label="Project Highlights"
                  rows={5}
                  multiline
                  sx={{ width: 380, mt: -1 }}
                  value={projectHighlights}
                  onChange={(e) => setProjectHighlights(e.target.value)}
                />
                <MHidden width="lgDown">
                  <Typography
                    sx={{
                      mt: -4,
                      ml: 7
                    }}
                  >
                    Risk/issue
                  </Typography>
                  <Typography sx={{ mt: -4, ml: 20 }}>Impact</Typography>
                  <Typography sx={{ mt: -4, ml: 16 }}>Resolution/Mitigation Plan</Typography>
                </MHidden>
              </Stack>
              <div style={{ marginLeft: 380, marginTop: -126 }}>
                {riskIssue.map((rowData, index) => (
                  <div style={{ marginTop: 13 }}>
                    <TextField
                      size="small"
                      sx={{
                        width: 210,
                        mt: -1.5,
                        '@media (max-width: 768px)': {
                          width: 100
                        }
                      }}
                      value={rowData.riskIssue}
                      onChange={(e) => handleInputChangeRisk(index, 'riskIssue', e.target.value)}
                    ></TextField>
                    <TextField
                      size="small"
                      sx={{
                        width: 210,
                        mt: -1.5,
                        '@media (max-width: 768px)': {
                          width: 100
                        }
                      }}
                      value={rowData.impact}
                      onChange={(e) => handleInputChangeRisk(index, 'impact', e.target.value)}
                    ></TextField>
                    <TextField
                      size="small"
                      sx={{
                        width: 300,
                        mt: -1.5,
                        '@media (max-width: 768px)': {
                          width: 120
                        }
                      }}
                      value={rowData.resolution}
                      onChange={(e) => handleInputChangeRisk(index, 'resolution', e.target.value)}
                    ></TextField>
                  </div>
                ))}
              </div>
              {/* <div style={{ marginLeft: 590, marginTop: -123 }}>
                {impact.map((rowData, index) => (
                  <div style={{ marginTop: 13 }}>
                    <TextField
                      size="small"
                      sx={{ width: 210, mt: -1.5 }}
                      // label="Risk 1"
                      // value={rowData.riskNo}
                      // onChange={(e) => handleInputChange(index, 'riskNo', e.target.value)}
                    ></TextField>
                  </div>
                ))}
              </div> */}
              {/* <div style={{ marginLeft: 800, marginTop: -123 }}>
                {resolution.map((rowData, index) => (
                  <div style={{ marginTop: 13 }}>
                    <TextField
                      size="small"
                      sx={{ width: 320, mt: -1.5 }}
                      // label="Risk 1"
                      // value={rowData.riskNo}
                      // onChange={(e) => handleInputChange(index, 'riskNo', e.target.value)}
                    ></TextField>
                  </div>
                ))}
              </div> */}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                size="small"
                rows={4}
                label="Support Required from Management"
                multiline
                value={supportManagement}
                onChange={(e) => setSupportManagement(e.target.value)}
              />
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                size="small"
                rows={4}
                label="Resource Update"
                multiline
                value={resourceUpdate}
                onChange={(e) => setResourceUpdate(e.target.value)}
              />
            </Stack>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={closeDialogUpdate}>Back</Button>
              {/* <Button onClick={saveStatus}>Save</Button> */}
              <LoadingButton onClick={updateStatus}>Submit</LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>{' '}
    </Grid>
  );
}
