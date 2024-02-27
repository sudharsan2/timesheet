// /* eslint-disable no-useless-rename */
// /* eslint-disable react/jsx-key */
// import { filter } from 'lodash';
// import {
//   Container,
//   Typography,
//   Stack,
//   Button,
//   Card,
//   TableContainer,
//   Table,
//   TablePagination,
//   TableBody,
//   TableRow,
//   TableCell,
//   Toolbar,
//   TextField
// } from '@mui/material';
// import { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import plusFill from '@iconify/icons-eva/plus-fill';
// import { format } from 'date-fns';
// import calendarOutline from '@iconify/icons-eva/calendar-outline';
// import { Icon } from '@iconify/react';
// import { getListOfTravelDetailsByOwnerAsync, getDetailsofwfhAsync } from '../../redux/slices/projSlice';
// import { getWorkFromHomeRequestApproveAsync } from '../../redux/slices/WfhSlice';
// import { PATH_DASHBOARD } from '../../routes/paths';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import Page from '../../components/Page';
// import useSettings from '../../hooks/useSettings';
// import { useDispatch, useSelector } from '../../redux/store';
// import Scrollbar from '../../components/Scrollbar';
// import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
// import SearchNotFound from '../../components/SearchNotFound';
// import WfhRequestMenu from '../../components/_administrator/list/WfhRequestMenu';

// const TABLE_HEAD = [
//   // { id: 'id', label: 'EMPID', alignRight: false, margin: '' },
//   { id: 'name', label: 'Name', alignRight: false, margin: '' },
//   { id: 'reason', label: 'Reason', alignRight: false, margin: '' },
//   { id: 'fromdate', label: 'From date', alignRight: false, margin: '' },
//   { id: 'todate', label: 'To date', alignRight: false, margin: '' },
//   { id: 'numberOfDays', label: 'No days', alignRight: false, margin: '' },
//   { id: 'action', label: 'Action', alignRight: false, margin: '' }
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
//   if (!Array.isArray(array)) {
//     return []; // Return an empty array if 'array' is not an array
//   }

//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   if (query) {
//     return array.filter((_user) => _user.reason.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }

//   return stabilizedThis.map((el) => el[0]);
// }

// export default function RequestApproval() {
//   const { themestretch } = useSettings();
//   const [selected, setSelected] = useState([]);
//   const dispatch = useDispatch();
//   const [page, setPage] = useState(0);
//   const [order, setOrder] = useState('asc');
//   const { wfhRequestApprove: userList } = useSelector((state) => state.wfh);
//   const [orderBy, setOrderBy] = useState('reason');
//   const [searchQuery, setSearchQuery] = useState(''); // New state for search query

//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [filterName, setFilterName] = useState('');

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value); // Update search query state
//     setPage(0); // Reset page when searching
//   };
//   const handleFilterByName = (event) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = userList.map((n) => n.reason);
//       setSelected(newSelecteds);
//     } else {
//       setSelected([]);
//     }
//   };

//   // const handleClick = (event, name) => {
//   //   const selectedIndex = selected.indexOf(name);
//   //   let newSelected = [];
//   //   if (selectedIndex === -1) {
//   //     newSelected = newSelected.concat(selected, name);
//   //   } else if (selectedIndex === 0) {
//   //     newSelected = newSelected.concat(selected.slice(1));
//   //   } else if (selectedIndex === selected.length - 1) {
//   //     newSelected = newSelected.concat(selected.slice(0, -1));
//   //   } else if (selectedIndex > 0) {
//   //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
//   //   }
//   //   setSelected(newSelected);
//   // };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   useEffect(() => {
//     dispatch(getWorkFromHomeRequestApproveAsync());
//   }, [dispatch]);

//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

//   const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), searchQuery);

//   const isUserNotFound = filteredUsers.length === 0;

