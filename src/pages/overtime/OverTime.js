import React from 'react';
import {
  Container,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Button,
  Drawer,
  Tooltip,
  IconButton,
  Alert,
  Box,
  Stack,
  TextField,
  TableBody,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TableFooter,
  TablePagination,
  Grid,
  AlertTitle,
  Typography,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
// import FastForwardIcon from '@mui/icons-material/FastForward';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { DatePicker, LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { timeConvert2Deci, timeConvert } from '../../utils/timeconverions';
import {
  getOverTimeDetails,
  getCategoryLOVFromTS,
  getProjectLOVFromTS,
  getIsLoadingFromTS,
  editRowsInOverTimeDetails,
  getCategoryLOVAsync,
  getStatusLOVAsync,
  getProjectLOVAsync,
  getErrorFromTS,
  getOverTimeAsync,
  addOverTimeInTaskDetails,
  getOverTimeIdFromTS,
  overTimeEntryAsync,
  getOverTimeStatusFromTS,
  getOverTimeManagerCommentsFromTS
} from '../../redux/slices/timesheetSlice';
import { getUserDetailsFromAuth } from '../../redux/slices/authSlice';
import TaskNotFound from '../../components/TaskNotFound';
import { MIconButton } from '../../components/@material-extend';

export default function OverTime() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const title = 'OverTime Entry';
  const [value, setValue] = React.useState(null);
  const [isNewRowEnabled, setNewRow] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isEditOpened, setDrawer] = React.useState(false);
  // const [isTimeError, setTimeErrorOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const dispatch = useDispatch();
  const overTimeTaskDetails = useSelector(getOverTimeDetails);
  console.log(overTimeTaskDetails);
  const overtimeId = useSelector(getOverTimeIdFromTS);
  const overtimeStatus = useSelector(getOverTimeStatusFromTS);
  const managercomments = useSelector(getOverTimeManagerCommentsFromTS);
  const categoryLOV = useSelector(getCategoryLOVFromTS);
  const projectLOV = useSelector(getProjectLOVFromTS);
  const isLoading = useSelector(getIsLoadingFromTS);
  const error = useSelector(getErrorFromTS);
  const drawerWidth = 350;
  const userDetails = useSelector(getUserDetailsFromAuth);
  const [addRowDetails, setAddRowDetails] = React.useState({
    category: '',
    project: '',
    activity: '',
    status: '',
    phase: '',
    minutes: '',
    remarks: ''
  });
  const [editRowDetails, setEditRowDetails] = React.useState({
    index: null,
    category: '',
    project: '',
    activity: '',
    status: '',
    phase: '',
    minutes: '',
    remarks: ''
  });
  const today = new Date();
  const previousWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - (userDetails ? userDetails.overtime_applied_before : 7)
  );

  const sumMins =
    overTimeTaskDetails.length === 0
      ? 0
      : overTimeTaskDetails.map((o) => o.minutes).reduce((a, c) => Number(a) + Number(c));

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - overTimeTaskDetails.length) : 0;

  const handleChange = (_date) => {
    if (_date) {
      const payload = {
        requestHeader: {
          SourceSystem: '',
          UUID: '',
          TimeStamp: ''
        },
        requestData: {
          date: _date
        }
      };
      dispatch(getOverTimeAsync(payload));
      setValue(_date);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDraweropen = (row, index) => {
    setNewRow(false);
    setEditRowDetails({
      index,
      category: row.category,
      project: row.project,
      activity: row.activity,
      status: row.status,
      phase: row.phase,
      minutes: row.minutes,
      remarks: row.remarks
    });
    setDrawer(true);
  };

  const handleDrawerClose = () => {
    setDrawer(false);
  };

  const handleChangeNewRow = (e) => {
    setAddRowDetails({ ...addRowDetails, [e.target.name]: e.target.value });
  };

  const handleEditNewRow = (e) => {
    setEditRowDetails({ ...editRowDetails, [e.target.name]: e.target.value });
  };

  const handleAddNewRow = () => {
    let isFormValid = true;

    if (!addRowDetails.project) {
      isFormValid = false;
      enqueueSnackbar('Project is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    if (!addRowDetails.activity) {
      isFormValid = false;
      enqueueSnackbar('Activity is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    if (!addRowDetails.minutes) {
      isFormValid = false;
      enqueueSnackbar('Minutes is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }

    if (isFormValid) {
      enqueueSnackbar('Added Successfully! But not saved yet', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setAddRowDetails({
        category: '',
        project: '',
        activity: '',
        status: '',
        phase: '',
        minutes: '',
        remarks: ''
      });

      dispatch(addOverTimeInTaskDetails(addRowDetails));
    }
  };

  const handleEditRow = () => {
    let isFormValid = true;

    if (!editRowDetails.category) {
      isFormValid = false;
      enqueueSnackbar('Category is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    if (!editRowDetails.project) {
      isFormValid = false;
      enqueueSnackbar('Project is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    if (!editRowDetails.activity) {
      isFormValid = false;
      enqueueSnackbar('Activity is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    if (!editRowDetails.minutes) {
      isFormValid = false;
      enqueueSnackbar('Minutes is required', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    // if (!editRowDetails.status) {
    //   isFormValid = false;
    //   enqueueSnackbar('Status is required', {
    //     variant: 'error',
    //     action: (key) => (
    //       <MIconButton size="small" onClick={() => closeSnackbar(key)}>
    //         <Icon icon={closeFill} />
    //       </MIconButton>
    //     )
    //   });
    // }

    if (isFormValid) {
      enqueueSnackbar('Updated Successfully! But dont forget to save', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });

      const indexOfLastData = (page + 1) * rowsPerPage;
      const indexOfFirstData = indexOfLastData - rowsPerPage;
      const data = [...overTimeTaskDetails];
      const obj = {
        ...data[indexOfFirstData + editRowDetails.index],
        ...editRowDetails
      };

      data.splice(indexOfFirstData + editRowDetails.index, 1);
      data.push(obj);

      dispatch(editRowsInOverTimeDetails(data));

      handleDrawerClose(false);

      setEditRowDetails({
        category: '',
        project: '',
        activity: '',
        status: '',
        phase: '',
        minutes: '',
        remarks: ''
      });
    }
  };

  const handleSubmit = async (action) => {
    if (action === 'submit') {
      // if (Number(validHrs) > 24) {
      //   enqueueSnackbar('Hold on! Your entered task exceeds 24 hrs in a day', {
      //     variant: 'error',
      //     action: (key) => (
      //       <MIconButton size="small" onClick={() => closeSnackbar(key)}>
      //         <Icon icon={closeFill} />
      //       </MIconButton>
      //     )
      //   });
      //   return;
      // }
      // if (Number(validHrs) === 0) {
      //   enqueueSnackbar('Your daily task does not meet the required 8 hrs', {
      //     variant: 'error',
      //     action: (key) => (
      //       <MIconButton size="small" onClick={() => closeSnackbar(key)}>
      //         <Icon icon={closeFill} />
      //       </MIconButton>
      //     )
      //   });
      //   return;
      // }
      // if (Number(validHrs) < 8) {
      //   setTimeErrorOpen(true);
      //   //   enqueueSnackbar('Your daily task does not meet the required 8 hrs', {
      //   //     variant: 'error',
      //   //     action: (key) => (
      //   //       <MIconButton size="small" onClick={() => closeSnackbar(key)}>
      //   //         <Icon icon={closeFill} />
      //   //       </MIconButton>
      //   //     )
      //   //   });
      //   return;
      // }
    }

    const payload = {
      requestHeader: {
        SourceSystem: '',
        UUID: '',
        TimeStamp: ''
      },
      requestData: {
        // timesheetId,
        overtimeId,
        date: value,
        hours: timeConvert2Deci(sumMins),
        minutes: sumMins.toString(),
        usercomments: '',
        action,
        // taskDetails: taskdetails
        taskDetails: overTimeTaskDetails
      }
    };
    dispatch(overTimeEntryAsync(payload));
    setNewRow(false);
  };

  React.useEffect(() => {
    dispatch(getCategoryLOVAsync());
    dispatch(getStatusLOVAsync());
    dispatch(getProjectLOVAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   const payload = {
  //     requestHeader: {
  //       SourceSystem: '',
  //       UUID: '',
  //       TimeStamp: ''
  //     },
  //     requestData: {
  //       date: value
  //     }
  //   };

  //   dispatch(getTimeSheetEntryAsync(payload));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  React.useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'OverTime Entry' }]}
        />
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {overtimeStatus === 'APPROVED' && (
                <Alert severity="success">
                  <AlertTitle>Approved</AlertTitle>Your overtime request for the day has been approved by your manager
                </Alert>
              )}
              {overtimeStatus === 'SUBMITTED' && (
                <Alert severity="info">
                  <AlertTitle>Submitted</AlertTitle>You have submitted your overtime request for the day. Awaiting for
                  your manager response to your overtime request
                </Alert>
              )}
              {overtimeStatus === 'REJECTED' && (
                <Alert severity="error">
                  <AlertTitle>Rejected</AlertTitle>You have submitted overtime request for the day rejected by your
                  manager
                </Alert>
              )}
              {overtimeStatus === 'DRAFT' && (
                <Alert severity="warning">
                  <AlertTitle>Note</AlertTitle>Yet you have not submitted your overtime request
                </Alert>
              )}
              {managercomments && (
                <Alert severity="info">
                  <AlertTitle>Manager Comments</AlertTitle>
                  {managercomments}
                </Alert>
              )}
            </Stack>
            <Box m={2}>
              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                justifyContent="space-between"
              >
                <DatePicker
                  label="Date"
                  value={value}
                  inputFormat="dd/MM/yyyy"
                  minDate={previousWeek}
                  onChange={(newValue) => {
                    if (newValue) {
                      const parseddate = format(newValue, 'yyyy-MM-dd');
                      handleChange(parseddate);
                    }
                  }}
                  disabled={isLoading}
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
                <div>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'column', md: 'row' }}>
                    {!isNewRowEnabled && (
                      <Tooltip title="Add new row" placement="top">
                        <span>
                          <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            startIcon={<AddIcon />}
                            disabled={
                              !value || overtimeStatus === 'SUBMITTED' || overtimeStatus === 'APPROVED' || isLoading
                            }
                            onClick={() => setNewRow(!isNewRowEnabled)}
                          >
                            Add
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                    {isNewRowEnabled && (
                      <Tooltip title="Hide add row" placement="top">
                        <span>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            disabled={
                              !value || overtimeStatus === 'SUBMITTED' || overtimeStatus === 'APPROVED' || isLoading
                            }
                            onClick={() => setNewRow(!isNewRowEnabled)}
                          >
                            Cancel
                          </Button>
                        </span>
                      </Tooltip>
                    )}{' '}
                    <LoadingButton
                      fullWidth
                      size="small"
                      variant="contained"
                      loading={isLoading}
                      startIcon={<SaveIcon />}
                      onClick={() => handleSubmit('save')}
                      disabled={!value || overtimeStatus === 'SUBMITTED' || overtimeStatus === 'APPROVED' || isLoading}
                    >
                      Save
                    </LoadingButton>{' '}
                    <LoadingButton
                      fullWidth
                      size="small"
                      variant="contained"
                      loading={isLoading}
                      endIcon={<SendIcon />}
                      onClick={() => handleSubmit('submit')}
                      disabled={!value || overtimeStatus === 'SUBMITTED' || overtimeStatus === 'APPROVED' || isLoading}
                    >
                      Submit
                    </LoadingButton>
                  </Stack>
                </div>
              </Stack>
            </Box>
            <TableContainer component={Paper}>
              {isLoading && <LinearProgress />}
              <Table>
                <TableHead>
                  <TableRow style={{ whiteSpace: 'nowrap' }}>
                    <TableCell>S.No.</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Activity</TableCell>
                    {/* <TableCell>Status</TableCell> */}
                    <TableCell>Time required (in mins)</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                {/* {isNewRowEnabled && (
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <FastForwardIcon />
                      </TableCell>
                      <TableCell style={{ width: '30%' }}>
                        <FormControl fullWidth variant="standard" size="small" required>
                          <InputLabel id="category-select-label">Category</InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            name="category"
                            value={addRowDetails.category}
                            onChange={handleChangeNewRow}
                          >
                            <MenuItem value="">Select</MenuItem>
                            {categoryLOV.map((_x, i) => (
                              <MenuItem key={i} value={_x.value}>
                                {_x.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell style={{ width: '30%' }}>
                        <FormControl fullWidth variant="standard" size="small" required>
                          <InputLabel id="Project-select-label">Project</InputLabel>
                          <Select
                            labelId="Project-select-label"
                            id="Project-select"
                            name="project"
                            label="Project"
                            value={addRowDetails.project}
                            onChange={handleChangeNewRow}
                          >
                            <MenuItem value="">Select</MenuItem>
                            {projectLOV.map((_x, i) => (
                              <MenuItem key={i} value={_x.projectName}>
                                {_x.projectName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell style={{ width: '60%' }}>
                        <TextField
                          fullWidth
                          id="activity-multiline-static"
                          label="Activity"
                          name="activity"
                          multiline
                          variant="standard"
                          value={addRowDetails.activity}
                          onChange={handleChangeNewRow}
                          inputProps={{ maxLength: 255 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth variant="standard" size="small" required>
                          <InputLabel id="Status-select-label">Status</InputLabel>
                          <Select
                            labelId="Status-select-label"
                            id="Status-select"
                            label="Status"
                            name="status"
                            value={addRowDetails.status}
                            onChange={handleChangeNewRow}
                          >
                            <MenuItem value="">Select</MenuItem>
                            {statuses.map((_x, i) => (
                              <MenuItem key={i} value={_x.value}>
                                {_x.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="standard"
                          size="small"
                          type="number"
                          name="minutes"
                          label="Time Spent"
                          inputProps={{ min: 0 }}
                          value={addRowDetails.minutes}
                          onChange={handleChangeNewRow}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id="remarks-multiline-static"
                          label="Remarks"
                          multiline
                          name="remarks"
                          variant="standard"
                          value={addRowDetails.remarks}
                          onChange={handleChangeNewRow}
                          inputProps={{ maxLength: 255 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Save" placement="top">
                          <IconButton
                            color="primary"
                            aria-label="save"
                            component="span"
                            onClick={handleAddNewRow}
                            disabled={!value || status === 'SUBMITTED' || status === 'APPROVED' || isLoading}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )} */}

                {overTimeTaskDetails.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                        <TaskNotFound />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                <TableBody>
                  {overTimeTaskDetails.length > 0 &&
                    overTimeTaskDetails
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.project}</TableCell>
                          <TableCell style={{ width: '30%', wordBreak: 'break-all' }}>{row.activity}</TableCell>
                          {/* <TableCell>
                            <Chip
                              label={row.status}
                              color={
                                // eslint-disable-next-line no-nested-ternary
                                row.status === 'APPROVED'
                                  ? 'success'
                                  : row.status === 'SUBMITTED'
                                  ? 'secondary'
                                  : 'warning'
                              }
                              variant="outlined"
                            />
                          </TableCell> */}
                          <TableCell align="center">{row.minutes}</TableCell>
                          {/* <TableCell align="center">{row.submittedOn}</TableCell> */}
                          <TableCell style={{ width: '30%', wordBreak: 'break-all' }}>
                            {row.remarks ? row.remarks : '---'}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="edit" placement="top">
                              <IconButton
                                color="primary"
                                aria-label="edit"
                                component="span"
                                onClick={() => handleDraweropen(row, index)}
                                disabled={
                                  !value || overtimeStatus === 'SUBMITTED' || overtimeStatus === 'APPROVED' || isLoading
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} />
                    <TableCell>Total (mins) </TableCell>
                    <TableCell align="center">{sumMins}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} />
                    <TableCell>Total (hrs) </TableCell>
                    <TableCell align="center">{timeConvert(sumMins)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={overTimeTaskDetails.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </CardContent>
        </Card>
        <Drawer anchor="right" open={isEditOpened} onClose={handleDrawerClose} hideBackdrop>
          <Box m={5} sx={{ width: { sm: 'auto', md: drawerWidth } }} role="presentation">
            <Typography variant="h6" gutterBottom component="div" align="center">
              Edit details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard" size="small">
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    label="Category"
                    name="category"
                    value={editRowDetails.category}
                    onChange={handleEditNewRow}
                  >
                    {categoryLOV.map((_x, i) => (
                      <MenuItem key={i} value={_x.value}>
                        {_x.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard" size="small">
                  <InputLabel id="Project-select-label">Project</InputLabel>
                  <Select
                    labelId="Project-select-label"
                    id="Project-select"
                    name="project"
                    label="Project"
                    value={editRowDetails.project}
                    onChange={handleEditNewRow}
                  >
                    {projectLOV.map((_x, i) => (
                      <MenuItem key={i} value={_x.projectName}>
                        {_x.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard" size="small">
                  <InputLabel id="Status-select-label">Status</InputLabel>
                  <Select
                    labelId="Status-select-label"
                    id="Status-select"
                    label="Status"
                    name="status"
                    value={editRowDetails.status}
                    onChange={handleEditNewRow}
                  >
                    {statuses.map((_x, i) => (
                      <MenuItem key={i} value={_x.value}>
                        {_x.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  name="minutes"
                  variant="standard"
                  label="Time Required(in mins)"
                  value={editRowDetails.minutes}
                  onChange={handleEditNewRow}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  multiline
                  size="small"
                  maxRows={4}
                  name="activity"
                  variant="standard"
                  label="Activity Description"
                  value={editRowDetails.activity}
                  onChange={handleEditNewRow}
                  inputProps={{ maxLength: 255 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  multiline
                  maxRows={4}
                  fullWidth
                  name="remarks"
                  size="small"
                  variant="standard"
                  label="Remarks / Comments (if any)"
                  value={editRowDetails.remarks}
                  onChange={handleEditNewRow}
                  inputProps={{ maxLength: 255 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ClearIcon />}
                  onClick={handleDrawerClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SaveIcon />}
                  disabled={isLoading}
                  onClick={handleEditRow}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Drawer>
        <Drawer anchor="right" open={isNewRowEnabled} onClose={() => setNewRow(!isNewRowEnabled)} hideBackdrop>
          <Box m={5} sx={{ width: { sm: 'auto', md: drawerWidth } }} role="presentation">
            <Typography variant="h6" gutterBottom component="div" align="center">
              Add details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard" size="small">
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    label="Category"
                    name="category"
                    value={addRowDetails.category}
                    onChange={handleChangeNewRow}
                  >
                    {categoryLOV.map((_x, i) => (
                      <MenuItem key={i} value={_x.value}>
                        {_x.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard" size="small">
                  <InputLabel id="Project-select-label">Project</InputLabel>
                  <Select
                    labelId="Project-select-label"
                    id="Project-select"
                    name="project"
                    label="Project"
                    value={addRowDetails.project}
                    onChange={handleChangeNewRow}
                  >
                    {projectLOV.map((_x, i) => (
                      <MenuItem key={i} value={_x.projectName}>
                        {_x.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard" size="small">
                  <InputLabel id="Status-select-label">Status</InputLabel>
                  <Select
                    labelId="Status-select-label"
                    id="Status-select"
                    label="Status"
                    name="status"
                    value={addRowDetails.status}
                    onChange={handleChangeNewRow}
                  >
                    {statuses.map((_x, i) => (
                      <MenuItem key={i} value={_x.value}>
                        {_x.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  variant="standard"
                  name="minutes"
                  label="Time Required(in mins)"
                  value={addRowDetails.minutes}
                  onChange={handleChangeNewRow}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  multiline
                  size="small"
                  variant="standard"
                  maxRows={4}
                  name="activity"
                  label="Activity Description"
                  value={addRowDetails.activity}
                  onChange={handleChangeNewRow}
                  inputProps={{ maxLength: 255 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  multiline
                  maxRows={4}
                  fullWidth
                  name="remarks"
                  size="small"
                  variant="standard"
                  label="Remarks / Comments (if any)"
                  value={addRowDetails.remarks}
                  onChange={handleChangeNewRow}
                  inputProps={{ maxLength: 255 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ClearIcon />}
                  onClick={() => setNewRow(!isNewRowEnabled)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  disabled={isLoading}
                  onClick={handleAddNewRow}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Drawer>
        {/* <Snackbar
          open={isTimeError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={6000}
          onClose={() => setTimeErrorOpen(false)}
          message="Your daily task does not meet the required 8 hrs. Would you like to proceed anyway ?"
          action={
            <Button color="secondary" size="small" onClick={handleForceSubmit}>
              Yes, Proceed anyway
            </Button>
          }
        /> */}
      </Container>
    </Page>
  );
}
