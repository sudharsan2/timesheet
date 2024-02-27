/* eslint-disable import/named */
import { filter } from 'lodash';
import {
  Container,
  Typography,
  Stack,
  Button,
  Card,
  TableContainer,
  Table,
  TablePagination,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { format } from 'date-fns';
import calendarOutline from '@iconify/icons-eva/calendar-outline';
import { Icon } from '@iconify/react';
import { getAllProjectsOfAnEmpAsync } from '../../redux/slices/projSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import Scrollbar from '../../components/Scrollbar';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import SearchNotFound from '../../components/SearchNotFound';

const TABLE_HEAD = [
  // { id: 'proj_Id', label: 'S.NO', alignRight: false, margin: '' },
  { id: 'primary_Project', label: 'Project', alignRight: false, margin: '' },
  { id: 'client_Name', label: 'Client', alignRight: false, margin: '' },
  { id: 'location', label: 'Location', alignRight: false, margin: '' },
  { id: 'support_Type', label: 'Support', alignRight: false, margin: '' },
  { id: 'duration', label: 'Duration', alignRight: false, margin: '' },
  { id: 'accomadation', label: 'Accomadation', alignRight: false, margin: '' },
  { id: 'travel_Arrangement', label: 'Travel', alignRight: false, margin: '' },
  { id: 'reporting_date', label: 'Reporting Date', alignRight: false, margin: '' }
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
    return filter(array, (_user) => _user.primary_Project.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProjectCreate() {
  // return <Typography variant="h1">Ajay</Typography>;
  const { themestretch } = useSettings();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  //   const { userList } = useSelector();
  const { workedProj: userList } = useSelector((state) => state.proj);
  console.log('list', userList);
  const { users } = useSelector((state) => state.user);
  console.log('First', users);
  const [orderBy, setOrderBy] = useState('type');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filterName, setFilterName] = useState('');

  const userDetails = users.find((_x) => _x.employeeId === params.employeeId);
  console.log('34', userDetails);

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
    console.log('this is param value', userDetails.id);
    dispatch(getAllProjectsOfAnEmpAsync(userDetails.id));
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Worked Project History';
  return (
    <Page title={title}>
      <Container maxWidth={themestretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User Management', href: PATH_DASHBOARD.admin.userManagement },
            { name: 'Worked Projects' }
          ]}
        />
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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
                      primary_Project: primaryProject,
                      client_Name: clientName,
                      location,
                      support_Type: supportType,
                      duration,
                      accomadation,
                      travel_Arrangement: travelArrangement,
                      reporting_date: reportingDate
                      // workingDays
                    } = row;
                    const isItemSelected = selected.indexOf(primaryProject) !== -1;

                    return (
                      <TableRow
                        hover
                        key={primaryProject}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="left">{primaryProject}</TableCell>
                        <TableCell align="left">{clientName}</TableCell>
                        <TableCell align="left">{location} </TableCell>
                        <TableCell align="left">{supportType}</TableCell>
                        <TableCell align="left">{duration}</TableCell>
                        <TableCell align="left">{accomadation}</TableCell>
                        <TableCell align="left">{travelArrangement}</TableCell>
                        <TableCell align="left">{reportingDate}</TableCell>
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
