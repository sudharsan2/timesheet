import {
  Button,
  Grid,
  TextField,
  FormHelperText,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  Stack,
  Card,
  TableContainer,
  Table,
  TablePagination,
  TableBody,
  useMediaQuery,
  TableRow,
  TableCell,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from '../../../routes/paths';

/*eslint-disable*/

export default function EditWeekReview() {
  const [fridayDate, setFridayDate] = useState('');
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [projectName, setProjectName] = useState('');
  const [projManagerName, setProjManagerName] = useState('');
  const [projectModule, setProjectModule] = useState('');
  const [moduleCount, setModuleCount] = useState('');
  const [moduleTotals, setModuleTotals] = useState('');
  const [projName, setProjName] = useState('');
  const [projManager, setProjManager] = useState('');
  const [projRepoted, setProjRepoted] = useState('');
  const [projClosed, setProjClosed] = useState('');
  const [projNoSr, setProjNoSr] = useState('');
  const [projNoSrReff, setProjNoSrReff] = useState('');
  const [projNoCr, setProjNoCr] = useState('');
  const [projNoCrReff, setProjNoCrReff] = useState('');
  const [projeId, setProjeId] = useState('');
  const [projHighlights, setProjHighlights] = useState('');
  const [projResource, setProjResource] = useState('');
  const [riskNo, setRiskNo] = useState('');
  const [totalModule, setTotalModule] = useState('');
  const [riskPlan, setRiskPlan] = useState('');
  const [openTicketId, setOpenTicketId] = useState('');
  const [riskMitigationId, setRiskMitigationId] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [moduleLOV, setModuleLOV] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [isDialogOpenUpdate, setIsDialogOpenUpdate] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [view, setNewView] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [close, setCloseView] = useState(true);
  const [weekNos, setWeekNos] = useState('');
  const [revDate, setRevDate] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getWeekNumber(date) {
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    // Find the Thursday in this week
    currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));

    // The first week of the year is the one that includes January 4th
    const week1 = new Date(currentDate.getFullYear(), 0, 4);

    // Calculate the difference in weeks
    const weekNumber = Math.ceil((currentDate - week1) / (7 * 24 * 60 * 60 * 1000) + 1);

    return weekNumber;
  }

  const today = new Date(); // Your date
  const weekNumber = getWeekNumber(today);
  console.log(`Week number: ${weekNumber}`);

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getProjectForReviewUpdate/${params.projId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('response data', res.data);
        console.log('params', params);
        setProjectName(res.data[0].projectName);
        setProjManagerName(res.data[0].projectManager);
        setProjName(res.data[0].projectId);
        setProjRepoted(res.data[0].repoted);
        setProjClosed(res.data[0].closed);
        setProjectModule(res.data[0].projectModule);
        setModuleCount(res.data[0].moduleCount);
        setModuleTotals(res.data[0].moduleTotal);
        setProjNoSr(res.data[0].no_Sr);
        setProjNoSrReff(res.data[0].no_SR_Reff);
        setProjNoCr(res.data[0].no_Cr);
        setProjNoCrReff(res.data[0].no_CR_Reff);
        setProjHighlights(res.data[0].projectHighlights);
        setRiskNo(res.data[0].riskNo);
        setRiskPlan(res.data[0].riskPlan);
        setTotalModule(res.data[0].moduleTotal);
        setProjResource(res.data[0].resource);
        setProjeId(res.data[0].proj_Id);
        setWeekNos(res.data[0].weekNo);
        setOpenTicketId(res.data[0].open_ticket_id);
        setRiskMitigationId(res.data[0].risk_mitigation_id);
        setRevDate(res.data[0].reviewDate);
        console.log('openticid', openTicketId);

        if (res.data[0] && Array.isArray(res.data[0].openTicketSummary)) {
          // Map the 'milestone' array to the 'tableData' format
          const tableDataFromAPI = res.data[0].openTicketSummary.map((item) => ({
            open_ticket_id: item.open_ticket_id || '',
            projectModule: item.projectModule || '',
            moduleCount: item.moduleCount || '',
            moduleTotal: item.moduleTotal || ''
          }));
          console.log('table', tableDataFromAPI);
          setTableData(tableDataFromAPI);
        }

        if (res.data[0] && Array.isArray(res.data[0].riskMitigation)) {
          // Map the 'milestone' array to the 'tableData' format
          const tableDataFromAPI = res.data[0].riskMitigation.map((item) => ({
            risk_mitigation_id: item.risk_mitigation_id || '',
            riskNo: item.riskNo || '',
            riskPlan: item.riskPlan || ''
          }));
          console.log('table', tableDataFromAPI);
          setResourceData(tableDataFromAPI);
        }
        if (res.data[0].someProperty !== null) {
          setDataRetrieved(false);
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local storage', JSON.parse(localStorage.getItem('Details')));
  }, [projectName]);

  console.log('ProjName', projName);

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
        console.log('ProjName1', projName);

        const newArr = res.data.find((val) => {
          return val.proj_Id == projName;
        });
        console.log('4', newArr);
        setProjectId(newArr.proj_Id);
        setProjectName(newArr.proj_Name);
        setProjManagerName(newArr.project_Manager);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, []);
  console.log('pro', projectId);

  const [tableData, setTableData] = useState([
    {
      open_ticket_id: '',
      projectModule: '',
      moduleCount: ''
    },
    {
      open_ticket_id: '',
      projectModule: '',
      moduleCount: ''
    }
  ]);

  const handleInputChangeTable = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);

    const total = calculateTotal();
    setModuleTotals(total);
  };

  const openDialogUpdate = () => {
    setIsDialogOpenUpdate(true);
  };

  const closeDialogUpdate = () => {
    window.history.back();
  };

  const [resourceData, setResourceData] = useState([
    {
      risk_mitigation_id: '',
      riskNo: '',
      riskPlan: ''
    },
    {
      risk_mitigation_id: '',
      riskNo: '',
      riskPlan: ''
    },
    {
      risk_mitigation_id: '',
      riskNo: '',
      riskPlan: ''
    }
  ]);

  // const calculateTotal = () => {
  //   let total = 0;
  //   for (const rowData of tableData) {
  //     if (rowData.moduleCount) {
  //       total += parseFloat(rowData.moduleCount);
  //     }
  //   }
  //   return total;
  // };
  const handleInputChange = (index, field, value) => {
    const updatedData = [...resourceData];
    updatedData[index][field] = value;
    setResourceData(updatedData);
  };

  const addRow = () => {
    const newRow = {
      projectModule: '',
      moduleCount: ''
    };
    setTableData([...tableData, newRow]);
  };
  console.log('log', addRow);

  const deleteRow = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  const NewUserSchema = Yup.object().shape({
    projectName: Yup.string().required('Project name is required'),
    projectManager: Yup.string().required('Project Manager is required')
  });

  const calculateTotal = () => {
    let total = 0;
    for (const rowData of tableData) {
      const moduleCount = parseFloat(rowData.moduleCount) || 0;
      total += moduleCount;
    }
    return total;
  };

  const calculateProjClosed = () => {
    const repoted = parseFloat(projRepoted); // Convert to a number
    const module = parseFloat(totalModule); // Convert to a number

    if (!isNaN(repoted) && !isNaN(module)) {
      return repoted - module; // Calculate projClosed
    } else {
      return ''; // Handle invalid input
    }
  };

  // Update projClosed whenever totalModule changes
  // const handleTotalModuleChange = (e) => {
  //   setTotalModule(e.target.value);
  //   const closedValue = calculateProjClosed();
  //   setProjClosed(closedValue);
  // };

  // const handleProjRepotedChange = (e) => {
  //   setProjRepoted(e.target.value);
  //   const closedValue = calculateProjClosed();
  //   setProjClosed(closedValue);
  // };

  useEffect(() => {
    const closedValue = calculateProjClosed();
    setProjClosed(closedValue);
  }, [projRepoted, totalModule]);

  const saveStatus = async () => {
    try {
      // Validate form data using Yup
      await NewUserSchema.validate({
        projectName: projectName,
        projectManager: projManagerName
      });

      const moduleTotal = calculateTotal();

      const updatedTableData = tableData.map((rowData) => ({
        ...rowData,
        moduleTotal: moduleTotal
      }));

      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateSupportProject',
        {
          projectName: String(projectName),
          projectManager: String(projManagerName),
          repoted: String(projRepoted),
          closed: String(projClosed),
          no_Sr: String(projNoCr),
          no_SR_Reff: String(projNoSrReff),
          no_Cr: String(projNoCr),
          no_CR_Reff: String(projNoCrReff),
          projectHighlights: String(projHighlights),
          resource: String(projResource),
          moduleTotal: String(totalModule),
          openTicketSummary: updatedTableData,
          riskMitigation: resourceData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Ok', response.data);
      enqueueSnackbar('Updated Successfully', {
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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        width: 180
      }
    }
  };

  const calculateUpcomingFriday = () => {
    const currentDate = new Date();
    const daysUntilFriday = 5 - currentDate.getDay();
    if (daysUntilFriday <= 0) {
      currentDate.setDate(currentDate.getDate() + (7 + daysUntilFriday));
    } else {
      currentDate.setDate(currentDate.getDate() + daysUntilFriday);
    }

    setFridayDate(format(currentDate, 'dd/MM/yyyy'));
  };

  useEffect(() => {
    axios
      .get(`https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/getListOfModules`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('this is LOV', res.data);
        console.log('params', params);
        setModuleLOV(res.data);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, []);

  console.log('project name', params.projId);

  const updateStatus = async () => {
    try {
      // Validate form data using Yup
      // await NewUserSchema.validate({
      //   projectName: projectName,
      //   projectManager: projManagerName
      // });

      const moduleTotal = calculateTotal();

      const updatedTableData = tableData.map((rowData) => ({
        ...rowData,
        moduleTotal: moduleTotal
      }));

      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateSupportProject',
        {
          proj_Id: projeId,
          projectName: String(projectName),
          projectManager: String(projManagerName),
          repoted: String(projRepoted),
          closed: String(projClosed),
          no_Sr: String(projNoCr),
          no_SR_Reff: String(projNoSrReff),
          no_Cr: String(projNoCr),
          no_CR_Reff: String(projNoCrReff),
          projectHighlights: String(projHighlights),
          resource: String(projResource),
          moduleTotal: String(totalModule),
          openTicketSummary: updatedTableData,
          riskMitigation: resourceData
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
        closeDialogUpdate();
      }, 1000);
      enqueueSnackbar('Updated Successfully', {
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

  console.log(
    'tableData:',
    tableData.map((val) => {
      return val.moduleTotal;
    })
  );

  useEffect(() => {
    setNewView(true);
  }, []);

  useEffect(() => {
    setCloseView(false);
  }, []);

  useEffect(() => {
    const total = calculateTotal();
    setTotalModule(total); // Update the totalModule state with the new total
  }, [tableData]);

  useEffect(() => {
    calculateUpcomingFriday();
  }, []);

  return (
    <Dialog
      open={view}
      onClose={closeDialogUpdate}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      aria-labelledby="epic-preview"
    >
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}></FormHelperText>
              </Grid>{' '}
              <Grid item xs={12}>
                <Card
                  sx={{
                    marginTop: -7,
                    p: 2
                  }}
                >
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} sx={{ marginTop: 5 }}>
                      <TextField
                        size="small"
                        required
                        fullWidth
                        label="Date"
                        value={String(revDate).slice(0, 10)}
                        disabled
                        // {...getFieldProps('proj_Name')}
                        // error={Boolean(touched.proj_Name && errors.proj_Name)}
                        // helperText={touched.proj_Name && errors.proj_Name}
                      />
                      <TextField
                        size="small"
                        required
                        disabled
                        fullWidth
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                      <TextField
                        size="small"
                        required
                        fullWidth
                        disabled
                        label="Project Owner Name"
                        value={projManagerName}
                        onChange={(e) => setProjManagerName(e.target.value)}
                      />
                    </Stack>
                  </Stack>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Card
                        sx={{
                          marginTop: 3,
                          p: 1
                        }}
                      >
                        <Typography sx={{ fontSize: 15 }}>Week No {weekNos}</Typography>
                        <Typography sx={{ mt: 1, ml: 3 }}>
                          Inc/Req Reported :{' '}
                          <TextField
                            size="small"
                            sx={{ width: 100, mt: -1, ml: 3 }}
                            value={projRepoted}
                            onChange={(e) => setProjRepoted(e.target.value)}
                          />
                        </Typography>
                        <Typography sx={{ mt: 2, ml: 3 }}>
                          Inc/Req Closed :{' '}
                          <TextField
                            size="small"
                            sx={{ width: 100, mt: -1, ml: 5.5 }}
                            value={projClosed}
                            InputProps={{ readOnly: true }}
                          />
                        </Typography>
                        <Typography sx={{ ml: 6, fontSize: 12 }}>Open Ticket Summary</Typography>
                        {tableData.map((rowData, index) => (
                          <div>
                            {' '}
                            <FormControl sx={{ width: 180, mt: 0.5, ml: 4 }}>
                              <InputLabel id="Calendar-type-label">ModuleLov</InputLabel>
                              <Select
                                size="small"
                                labelId="module-type-label"
                                id="module-select"
                                label="ModuleLov"
                                name="ModuleLov"
                                value={rowData.projectModule}
                                onChange={(e) => handleInputChangeTable(index, 'projectModule', e.target.value)}
                                MenuProps={MenuProps}
                              >
                                {moduleLOV.map((_x, i) => (
                                  <MenuItem key={i} value={_x.module}>
                                    {_x.module}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {/* <TextField
                      size="small"
                      sx={{ width: 70, mt: 0.5, ml: 0.5 }}
                      value={rowData.projectModule}
                      onChange={(e) => handleInputChangeTable(index, 'projectModule', e.target.value)}
                    /> */}
                            <TextField
                              size="small"
                              sx={{ width: 70, mt: 0.5, ml: 0.5 }}
                              value={rowData.moduleCount}
                              onChange={(e) => handleInputChangeTable(index, 'moduleCount', e.target.value)}
                            />
                            {/* <Button
                              sx={{ mt: 1, ml: 1 }}
                              onClick={() => deleteRow(index)}
                              startIcon={<DeleteForeverTwoToneIcon />}
                            ></Button>
                            {index === tableData.length - 1 && (
                              <Button sx={{ mt: -1, ml: 36 }} onClick={addRow}>
                                Add
                              </Button>
                            )} */}
                          </div>
                        ))}
                        <Stack>
                          <Typography sx={{ ml: 21.5, mt: 3 }}>
                            Total{' '}
                            <TextField
                              size="small"
                              sx={{ width: 70, mt: -2, ml: 0.5 }}
                              value={totalModule}
                              onChange={(e) => setTotalModule(e.target.value)}
                            />
                          </Typography>
                        </Stack>
                      </Card>
                    </Grid>
                    {/* <Grid>
                    <Button
                      sx={{ mt: 20, ml: 10, backgroundColor: 'green' }}
                      variant="contained"
                      // component={RouterLink}
                      // to={PATH_DASHBOARD.review.findProject}
                      onClick={() => {
                        window.history.back();
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      sx={{ mt: 20, ml: 1, backgroundColor: 'green' }}
                      onClick={updateStatus}
                      variant="contained"
                    >
                      update
                    </Button>
                  </Grid> */}
                    <Grid
                      sx={{
                        marginLeft: 91,
                        mt: -4,
                        '@media (max-width: 768px)': {
                          ml: 27,
                          mt: 2
                        }
                      }}
                    >
                      <Button onClick={closeDialogUpdate}>Close</Button>
                      <Button sx={{ backgroundColor: 'green' }} onClick={updateStatus} variant="contained">
                        update
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}
