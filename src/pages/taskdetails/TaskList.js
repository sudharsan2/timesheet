import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton
} from '@mui/material';

import TaskOwnerMenu from '../../components/_administrator/list/TaskOwnerMenu';

// redux
import { getManagerTaskAssignByAsync } from '../../redux/slices/taskSlice';
import { useDispatch, useSelector } from '../../redux/store';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'manager_id', label: ' Manager_Id', alignRight: false, margin: '' },
  { id: 'type', label: ' TYPE', alignRight: false, margin: '' },
  { id: 'client', label: 'CLIENT', alignRight: false, margin: '' },
  { id: 'date_assiened', label: 'DATE_ASSIGNED', alignRight: false, margin: '' },
  { id: 'target_completion_date', label: 'TARGET_COMPILATION', alignRight: false, margin: '' },
  { id: 'assigned-by', label: 'ASSIGNED_BY', alignRight: false, width: 200 },
  { id: 'assigned-to', label: 'ASSIGNED_TO', alignRight: false, width: 200 },
  { id: 'description', label: 'DESCRIPTION', alignRight: false },
  { id: 'priority', label: 'PRIORITY', alignRight: false },
  { id: 'status', label: 'STATUS', alignRight: false },
  { id: 'remarks', label: 'REMARKS', alignRight: false },
  { id: 'history', label: 'HISTORY', alignRight: false }
];

// ----------------------------------------------------------------------

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
    return filter(array, (_user) => _user.type.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TaskList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { tasks: userList } = useSelector((state) => state.task);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('type');
  const [filterName, setFilterName] = useState('');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isLoading = false;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  useEffect(() => {
    dispatch(getManagerTaskAssignByAsync());
  }, [dispatch]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Task Assignment';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Task Details', href: PATH_DASHBOARD.task.taskList },
            { name: 'List' }
          ]}
          action={
            <>
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.task.taskCreate}
                startIcon={<Icon icon={plusFill} />}
              >
                Create
              </Button>{' '}
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.task.taskAssigned}
                startIcon={<Icon icon={plusFill} />}
              >
                Assigned Tasks
              </Button>{' '}
            </>
          }
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
                      manager_id: managerId,
                      manager_id_copy: managerIdCopy,
                      type,
                      client,
                      date_assiened: dateAssigned,
                      target_completion_date: targetCompilation,
                      assigned_by: assignedBy,
                      assigned_to: assignedTo,
                      description,
                      priority,
                      status,
                      remarks,
                      history
                    } = row;
                    const isItemSelected = selected.indexOf(managerId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={managerId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {managerId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">{client}</TableCell>
                        <TableCell align="left">{dateAssigned}</TableCell>
                        <TableCell align="left">{targetCompilation}</TableCell>
                        <TableCell align="left">{assignedBy}</TableCell>
                        <TableCell align="left">{assignedTo}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{priority}</TableCell>
                        <TableCell align="left">{status}</TableCell>

                        <TableCell align="left">{remarks}</TableCell>

                        <TableCell align="right">
                          <TaskOwnerMenu managerId={managerId} />
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