//   const title = 'WFH Request';
//   return (
//     <Page title={title}>
//       <Container maxWidth={themestretch ? false : 'lg'}>
//         <HeaderBreadcrumbs
//           heading={title}
//           links={[
//             { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
//             { name: 'Details' }
//             // { name: 'List' }
//           ]}
//           action={
//             <>
//               <Button
//                 variant="contained"
//                 component={RouterLink}
//                 to={PATH_DASHBOARD.travel.reqForm}
//                 startIcon={<Icon icon={plusFill} />}
//               >
//                 Request Form
//               </Button>{' '}
//               {/* <Button
//                 variant="contained"
//                 component={RouterLink}
//                 to={PATH_DASHBOARD.project.uploadPaysquare}
//                 startIcon={<Icon icon={calendarOutline} />}
//               >
//                 Upload File
//               </Button>{' '} */}
//             </>
//           }
//         />
//         <Toolbar>
//           {/* Search field */}
//           <TextField label="Search" size="small" variant="outlined" value={searchQuery} onChange={handleSearch} />
//         </Toolbar>
//         <Card>
//           {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

//           <Scrollbar>
//             <TableContainer sx={{ minWidth: 800 }}>
//               <Table>
//                 <UserListHead
//                   order={order}
//                   orderBy={orderBy}
//                   headLabel={TABLE_HEAD}
//                   rowCount={userList.length}
//                   numSelected={selected.length}
//                   onRequestSort={handleRequestSort}
//                   onSelectAllClick={handleSelectAllClick}
//                 />
//                 <TableBody>
//                   {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
//                     const {
//                       id: id,
//                       emp_name: empName,
//                       userId: EMPID,
//                       reason: reason,
//                       fromdate: fromdate,
//                       todate: todate,
//                       numberOfDays: numberOfDays
//                     } = row;
//                     const isItemSelected = selected.indexOf(id) !== -1;
//                     return (
//                       <TableRow
//                         hover
//                         key={EMPID}
//                         tabIndex={-1}
//                         role="checkbox"
//                         selected={isItemSelected}
//                         aria-checked={isItemSelected}
//                       >
//                         {/* <TableCell component="th" scope="row" padding="none">
//                           <Stack direction="row" alignItems="center" spacing={2}>
//                             <Typography variant="subtitle2" noWrap>
//                               {EMPID}
//                             </Typography>
//                           </Stack>
//                         </TableCell> */}
//                         <TableCell component="th" scope="row" padding="none">
//                           <Stack direction="row" alignItems="center" spacing={2}>
//                             <Typography variant="subtitle2" noWrap>
//                               {empName}
//                             </Typography>
//                           </Stack>
//                         </TableCell>
//                         <TableCell component="th" scope="row" padding="none">
//                           <Stack direction="row" alignItems="center" spacing={2}>
//                             <Typography variant="subtitle2" noWrap>
//                               {reason}
//                             </Typography>
//                           </Stack>
//                         </TableCell>
//                         <TableCell align="left">{String(fromdate).slice(0, 10)}</TableCell>
//                         <TableCell align="left">{String(todate).slice(0, 10)}</TableCell>
//                         <TableCell align="left">{numberOfDays} </TableCell>
//                         <TableCell align="left">
//                           <WfhRequestMenu id={id} />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                   {emptyRows > 0 && (
//                     <TableRow style={{ height: 53 * emptyRows }}>
//                       <TableCell colSpan={6} />
//                     </TableRow>
//                   )}
//                 </TableBody>

//                 {isUserNotFound && (
//                   <TableBody>
//                     <TableRow>
//                       <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
//                         <SearchNotFound searchQuery={filterName} />
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 )}
//               </Table>
//             </TableContainer>
//           </Scrollbar>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={userList.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Card>
//       </Container>
//     </Page>
//   );
// }

/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-rename */
/* eslint-disable react/jsx-key */
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
  Toolbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { format } from 'date-fns';
import calendarOutline from '@iconify/icons-eva/calendar-outline';
import { Icon } from '@iconify/react';
import { getWorkFromHomeRequestApproveAsync } from '../../redux/slices/WfhSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import Scrollbar from '../../components/Scrollbar';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import SearchNotFound from '../../components/SearchNotFound';

