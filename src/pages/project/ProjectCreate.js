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
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { format } from 'date-fns';
import calendarOutline from '@iconify/icons-eva/calendar-outline';
import { Icon } from '@iconify/react';
import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import Scrollbar from '../../components/Scrollbar';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import SearchNotFound from '../../components/SearchNotFound';
import ProjectMenu from '../../components/_administrator/list/ProjectMenu';

const TABLE_HEAD = [
  // { id: 'proj_Id', label: 'S.NO', alignRight: false, margin: '' },
  { id: 'proj_Name', label: 'Project Name', alignRight: false, margin: '' },
  { id: 'emp_Projects', label: 'Employee Name', alignRight: false, margin: '' },
  { id: 'calendarName', label: 'Calendar Name', alignRight: false, margin: '' },
  { id: 'description', label: 'Project Description', alignRight: false, margin: '' },
  { id: 'start_Date', label: 'Start_Date', alignRight: false, margin: '' },
  { id: 'end_Date', label: 'End_Date', alignRight: false, margin: '' }
  // { id: 'holidays', label: 'Exception Date', alignRight: false, margin: '' }
  // { id: 'workingDays', label: 'Working Days', alignRight: false, margin: '' }
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
    return filter(array, (_user) => _user.proj_Name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProjectCreate() {
  // return <Typography variant="h1">Ajay</Typography>;
  const { themestretch } = useSettings();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  //   const { userList } = useSelector();
  const { projects: userList } = useSelector((state) => state.proj);
  console.log('list', userList);
  const [orderBy, setOrderBy] = useState('type');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filterName, setFilterName] = useState('');

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
    dispatch(getAllProjectsAsync());
  }, [dispatch]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Project Creation';
  return (
    <Page title={title}>
      <Container maxWidth={themestretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Project Details' }
            // { name: 'List' }
          ]}
          action={
            <>
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.project.createProject}
                startIcon={<Icon icon={plusFill} />}
              >
                Create Project
              </Button>{' '}
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.project.projectCalendar}
                startIcon={<Icon icon={calendarOutline} />}
              >
                Project Calendar
              </Button>{' '}
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
                      proj_Id: projId,
                      proj_Name: projName,
                      emp_Projects: empProjects,
                      calendarName,
                      description,
                      start_Date: startDate,
                      end_Date: endDate,
                      holidays
                      // workingDays
                    } = row;
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
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {projName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {/* <TableCell align="left">{projName}</TableCell> */}
                        <TableCell align="left">
                          {empProjects?.map(({ name }) => {
                            console.log('dfgh', name);
                            return `${name} \n`;
                          })}
                        </TableCell>
                        <TableCell align="left">{calendarName}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{String(startDate).slice(0, 10)} </TableCell>
                        <TableCell align="left">{String(endDate).slice(0, 10)}</TableCell>
                        {/* <TableCell align="left">
                          {holidays.map(({ offDate }) => {
                            console.log('ghd', offDate);
                            return `${String(offDate).slice(0, 10)} \n`;
                          })}
                        </TableCell> */}
                        {/* <TableCell align="left">{workingDays}</TableCell> */}
                        <TableCell align="right">
                          <ProjectMenu projId={projId} />
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

// import { filter } from 'lodash';
// import { Container, Typography, Button, Icon, TableContainer, Table } from '@mui/material';
// import { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import plusFill from '@iconify/icons-eva/plus-fill';
// import { PATH_DASHBOARD } from '../../routes/paths';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import Page from '../../components/Page';
// import useSettings from '../../hooks/useSettings';
// import { useDispatch, useSelector } from '../../redux/store';
// import Scrollbar from '../../components/Scrollbar';
// import { UserListHead, UserListToolbar } from '../../components/_administrator/list';

// const TABLE_HEAD = [
//   { id: 'project_id', label: 'Project Id', alignRight: false, margin: '' },
//   { id: 'empId', label: 'Employee Id', alignRight: false, margin: '' },
//   { id: 'empName', label: 'Employee Name', alignRight: false, margin: '' },
//   { id: 'projName', label: 'Project Name', alignRight: false, margin: '' },
//   { id: 'projDescription', label: 'Project Description', alignRight: false, margin: '' },
//   { id: 'fromDate', label: 'Start Date', alignRight: false, margin: '' },
//   { id: 'endDate', label: 'End Date', alignRight: false, margin: '' }
// ];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function applySortFilter(array, comparator, query) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   if (query) {
//     return filter(array, (_user) => _user.type.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }
//   return stabilizedThis.map((el) => el[0]);
// }

// export default function ProjectCreate() {
//   // return <Typography variant="h1">Ajay</Typography>;
//   const { themestretch } = useSettings();
//   const [selected, setSelected] = useState([]);
//   const [page, setPage] = useState(0);
//   const [order, setOrder] = useState('asc');
//   //   const { userList } = useSelector();
//   const [orderBy, setOrderBy] = useState('type');
//   const [isViewOpen, setView] = useState(false);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const [filterName, setFilterName] = useState('');

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleFilterByName = (event) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   //   const handleSelectAllClick = (event) => {
//   //     if (event.target.checked) {
//   //       const newSelecteds = userList.map((n) => n.id);
//   //       setSelected(newSelecteds);
//   //       return;
//   //     }
//   //     setSelected([]);
//   //   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handlePreview = (row) => {
//     setView(true);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

//   //   const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

//   const isUserNotFound = filteredUsers.length === 0;

//   const title = 'Project Creation';
//   return (
//     <Page title={title}>
//       <Container maxWidth={themestretch ? false : 'lg'}>
//         <HeaderBreadcrumbs
//           heading={title}
//           links={[
//             { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
//             { name: 'Project Details' }
//             // { name: 'List' }
//           ]}
//           action={
//             <>
//               <Button
//                 varient="contained"
//                 component={RouterLink}
//                 to={PATH_DASHBOARD.task.taskCreate}
//                 startIcon={<Icon icon={plusFill} />}
//               >
//                 {' '}
//                 Create Project
//               </Button>{' '}
//             </>
//           }
//         />
//         <card>
//           <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

//           <Scrollbar>
//             <TableContainer sx={{ minWidth: 800 }}>
//               <Table>
//                 <UserListHead
//                   order={order}
//                   orderBy={orderBy}
//                   headLabel={TABLE_HEAD}
//                   //   rowCount={UserList.length}
//                   numSelected={selected.length}
//                   onRequestSort={handleRequestSort}
//                   //   onSelectAllClick={handleSelectedAllClick}
//                 />
//               </Table>
//             </TableContainer>
//           </Scrollbar>
//         </card>
//       </Container>
//     </Page>
//   );
// }
