import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableFooter,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Container,
  Button,
  TextField,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { visuallyHidden } from '@mui/utils';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from '@mui/lab/DatePicker';
import { useNavigate } from 'react-router';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import {
  getIsLoadingFromTS,
  editTimesheetAsync,
  getTimeSheetEntryAsync,
  getTimesheetIdFromTS,
  getTimesheetListFromTS,
  setDateValue,
  createTimeSheetEntryAsync,
  getDateFromTS,
  getTimesheetStatusFromTS,
  getErrorFromTS,
  setErrorNull
} from '../../redux/slices/timesheetSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import TaskNotFound from '../../components/TaskNotFound';
import { MIconButton } from '../../components/@material-extend';

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'category',
    numeric: false,
    disablePadding: true,
    label: 'Category'
  },
  {
    id: 'project',
    numeric: false,
    disablePadding: false,
    label: 'Project'
  },
  {
    id: 'activity',
    numeric: false,
    disablePadding: false,
    label: 'Activity'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'timeSpent',
    numeric: true,
    disablePadding: false,
    label: 'Time Spent (in Mins)'
  },
  {
    id: 'remarks',
    numeric: false,
    disablePadding: false,
    label: 'Remarks'
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action'
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow
        style={{
          whiteSpace: 'nowrap'
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

const EnhancedTableToolbar = (props) => {
  // eslint-disable-next-line react/prop-types
  const { numSelected, status } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
        Timesheet
      </Typography>
      <Typography variant="subtitle1" id="tableTitle" component="div">
        Status:&nbsp;
      </Typography>
      <Chip
        size="small"
        label={status || 'NA'}
        color={status === 'SUBMITTED' || status === 'APPROVED' ? 'success' : 'secondary'}
      />
    </Toolbar>
  );
};

export default function TimesheetEntry() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('timesheetId');
  const [page, setPage] = React.useState(0);
  const [value, setValue] = React.useState('');
  const rows = useSelector(getTimesheetListFromTS);
  const tsId = useSelector(getTimesheetIdFromTS);
  const tsStatus = useSelector(getTimesheetStatusFromTS);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const title = 'Timesheet Entry';
  const isLoading = useSelector(getIsLoadingFromTS);
  const date = useSelector(getDateFromTS);
  const error = useSelector(getErrorFromTS);
  const today = new Date();
  const previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

  const sumMins = rows.length === 0 ? 0 : rows.map((o) => o.minutes).reduce((a, c) => Number(a) + Number(c));

  const specificDate = new Date();
  specificDate.setFullYear(2023);
  specificDate.setMonth(9);
  specificDate.setDate(18);
  console.log('first,', specificDate);

  const timeConvert = (n) => {
    const num = Number(n);
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return `${rhours} hour(s) and ${rminutes} minute(s).`;
  };

  const timeConvert2Deci = (n) => {
    const num = Number(n);
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return `${rhours}.${rminutes}`;
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const isUserNotFound = rows.length === 0;

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
      const _payload = {
        date: _date,
        hours: timeConvert2Deci(sumMins),
        minutes: sumMins.toString()
      };
      dispatch(setDateValue(_payload));
      dispatch(getTimeSheetEntryAsync(payload));
      setValue(_date);
    }
  };

  const handlenav = () => {
    navigate(PATH_DASHBOARD.timesheet.addTimesheet);
  };

  const handleEdit = async (e) => {
    if (value) {
      const payload = {
        date: value,
        timesheetId: tsId,
        taskId: e,
        hours: timeConvert2Deci(sumMins),
        minutes: sumMins.toString()
      };
      dispatch(setDateValue(payload));
      await dispatch(editTimesheetAsync(e))
        .then(() => {
          enqueueSnackbar('Showing Task Details', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          navigate(PATH_DASHBOARD.timesheet.editTimesheet);
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        });
    }
  };

  const handleSubmit = () => {
    const validHrs = timeConvert2Deci(sumMins);

    if (Number(validHrs) > 24) {
      enqueueSnackbar('Hold on! Your entered task exceeds 24 hrs in a day', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      return;
    }

    if (Number(validHrs) < 8) {
      enqueueSnackbar('Your daily task does not meet the required 8 hrs', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      return;
    }

    dispatch(setErrorNull(''));

    const payload = {
      submitPayload: {
        requestHeader: {
          SourceSystem: '',
          UUID: '',
          TimeStamp: ''
        },
        requestData: {
          timesheetId: tsId,
          date: value,
          hours: timeConvert2Deci(sumMins),
          minutes: sumMins.toString(),
          usercomments: '',
          action: 'Submit',
          taskDetails: rows
        }
      },
      queryPayload: {
        requestHeader: {
          SourceSystem: '',
          UUID: '',
          TimeStamp: ''
        },
        requestData: {
          date: value
        }
      }
    };
    dispatch(createTimeSheetEntryAsync(payload));
  };

  React.useEffect(() => {
    // const emptyVal = [];
    // dispatch(setTimeSheetEmptyValue(emptyVal));

    if (date.date) {
      setValue(date.date);
      dispatch(
        getTimeSheetEntryAsync({
          requestHeader: {
            SourceSystem: '',
            UUID: '',
            TimeStamp: ''
          },
          requestData: {
            date: date.date
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (error) {
      dispatch(setErrorNull(null));
      enqueueSnackbar(error, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, error]);

  return (
    <div>
      <Page title={title}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={title}
            links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Timesheet Entry' }]}
          />
          <Card>
            <Box m={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                justifyContent="space-between"
                alignItems="center"
              >
                <DatePicker
                  label="Date"
                  value={value}
                  inputFormat="dd/MM/yyyy"
                  disableFuture
                  minDate={previousWeek}
                  maxDate={specificDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      const parseddate = format(newValue, 'yyyy-MM-dd');
                      handleChange(parseddate);
                    }
                  }}
                  disabled={isLoading}
                  renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!value || tsStatus === 'SUBMITTED' || tsStatus === 'APPROVED' || isLoading}
                  onClick={handlenav}
                >
                  Create
                </Button>{' '}
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={
                    !value || tsStatus === 'SUBMITTED' || tsStatus === 'APPROVED' || isLoading || rows.length === 0
                  }
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
            <CardContent>
              <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                  <EnhancedTableToolbar status={tsStatus} />
                  <TableContainer>
                    <Table sx={{ minWidth: 750, width: '100%' }} aria-labelledby="tableTitle">
                      <EnhancedTableHead
                        // numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        // onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                      />
                      <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={index}
                              // onDoubleClick={() => handleEdit(row.taskId)}
                              style={{ cursor: 'pointer' }}
                            >
                              <TableCell>{row.category}</TableCell>
                              <TableCell>{row.project}</TableCell>
                              <TableCell
                                style={{
                                  width: 100,
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word'
                                }}
                              >
                                {row.activity}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.status}
                                  color={
                                    // eslint-disable-next-line no-nested-ternary
                                    row.status === 'Completed'
                                      ? 'success'
                                      : row.status === 'In Process'
                                      ? 'secondary'
                                      : 'warning'
                                  }
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="center">{row.minutes}</TableCell>
                              <TableCell
                                style={{
                                  width: 100,
                                  whiteSpace: 'normal',
                                  wordWrap: 'inherit'
                                }}
                              >
                                {row.remarks}
                              </TableCell>
                              <TableCell>
                                <Button
                                  disabled={isLoading || tsStatus === 'SUBMITTED' || tsStatus === 'APPROVED'}
                                  startIcon={<EditIcon />}
                                  onClick={() => handleEdit(row.taskId)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {emptyRows > 0 && (
                          <TableRow>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      {isUserNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                              <TaskNotFound />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3} />
                          <TableCell>Total (mins) </TableCell>
                          <TableCell align="center">{sumMins}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={3} />
                          <TableCell>Total (hrs) </TableCell>
                          <TableCell align="center">{timeConvert(sumMins)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Page>
    </div>
  );
}
