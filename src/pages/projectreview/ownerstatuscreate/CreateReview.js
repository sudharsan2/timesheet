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
  Stack,
  Card,
  TableContainer,
  Table,
  TablePagination,
  TableBody,
  TableRow,
  useTheme,
  TableCell,
  IconButton,
  InputAdornment,
  Box
} from '@mui/material';
import { Icon } from '@iconify/react';
import saveAs from 'file-saver';
import searchFill from '@iconify/icons-eva/search-fill';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { getOpenticketsAsync } from '../../../redux/slices/projSlice';
import { useDispatch, useSelector } from '../../../redux/store';
import Scrollbar from '../../../components/Scrollbar';
import { UserListHead, UserListToolbar } from '../../../components/_administrator/list';
import { PATH_DASHBOARD } from '../../../routes/paths';
import * as paths from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import SearchNotFound from '../../../components/SearchNotFound';
import TicketClosure from '../../../components/_administrator/list/TicketClosure';
import fileSaver from '../../../utils/fileSaver';

/*eslint-disable*/

const TABLE_HEAD = [
  //   { id: 'proj_Id', label: 'S.NO', alignRight: false, margin: '' },
  { id: 'week_NO', label: 'Week Number', alignRight: false, margin: '' },
  { id: 'module_TOTAL', label: 'No.of Open Tickets', alignRight: false, margin: '' },
  { id: 'Edit', label: 'Edit', alignRight: false, margin: '' }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.week_NO.Number().indexOf(query.Number()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CreateReview() {
  const [fridayDate, setFridayDate] = useState('');
  const params = useParams();
  const token = localStorage.getItem('accessToken');
  const [projectName, setProjectName] = useState('');
  const [projManagerName, setProjManagerName] = useState('');
  const [projectModule, setProjectModule] = useState('');
  const [moduleCount, setModuleCount] = useState('');
  const [moduleTotal, setModuleTotal] = useState('');
  const [moduleTotals, setModuleTotals] = useState('');
  const [projName, setProjName] = useState('');
  const [projManager, setProjManager] = useState('');
  const [projRepoted, setProjRepoted] = useState('');
  const [projRepoteds, setProjRepoteds] = useState('');
  const [projClosed, setProjClosed] = useState(projRepoted);
  const [projCloseds, setProjCloseds] = useState(projRepoted);
  const [projNoSr, setProjNoSr] = useState('');
  const [projNoSrs, setProjNoSrs] = useState('');
  const [projNoSrReff, setProjNoSrReff] = useState('');
  const [projNoSrReffs, setProjNoSrReffs] = useState('');
  const [projNoCr, setProjNoCr] = useState('');
  const [projeIds, setProjeIds] = useState('');
  const [projNoCrs, setProjNoCrs] = useState('');
  const [projNoCrReff, setProjNoCrReff] = useState('');
  const [projNoCrReffs, setProjNoCrReffs] = useState('');
  const [projeId, setProjeId] = useState('');
  const [projHighlights, setProjHighlights] = useState('');
  const [projHighlightss, setProjHighlightss] = useState('');
  const [projResource, setProjResource] = useState('');
  const [projResources, setProjResources] = useState('');
  const [riskNo, setRiskNo] = useState('');
  const [totalModule, setTotalModule] = useState('');
  const [totalModules, setTotalModules] = useState('');
  const [riskPlan, setRiskPlan] = useState('');
  const [openTicketId, setOpenTicketId] = useState('');
  const [riskMitigationId, setRiskMitigationId] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [moduleLOV, setModuleLOV] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { themestretch } = useSettings();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const { openTickets: userList } = useSelector((state) => state.proj);
  const users = userList.map((val) => {
    return val.proj_ID;
  });
  console.log('list', users[0]);
  const [orderBy, setOrderBy] = useState('type');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [formValues, setFormValues] = useState();
  const [weekNumber, setWeekNumber] = useState('');
  const [currentWeekNumber, setCurrentWeekNumber] = useState(null);
  const [projReviewDate, setProjReviewDate] = useState('');
  const navigate = useNavigate();
  const [weekNos, setWeekNos] = useState('');
  const [loading, setLoading] = React.useState(false);
  console.log('params123', params.projId);
  console.log('234', weekNos);

  const handleSearch = (event) => {
    setFilterName(event.target.value);
  };

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

  console.log('setWeekNumber', weekNumber);

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
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, [projectName]);

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  console.log('year1', year);

  useEffect(() => {
    console.log('proj Name', projectName);
    console.log('standardWeekNumber:', standardWeekNumber);
    axios
      .get(
        `https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/getSupportdetails/${projectName}/${standardWeekNumber}/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('response data', res.data);
        setWeekNos(res.data.weekNo);
        console.log('params', params);
        console.log('78', weekNos);
        // if (weekNos == standardWeekNumber) {
        setProjRepoted(res.data[0].repoted);
        setProjClosed(res.data[0].closed);
        setProjectModule(res.data[0].projectModule);
        setModuleCount(res.data[0].moduleCount);
        setModuleTotal(res.data[0].moduleTotal);
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
        setOpenTicketId(res.data[0].open_ticket_id);
        setWeekNos(res.data[0].weekNo);
        setRiskMitigationId(res.data[0].risk_mitigation_id);
        console.log('status', setProjResource(res.data[0].resource));
        console.log('openticid', openTicketId);

        if (res.data[0] && Array.isArray(res.data[0].openTicketSummary)) {
          // Map the 'milestone' array to the 'tableData' format
          const tableDataFromAPI = res.data[0].openTicketSummary.map((item) => ({
            open_ticket_id: item.open_ticket_id || '',
            projectModule: item.projectModule || '',
            moduleCount: item.moduleCount || ''
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

  const [tableData, setTableData] = useState([
    {
      open_ticket_id: '',
      projectModule: '',
      moduleCount: ''
    }
  ]);

  const [newModuleCount, setNewModuleCount] = useState('');
  const [newReported, setNewReported] = useState('');

  // ... (other code)

  const handleNewModuleCountChange = (event) => {
    setNewModuleCount(event.target.value);
  };

  const handleNewReportedChange = (event) => {
    setNewReported(event.target.value);
  };

  const addNewRow = () => {
    // Perform validation
    if (newModuleCount < 0) {
      // Display an error message or handle the error
      console.error('Cannot add a row with a negative module count.');
      return;
    }

    const totalModules = calculateTotal();
    if (newReported > totalModules) {
      // Display an error message or handle the error
      console.error('Reported value cannot be greater than the total of module counts.');
      return;
    }

    // If validation passes, add the new row
    const newRow = {
      projectModule: newModuleCount,
      moduleCount: newReported
    };

    setTableData((prevData) => [...prevData, newRow]);
  };

  // const handleInputChangeTable = (index, field, value) => {
  //   const updatedData = [...tableData];
  //   if (field === 'moduleCount') {
  //     value = parseFloat(value); // Convert the input to a number
  //     const reported = parseFloat(projRepoted) || 0;
  //     value = isNaN(value) ? '' : Math.min(reported, value); // Limit moduleCount to reported value
  //   }
  //   updatedData[index][field] = value;
  //   setTableData(updatedData);

  //   const total = calculateTotal();
  //   setModuleTotal(total);
  //   setProjClosed(calculateProjClosed()); // Update projClosed
  // };

  const handleInputChangeTable = (index, field, value) => {
    const updatedData = [...tableData];

    if (field === 'moduleCount') {
      value = parseFloat(value); // Convert the input to a number
      const reported = parseFloat(projRepoted) || 0;

      // Limit moduleCount to reported value
      value = isNaN(value) ? '' : Math.min(reported, value);
    }

    updatedData[index][field] = value;
    setTableData(updatedData);

    // Update projTotal to ensure the sum of moduleTotal equals projRepoted
    const projTotal = calculateTotal();

    // If projTotal is greater than reported, adjust the last moduleTotal to make them equal
    if (projTotal > parseFloat(projRepoted)) {
      const lastRowIndex = updatedData.length - 1;
      const adjustment = parseFloat(projRepoted) - projTotal + updatedData[lastRowIndex].moduleTotal;
      updatedData[lastRowIndex].moduleTotal += adjustment;
      setTableData(updatedData);
    }

    setModuleTotal(calculateTotal());
    setProjClosed(calculateProjClosed()); // Update projClosed
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
    // projectName: Yup.string().required('Project name is required'),
    // projectManager: Yup.string().required('Project Manager is required')
  });

  const TableDataSchema = Yup.object().shape({
    projectModule: Yup.string().required('Project Module is required')
  });

  const calculateTotal = () => {
    let total = 0;
    for (const rowData of tableData) {
      const moduleCount = parseFloat(rowData.moduleCount) || 0;
      total += moduleCount;
    }
    return total;
  };

  // const calculateProjClosed = () => {
  //   const repoted = parseFloat(projRepoted); // Convert to a number
  //   const module = parseFloat(totalModule); // Convert to a number

  //   if (!isNaN(repoted) && !isNaN(module)) {
  //     return repoted - module; // Calculate projClosed
  //   } else {
  //     return ''; // Handle invalid input
  //   }
  // };

  const calculateProjClosed = () => {
    const repoted = parseFloat(projRepoted); // Convert to a number
    const module = parseFloat(totalModule); // Convert to a number

    if (!isNaN(repoted) && !isNaN(module)) {
      const projClosedValue = repoted - module; // Calculate projClosed
      return Math.max(projClosedValue, 0); // Ensure projClosed is non-negative
    } else {
      return 0; // Handle invalid input
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const closedValue = calculateProjClosed();
    setProjClosed(closedValue);
  }, [projRepoted, totalModule]);

  console.log('friday', fridayDate);

  const inputDate = fridayDate;
  const formattedDate = formatDate(inputDate);

  function formatDate(inputDate) {
    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-us', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();

    return `${day} - ${month} - ${year}`;
  }

  console.log('formattedDate', formattedDate);

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

  // const calculateUpcomingFriday = () => {
  //   const currentDate = new Date();
  //   const daysUntilFriday = 5 - currentDate.getDay();
  //   if (daysUntilFriday <= 0) {
  //     currentDate.setDate(currentDate.getDate() + (7 + daysUntilFriday));
  //   } else {
  //     currentDate.setDate(currentDate.getDate() + daysUntilFriday);
  //   }

  //   setFridayDate(format(currentDate, 'yyyy/MM/dd'));
  // };

  const calculateUpcomingFriday = () => {
    const currentDate = new Date();
    const daysUntilFriday = 5 - currentDate.getDay();

    const thisWeekFriday = addDays(currentDate, daysUntilFriday);

    setFridayDate(format(thisWeekFriday, 'yyyy/MM/dd'));
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

  console.log('projid', projeId);

  // const updateStatus = async () => {
  //   setLoading(true);
  //   try {
  //     // Validate form data using Yup

  //     if (!projHighlights) {
  //       throw new Error('Please fill in the Project Highlights field.');
  //     }

  //     const moduleTotal = calculateTotal();

  //     const updatedTableData = tableData.map((rowData) => ({
  //       ...rowData,
  //       moduleTotal: moduleTotal
  //     }));

  //     // If validation succeeds, make the API request
  //     const response = await axios.post(
  //       'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateSupportProject',
  //       {
  //         proj_Id: projeId || 0,
  //         projectName: String(projectName),
  //         projectManager: String(projManagerName),
  //         repoted: Number(projRepoted),
  //         closed: Number(projClosed),
  //         no_Sr: Number(projNoCr),
  //         no_SR_Reff: String(projNoSrReff),
  //         no_Cr: Number(projNoCr),
  //         no_CR_Reff: String(projNoCrReff),
  //         projectHighlights: String(projHighlights),
  //         resource: String(projResource),
  //         moduleTotal: Number(totalModule),
  //         openTicketSummary: updatedTableData,
  //         riskMitigation: resourceData
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + token
  //         }
  //       }
  //     );

  //     console.log('Ok', response.data);
  //     setTimeout(() => {
  //       navigate(PATH_DASHBOARD.review.findProject);
  //     }, 1000);
  //     setLoading(false);
  //     enqueueSnackbar('Submitted Successfully', {
  //       autoHideDuration: 2000,
  //       variant: 'success'
  //     });
  //     setSuccess(true);
  //     console.log('response status', response.status);
  //   } catch (error) {
  //     if (error.message === 'Please fill in the Project Highlights field.') {
  //       // Handle specific error message for missing projectHighlights
  //       enqueueSnackbar(error.message, {
  //         autoHideDuration: 2000,
  //         variant: 'error'
  //       });
  //     } else {
  //       // Handle other errors
  //       console.error('Error:', error);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateStatus = async () => {
    setLoading(true);
    try {
      // Validate form data using Yup

      if (!projHighlights) {
        throw new Error('Please fill in the Project Highlights field.');
      }

      const moduleTotal = calculateTotal();

      // Validate if totalModule exceeds projRepoted
      if (moduleTotal > parseFloat(projRepoted)) {
        throw new Error('Total module count cannot exceed the reported value.');
      }

      const updatedTableData = tableData.map((rowData) => ({
        ...rowData,
        moduleTotal: moduleTotal
      }));

      // If validation succeeds, make the API request
      const response = await axios.post(
        'https://techstephub.focusrtech.com:3030/techstep/api/Project/Service/createUpdateSupportProject',
        {
          proj_Id: projeId || 0,
          projectName: String(projectName),
          projectManager: String(projManagerName),
          repoted: Number(projRepoted),
          closed: Number(projClosed),
          no_Sr: Number(projNoCr),
          no_SR_Reff: String(projNoSrReff),
          no_Cr: Number(projNoCr),
          no_CR_Reff: String(projNoCrReff),
          projectHighlights: String(projHighlights),
          resource: String(projResource),
          moduleTotal: Number(totalModule),
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
        navigate(PATH_DASHBOARD.review.findProject);
      }, 1000);
      setLoading(false);
      enqueueSnackbar('Submitted Successfully', {
        autoHideDuration: 2000,
        variant: 'success'
      });
      setSuccess(true);
      console.log('response status', response.status);
    } catch (error) {
      if (
        error.message === 'Please fill in the Project Highlights field.' ||
        error.message === 'Total module count cannot exceed the reported value.'
      ) {
        // Handle specific error messages
        enqueueSnackbar(error.message, {
          autoHideDuration: 3000,
          variant: 'error'
        });
      } else {
        // Other errors (network error, API response error, etc.)
        console.log('Error:', error);
        if (error.response) {
          console.log('Error response status', error.response.status);
          console.log('Error response data', error.response.data.message);
          if (error.response.status === 400 && error.response.data.message) {
            // Check if the error is related to projectHighlights size constraint
            if (error.response.data.message.includes('projectHighlights')) {
              enqueueSnackbar(error.response.data.message, {
                autoHideDuration: 3000,
                variant: 'error'
              });
            } else {
              // Handle other types of errors in the response
              enqueueSnackbar('size must be between 0 and 1000.', {
                autoHideDuration: 3000,
                variant: 'error'
              });
            }
          } else {
            // Handle other types of errors here
            enqueueSnackbar('size must be between 0 and 1000.', {
              autoHideDuration: 3000,
              variant: 'error'
            });
          }
        } else {
          // Network error or request was canceled
          console.log('Network error or request was canceled:', error.message);
          // Handle other types of errors here
          enqueueSnackbar('size must be between 0 and 1000.', {
            autoHideDuration: 3000,
            variant: 'error'
          });
        }
      }
      setLoading(false);
    }
  };

  console.log(
    'tableData:',
    tableData.map((val) => {
      return val.moduleTotal;
    })
  );

  useEffect(() => {
    const total = calculateTotal();
    setTotalModule(total); // Update the totalModule state with the new total
  }, [tableData]);

  useEffect(() => {
    calculateUpcomingFriday();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handlePreview = (row) => {
    setView(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch your action with projeId
        await dispatch(getOpenticketsAsync(projectName));
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch, projectName]);

  const filteredUsers = userList.filter((row) => {
    const weekNo = String(row.week_NO);
    return weekNo.includes(filterName);
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  // const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <div>
      <Grid container spacing={3}>
        <Typography
          sx={{
            fontWeight: 'bold',
            ml: 50,
            mt: 0.5,
            mb: 1,
            '@media (max-width: 768px)': {
              ml: -40
            }
          }}
        >
          Support Project Status Entry Week of {standardWeekNumber}
        </Typography>
        <Grid item xs={30}>
          <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
            {/* {touched.avatarUrl && errors.avatarUrl} */}
          </FormHelperText>
        </Grid>{' '}
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: -7,
              p: 1
            }}
          >
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                  size="small"
                  disabled
                  required
                  fullWidth
                  label="Date"
                  value={formattedDate}
                  // {...getFieldProps('proj_Name')}
                  // error={Boolean(touched.proj_Name && errors.proj_Name)}
                  // helperText={touched.proj_Name && errors.proj_Name}
                />
                <TextField
                  size="small"
                  disabled
                  required
                  fullWidth
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <TextField
                  size="small"
                  disabled
                  required
                  fullWidth
                  label="Project Manager"
                  value={projManagerName}
                  onChange={(e) => setProjManagerName(e.target.value)}
                  // {...getFieldProps('proj_Name')}
                  // error={Boolean(touched.proj_Name && errors.proj_Name)}
                  // helperText={touched.proj_Name && errors.proj_Name}
                />
                <Button
                  // style={{ backgroundColor: '#E1D9D1', color: 'black' }}
                  fullWidth
                  variant="contained"
                  // component={RouterLink}
                  // to={`${PATH_DASHBOARD.review.openTicket}/${params.projId}`}
                  onClick={openDialog}
                >
                  Open Ticket Closure
                </Button>
                <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
                  <div>
                    {/* Add content for your dialog here */}
                    <Card>
                      {' '}
                      <TextField
                        sx={{ mt: 1, mb: 1, ml: 1 }}
                        type="text"
                        placeholder="Search by week No"
                        value={filterName}
                        onChange={handleSearch}
                        startAdornment={
                          <InputAdornment position="start">
                            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
                          </InputAdornment>
                        }
                      />
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Scrollbar>
                            <TableContainer sx={{ minWidth: 500 }}>
                              <Table>
                                <UserListHead
                                  order={order}
                                  orderBy={orderBy}
                                  headLabel={TABLE_HEAD}
                                  rowCount={userList.length}
                                  numSelected={selected.length}
                                  onRequestSort={handleRequestSort}
                                  onSelectAllClick={handleSelectAllClick}
                                />

                                <TableBody>
                                  {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                      const { proj_ID: projId, week_NO: weekNo, module_TOTAL: moduleTotal } = row;
                                      const isItemSelected = selected.indexOf(projId) !== -1;

                                      return (
                                        <TableRow
                                          hover
                                          key={projId}
                                          tabIndex={-1}
                                          role="checkbox"
                                          selected={isItemSelected}
                                          aria-checked={isItemSelected}
                                        >
                                          <TableCell align="left">Week {weekNo}</TableCell>
                                          <TableCell align="left">{moduleTotal}</TableCell>

                                          <TableCell align="left">
                                            {/* <IconButton
                                            aria-label="Edit"
                                            component={RouterLink}
                                            to={`${paths.PATH_DASHBOARD.review.editWeekRev}/${users[3]}`}
                                            // onClick={openDialogUpdate}
                                          >
                                            <EditIcon />
                                          </IconButton> */}
                                            <TicketClosure projId={projId} />
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                      <TableCell colSpan={6} />
                                    </TableRow>
                                  )}
                                </TableBody>

                                {isUserNotFound && (
                                  <TableBody>
                                    <TableRow>
                                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                        <SearchNotFound searchQuery={filterName} />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                )}
                              </Table>
                            </TableContainer>
                          </Scrollbar>
                        </Grid>
                      </Grid>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={userList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Card>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button onClick={closeDialog} color="secondary">
                        Close
                      </Button>
                    </div>
                  </div>
                </Dialog>
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4.5}>
                <Card
                  sx={{
                    marginTop: 3,
                    p: 1
                  }}
                >
                  {/* <Typography sx={{ fontSize: 15 }}>Week No {standardWeekNumber}</Typography> */}
                  <Typography sx={{ mt: 1, ml: 3 }}>
                    Inc/Req Reported :{' '}
                    <TextField
                      type="number"
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
                      type="number"
                      sx={{ width: 100, mt: -1, ml: 5.5 }}
                      value={projClosed}
                      InputProps={{ readOnly: true }}
                    />
                  </Typography>
                  <Typography sx={{ ml: 6, fontSize: 12 }}>Open Ticket Summary</Typography>
                  <Typography sx={{ ml: 9.5, fontSize: 10, color: 'red' }}>Must Fill the Project Module</Typography>
                  {tableData.map((rowData, index) => (
                    <div>
                      {' '}
                      <FormControl sx={{ width: 180, mt: 0.5, ml: 4 }}>
                        <InputLabel id="Calendar-type-label">Project Module</InputLabel>
                        <Select
                          size="small"
                          labelId="module-type-label"
                          id="module-select"
                          label="Project Module"
                          name="Project Module"
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
                        type="number"
                        sx={{ width: 70, mt: 0.5, ml: 0.5 }}
                        value={rowData.moduleCount}
                        onChange={(e) => handleInputChangeTable(index, 'moduleCount', e.target.value)}
                      />
                      <Button
                        sx={{ mt: 1, ml: 1 }}
                        onClick={() => deleteRow(index)}
                        startIcon={<DeleteForeverTwoToneIcon />}
                      ></Button>
                      {/* {index === tableData.length - 1 && (
                      
                    )} */}
                    </div>
                  ))}
                  <Stack>
                    <Typography sx={{ ml: 21.5, mt: 3 }}>
                      Total{' '}
                      <TextField
                        size="small"
                        sx={{ width: 70, mt: -2.5, ml: 0.5 }}
                        value={totalModule}
                        onChange={(e) => setTotalModule(e.target.value)}
                      />
                    </Typography>
                    <Button sx={{ mt: -5, ml: 36, width: 50 }} onClick={addRow}>
                      Add
                    </Button>
                  </Stack>
                  <Typography sx={{ mt: 2, ml: 1, fontSize: 14 }}>
                    No of SR{' '}
                    <TextField
                      size="small"
                      type="number"
                      sx={{ width: 45, mt: -1, ml: 0.5 }}
                      value={projNoSr}
                      onChange={(e) => setProjNoSr(e.target.value)}
                    />
                    <TextField
                      size="small"
                      sx={{ width: 240, mt: -1, ml: 1 }}
                      label="SR Reff"
                      value={projNoSrReff}
                      onChange={(e) => setProjNoSrReff(e.target.value)}
                    />
                  </Typography>
                  <Typography sx={{ mt: 2, ml: 1, fontSize: 14 }}>
                    No of CR{' '}
                    <TextField
                      size="small"
                      type="number"
                      sx={{ width: 45, mt: -1, ml: 0.5 }}
                      value={projNoCr}
                      onChange={(e) => setProjNoCr(e.target.value)}
                    />
                    <TextField
                      size="small"
                      sx={{ width: 240, mt: -1, ml: 1 }}
                      label="CR Reff"
                      value={projNoCrReff}
                      onChange={(e) => setProjNoCrReff(e.target.value)}
                    />
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    rows={3}
                    multiline
                    label="Resource"
                    value={projResource}
                    onChange={(e) => setProjResource(e.target.value)}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={7}>
                <Card
                  sx={{
                    marginTop: 3,
                    p: 2
                  }}
                >
                  {/* <Stack direction="row" spacing={23}>
                  <Typography>Project Highlights</Typography>
                  <Typography>Resource Update</Typography>
                </Stack> */}
                  {/* <Stack direction="row" spacing={2}> */}
                  <TextField
                    size="small"
                    fullWidth
                    sx={{ mt: 0, ml: -0.5 }}
                    rows={4}
                    multiline
                    label="Project Highlights"
                    value={projHighlights}
                    onChange={(e) => setProjHighlights(e.target.value)}
                  />
                  {/* </Stack> */}
                  <Typography sx={{ mt: 1 }}>Risks/Mitigation</Typography>
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        marginTop: 0,
                        p: 1
                      }}
                    >
                      {resourceData.map((rowData, index) => (
                        <div style={{ marginTop: 13 }}>
                          <TextField
                            size="small"
                            sx={{ width: 200, mt: -0.5 }}
                            rows={2}
                            multiline
                            label="Risk"
                            value={rowData.riskNo}
                            onChange={(e) => handleInputChange(index, 'riskNo', e.target.value)}
                          ></TextField>
                          <TextField
                            size="small"
                            sx={{ width: 350, mt: -0.5, ml: 2 }}
                            rows={2}
                            multiline
                            label="Mitigation Plan"
                            value={rowData.riskPlan}
                            onChange={(e) => handleInputChange(index, 'riskPlan', e.target.value)}
                          ></TextField>
                        </div>
                      ))}
                    </Card>
                  </Grid>
                </Card>
                <Box sx={{ mt: 1, ml: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    sx={{ backgroundColor: 'green' }}
                    variant="contained"
                    component={RouterLink}
                    to={PATH_DASHBOARD.review.findProject}
                  >
                    Back
                  </Button>
                  <LoadingButton
                    sx={{ ml: 2, backgroundColor: 'green' }}
                    loading={loading}
                    // onClick={saveStatus}
                    onClick={updateStatus}
                    variant="contained"
                    disabled={dataRetrieved}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
