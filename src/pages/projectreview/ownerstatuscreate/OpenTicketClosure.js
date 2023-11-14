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
  TableCell,
  IconButton
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { format } from 'date-fns';
import calendarOutline from '@iconify/icons-eva/calendar-outline';
import { Icon } from '@iconify/react';
import { getOpenticketsAsync } from '../../../redux/slices/projSlice';
import * as paths from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import useSettings from '../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../redux/store';
import Scrollbar from '../../../components/Scrollbar';
import { UserListHead, UserListToolbar } from '../../../components/_administrator/list';
import SearchNotFound from '../../../components/SearchNotFound';

/*eslint-disable*/

const TABLE_HEAD = [
  //   { id: 'proj_Id', label: 'S.NO', alignRight: false, margin: '' },
  { id: 'week_NO', label: 'Week Number        ', alignRight: false, margin: '' },
  { id: 'module_TOTAL', label: 'No.of Open Tickets           ', alignRight: false, margin: '' },
  { id: 'Edit', label: 'Edit          ', alignRight: false, margin: '' }
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

export default function OpenTicketClosure() {
  // return <Typography variant="h1">Ajay</Typography>;
  const { themestretch } = useSettings();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  //   const { userList } = useSelector();
  const { openTickets: userList } = useSelector((state) => state.proj);
  console.log('list', userList);
  const [orderBy, setOrderBy] = useState('type');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const params = useParams();
  const token = localStorage.getItem('accessToken');
  console.log('params', params.projId);
  const [projcetId, setProjId] = useState('');

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    axios
      .get(
        `https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getIdSupportProject/${params.projId}`,
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
        setProjId(res.data.proj_Id);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local storage', JSON.parse(localStorage.getItem('Details')));
  }, []);

  console.log('projectId', projcetId);

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
    dispatch(getOpenticketsAsync(projcetId));
  }, [dispatch]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Open Tickets';
  return (
    <Page title={title}>
      <Container maxWidth={themestretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: paths.PATH_DASHBOARD.general.root },
            { name: 'Status', href: paths.PATH_DASHBOARD.review.findProject },
            { name: 'Details' }
            // { name: 'List' }
          ]}
        />
        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

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
                    const { week_NO: weekNo, module_TOTAL: moduleTotal } = row;
                    const isItemSelected = selected.indexOf(weekNo) !== -1;

                    return (
                      <TableRow
                        hover
                        key={weekNo}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="left">{weekNo}</TableCell>
                        <TableCell align="left">{moduleTotal}</TableCell>

                        <TableCell align="left">
                          <IconButton
                            aria-label="Edit"
                            component={RouterLink}
                            to={`${paths.PATH_DASHBOARD.review.editWeekRev}/${params.projId}`}
                          >
                            <EditIcon />
                          </IconButton>
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
