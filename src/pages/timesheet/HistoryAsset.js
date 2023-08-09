import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-outline';
import { Link as RouterLink } from 'react-router-dom';
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
import { useDispatch, useSelector } from '../../redux/store';
import { getUserRaiseIssueDetailsAsync } from '../../redux/slices/assetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import UserAssetMoreMenu from '../../components/_administrator/list/UserAssetMoreMenu';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'asset_id', label: 'ASSET ID', alignRight: false, margin: '' },
  { id: 'empName', label: 'Employee Name', alignRight: false, margin: '' },
  { id: 'empId', label: 'Emp Id', alignRight: false, margin: '' },
  { id: 'submittedOn', label: 'Date', alignRight: false, margin: '' },
  { id: 'reason', label: 'Reason', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false }
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
    return filter(array, (_user) => _user.asset_category.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { users: userList } = useSelector((state) => state.asset);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('asset_id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getUserRaiseIssueDetailsAsync());
  }, [dispatch]);

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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleBulkApproval = () => {
    const payload = [...selected];
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Asset Management';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Asset details', href: PATH_DASHBOARD.timesheet.userDetails },
            { name: 'List' }
          ]}
          action={
            <>
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.timesheet.applyIssue}
                startIcon={<Icon icon={plusFill} />}
              >
                Apply Issue
              </Button>{' '} */}
              {/* <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.admin.assetCreate}
                  startIcon={<Icon icon={plusFill} />}
                >
                  New Asset
                </Button>{' '} */}
            </>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filter}
            onFilterName={handleFilterByName}
            handleBulkApproval={handleBulkApproval}
            // handleDelete={handleClearFilter}
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row12) => {
                    const { asset_id: assetId, empName, empId, submittedOn, reason, description, status } = row12;
                    const isItemSelected = selected.indexOf(assetId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={assetId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, assetId)} />
                        </TableCell> */}
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={employeeName} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {assetId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {/* <TableCell align="left">{userId}</TableCell> */}
                        <TableCell align="left">{empName}</TableCell>
                        <TableCell align="left">{empId}</TableCell>
                        <TableCell align="left">{submittedOn}</TableCell>
                        {/* <TableCell align="left">{status}</TableCell> */}
                        <TableCell align="left">{reason}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{status}</TableCell>

                        {/* <TableCell align="right">
                          <UserAssetMoreMenu empId={assetId} />
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
