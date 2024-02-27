import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-outline';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ArrowCircle from '@iconify/icons-eva/arrow-circle-right-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { MIconButton } from '../../components/@material-extend';
import AssetMoreMenu from '../../components/_administrator/list/AssetMoreMenu';
// redux
import { getListOfTravelDetailsByManagerAsync, approveOrRejectTravelReqAsync } from '../../redux/slices/projectSlice';
import { useDispatch, useSelector } from '../../redux/store';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import TravelStatusToolbar from './TravelStatusToolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'travel_id', label: 'SNo', alignRight: false, margin: '' },
  {},
  { id: 'employee_name', label: 'Name', alignRight: false, margin: '' },
  { id: 'emp_id', label: 'Emp Id', alignRight: false, margin: '' },
  { id: 'project', label: 'Project Name', alignRight: false, margin: '' },
  { id: 'location_from', label: 'Location From', alignRight: false, margin: '' },
  { id: 'location_to', label: 'Location To', alignRight: false, margin: '' },
  { id: 'date_of_travel', label: 'Travel Date', alignRight: false, margin: '' },
  { id: 'travel_mode', label: 'Travel Mode', alignRight: false, margin: '' },
  { id: 'hotel_name', label: 'Hotel', alignRight: false, margin: '' },
  { id: 'status', label: 'Status', alignRight: false, margin: '' }
  // { id: 'action', label: 'Action', alignRight: false, margin: '' }
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
    return filter(array, (_user) => _user.employee_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProjectCreate() {
  // return <Typography variant="h1">Ajay</Typography>;
  const { themestretch } = useSettings();
  const params = useParams();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  //   const { userList } = useSelector();
  const { managerList: userList } = useSelector((state) => state.project);
  console.log('list', userList);
  const [orderBy, setOrderBy] = useState('type');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [filterName, setFilterName] = useState('');

  //   const statusList = userList.find((val) => {
  //     return val.travel_id === params.travel_id;
  //   });
  //   console.log('first', statusList);

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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handlePreview = (row) => {
    setView(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApprovedStatus = () => {
    const payload = [...selected];

    dispatch(approveOrRejectTravelReqAsync(payload.map((_x) => ({ travel_id: _x, status: 'APPROVED' })))).then(() => {
      // console.info('Submitted Issue is in process');
      enqueueSnackbar('Approved Successfully', {
        variant: 'Submitted',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    });
  };

  const handleRejectStatus = () => {
    const payload = [...selected];

    dispatch(approveOrRejectTravelReqAsync(payload.map((_x) => ({ travel_id: _x, status: 'REJECTED' })))).then(() => {
      // console.info('Submitted Issue is in process');
      enqueueSnackbar('Rejected Successfully', {
        variant: 'Submitted',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    });
  };

  useEffect(() => {
    dispatch(getListOfTravelDetailsByManagerAsync());
  }, [dispatch]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Request Approval List';
  return (
    <Page title={title}>
      <Container maxWidth={themestretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Details' }
            // { name: 'List' }
          ]}
          action={
            <>
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.travel.requestForm}
                startIcon={<Icon icon={plusFill} />}
              >
                Request Form
              </Button>{' '} */}
              {/* <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.project.uploadPaysquare}
                  startIcon={<Icon icon={calendarOutline} />}
                >
                  Upload File
                </Button>{' '} */}
            </>
          }
        />
        <Card>
          <TravelStatusToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onApproved={handleApprovedStatus}
            onRejected={handleRejectStatus}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      travel_id: travelId,
                      employee_name: empName,
                      emp_id: empId,
                      project,
                      location_from: locationFrom,
                      location_to: locationTo,
                      date_of_travel: dateTravel,
                      travel_mode: travelMode,
                      hotel_name: hotelName,
                      status
                      // workingDays
                    } = row;
                    const isItemSelected = selected.indexOf(travelId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={travelId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            onChange={(event) => handleClick(event, travelId)}
                            checked={isItemSelected}
                          />
                        </TableCell>
                        {/* <TableCell align="left">{travelId}</TableCell> */}
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {empName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{String(empId).slice(0, 10)}</TableCell>
                        <TableCell align="left">{project}</TableCell>
                        <TableCell align="left">{locationFrom} </TableCell>
                        <TableCell align="left">{locationTo}</TableCell>
                        <TableCell align="left">{String(dateTravel).slice(0, 10)}</TableCell>
                        <TableCell align="left">{travelMode}</TableCell>
                        <TableCell align="left">{hotelName}</TableCell>
                        <TableCell align="left">{status}</TableCell>
                        {/* <TableCell>
                          <Button
                            sx={{ height: '10%', backgroundColor: '#ff6e40' }}
                            size="small"
                            variant="contained"
                            component={RouterLink}
                            // to={PATH_DASHBOARD.travel.approveStatus}
                            to={`${PATH_DASHBOARD.travel.approveManager}/${travelId}`}
                            startIcon={<Icon icon={ArrowCircle} />}
                          >
                            Details
                          </Button>
                        </TableCell> */}
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
      </Container>
    </Page>
  );
}
