import { filter } from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  Card,
  Button,
  Box,
  Table,
  TableBody,
  TextField,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Container,
  CardContent,
  Stack,
  TableFooter
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  getOverTimeSingleListFromOverTimeAppr,
  getOverTimeDetailsFromOverTimeAppr,
  getOverTimeListAsync,
  postSingleOTApproveDetailsAsync
} from '../../redux/slices/overTimeApprovalSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.empId.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
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
  // {
  //   id: 'status',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Status'
  // },
  {
    id: 'timespent',
    numeric: false,
    disablePadding: false,
    label: 'Time Spent(IN MINS)'
  },
  {
    id: 'remarks',
    numeric: false,
    disablePadding: false,
    label: 'Remarks'
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
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

export default function OverTimeApprovalList() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rows = useSelector(getOverTimeSingleListFromOverTimeAppr);
  //   getTaskListFromTSAppr
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const title = 'OverTime Approval List';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  // eslint-disable-next-line no-unused-vars
  const [filterName, setFilterName] = React.useState('');
  const [comments, setComments] = React.useState('');
  const timesheetIdDetails = useSelector(getOverTimeDetailsFromOverTimeAppr);
  //   getTimesheetIdDetailsFromTSAppr

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleComments = (e) => {
    setComments(e.target.value);
  };

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

  const sumMins = rows.length === 0 ? 0 : rows.map((o) => o.minutes).reduce((a, c) => Number(a) + Number(c));

  const handleSubmit = (value) => {
    let overtimeId = null;

    const appVal = 'Approved Successfully';
    const rejVal = 'Rejected Successfully';
    let finVal = '';
    if (value === 'approve') {
      finVal = appVal;
    } else {
      finVal = rejVal;
    }
    for (let i = 0; i < rows.length; i += 1) {
      overtimeId = rows[i].overtimeId.over_time_id;
      break;
    }

    const payload = {
      requestHeader: {
        SourceSystem: '',
        UUID: '',
        TimeStamp: new Date()
      },
      requestData: {
        overtimeId,
        date: new Date(),
        managercomments: comments,
        sendNotificationsTo: '',
        hours: timeConvert2Deci(sumMins),
        minutes: sumMins.toString(),
        usercomments: comments,
        userId: 'userid',
        action: value
      }
    };
    dispatch(postSingleOTApproveDetailsAsync(payload))
      .then(() => {
        enqueueSnackbar(finVal, {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        navigate(PATH_DASHBOARD.timesheet.overTimeApproval);
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
  };

  const handleBack = () => {
    dispatch(getOverTimeListAsync()).then(() => {
      navigate(PATH_DASHBOARD.timesheet.overTimeApproval);
    });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredUsers = applySortFilter(rows, getComparator(order, orderBy), filterName);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'OverTime Approval List', href: PATH_DASHBOARD.timesheet.overTimeApproval },
            { name: 'Individual List' }
          ]}
          action={
            <>
              <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => handleBack()}>
                Back
              </Button>{' '}
              <Button variant="contained" startIcon={<ThumbUpIcon />} onClick={() => handleSubmit('approve')}>
                Approve
              </Button>{' '}
              <Button variant="contained" startIcon={<ThumbDownIcon />} onClick={() => handleSubmit('additional_info')}>
                Reject
              </Button>
            </>
          }
        />

        <Card>
          {/* <ApprovalListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}

          <CardContent>
            <Stack spacing={3}>
              <Scrollbar>
                <TableContainer>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bolder' }}>Employee Id</TableCell>
                      <TableCell align="center">{timesheetIdDetails.empId}</TableCell>
                      <TableCell style={{ fontWeight: 'bolder' }}>Employee Name</TableCell>
                      <TableCell align="right">{timesheetIdDetails.name}</TableCell>
                      <TableCell style={{ fontWeight: 'bolder' }}>Date</TableCell>
                      <TableCell align="right">
                        {timesheetIdDetails.date ? timesheetIdDetails.date.substr(0, 10) : '-'}
                      </TableCell>
                      <TableCell colSpan={3}>
                        <TextField
                          fullWidth
                          autoFocus
                          size="small"
                          label="Enter your comments"
                          multiline
                          variant="standard"
                          name="comments"
                          value={comments}
                          onChange={handleComments}
                          inputProps={{ maxLength: 255 }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>

                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell align="left">{row.category}</TableCell>
                          <TableCell align="left">{row.project}</TableCell>
                          <TableCell align="center" style={{ width: '30%', wordBreak: 'break-all' }}>
                            {row.activity}
                          </TableCell>
                          {/* <TableCell align="left">{row.status}</TableCell> */}
                          <TableCell align="center">{row.minutes}</TableCell>
                          <TableCell align="left">{row.remarks}</TableCell>
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
              </Scrollbar>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