const TABLE_HEAD = [
  // { id: 'id', label: 'ID', alignRight: false, margin: '' },
  { id: 'name', label: 'Name', alignRight: false, margin: '' },
  { id: 'reason', label: 'Reason', alignRight: false, margin: '' },
  { id: 'fromdate', label: 'From date', alignRight: false, margin: '' },
  { id: 'todate', label: 'To date', alignRight: false, margin: '' },
  { id: 'numberOfDays', label: 'No days', alignRight: false, margin: '' },
  { id: 'status', label: 'Status', alignRight: false, margin: '' }
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
  if (!Array.isArray(array)) {
    return []; // Return an empty array if 'array' is not an array
  }

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return array.filter((_user) => _user.numberOfDays.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}
const filterOptions = ['Submitted', 'Approved', 'Rejected']; // Define filter options
export default function RequestApproval() {
  const { themestretch } = useSettings();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const { wfhRequestApprove: userList } = useSelector((state) => state.wfh);
  const [orderBy, setOrderBy] = useState('fromdate');
  const [isViewOpen, setView] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [selectedFilter, setSelectedFilter] = useState(''); // State to manage selected filter
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(0); // Reset page when searching
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value); // Update selected filter
    setPage(0); // Reset page when filter changes
  };

  // Filter data based on selected filter
  const filteredByStatus = (data, filter) => {
    if (!filter) {
      return data; // If no filter selected, return all data
    }
    return data.filter((row) => row.status.toLowerCase() === filter.toLowerCase());
  };

  const filteredBySearch = (data, query) => {
    if (!query) {
      return data; // If no search query, return all data
    }
    return data.filter((_user) => _user.emp_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  };

  // Apply both filters to the data
  const filteredRows = filteredByStatus(userList, selectedFilter);
  const filteredAndSearchedRows = filteredBySearch(filteredRows, searchQuery);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.reason);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
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

  const handleEditRequest = (id) => {
    navigate(`${PATH_DASHBOARD.travel.statusApproval}/${id}`);
  };

  useEffect(() => {
    dispatch(getWorkFromHomeRequestApproveAsync());
  }, [dispatch]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'WFH REQUEST';

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
          // action={
          //   <>
          //     <Button
          //       variant="contained"
          //       component={RouterLink}
          //       to={PATH_DASHBOARD.travel.reqForm}
          //       startIcon={<Icon icon={plusFill} />}
          //     >
          //       Request Form
          //     </Button>{' '}
          //     {/* <Button
          //     variant="contained"
          //     component={RouterLink}
          //     to={PATH_DASHBOARD.project.uploadPaysquare}
          //     startIcon={<Icon icon={calendarOutline} />}
          //   >
          //     Upload File
          //   </Button>{' '} */}
          //   </>
          // }
        />
        <Toolbar>
          {/* Search field */}
          <TextField label="Search" size="small" variant="outlined" value={searchQuery} onChange={handleSearch} />
          <FormControl variant="outlined" sx={{ ml: 2, width: '20%' }}>
            <InputLabel id="filter-select-label">Filter</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              value={selectedFilter}
              onChange={handleFilterChange}
              label="Filter"
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
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
                  {filteredAndSearchedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      id: id,
                      reason: reason,
                      fromdate: fromdate,
                      emp_name: empName,
                      todate: todate,
                      numberOfDays: numberOfDays,

                      status: status
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </Stack>
                      </TableCell> */}
                        <TableCell align="left">{empName} </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {reason}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{String(fromdate).slice(0, 10)}</TableCell>
                        <TableCell align="left">{String(todate).slice(0, 10)}</TableCell>
                        <TableCell align="left">{numberOfDays} </TableCell>

                        <TableCell align="left">
                          {status === 'approved' ? (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleEditRequest(id)}
                              // component={RouterLink}
                              // to={PATH_DASHBOARD.travel.reqEdit}
                            >
                              Approved
                            </Button>
                          ) : status === 'rejected' ? (
                            <Button variant="contained" color="error" onClick={() => handleEditRequest(id)}>
                              Rejected
                            </Button>
                          ) : status === 'submitted' ? (
                            <Button variant="contained" color="secondary" onClick={() => handleEditRequest(id)}>
                              SUBMITTED
                            </Button>
                          ) : status === 'saved' ? (
                            <Button variant="contained" color="secondary" onClick={() => handleEditRequest(id)}>
                              SAVED
                            </Button>
                          ) : null}
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
