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
import { getPendingIssueAssetAsync, approveOrRejectIssueAssetAsync } from '../../redux/slices/assetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import ApplyIssueToolbar from './ApplyIssueToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '' },
  // { id: 'asset_issue_id', label: 'Asset_Issue_Id', alignRight: false, margin: '' },
  // { id: 'asset_id', label: 'Asset_Id', alignRight: false, margin: '' },
  { id: 'empName', label: 'Employee_Name', alignRight: false, margin: '' },
  { id: 'empId', label: 'Emp_Id', alignRight: false, margin: '' },
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
    return filter(array, (_user) => _user.asset_id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  // const handleBulkApproval = () => {
  //   const payload = [...selected];
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Asset Management';

  const handleClearFilter = () => {
    setPage(0);
    dispatch('');
  };

  const handleEdit = async (row) => {
    await dispatch(getPendingIssueAssetAsync(row))
      .then(() => {
        enqueueSnackbar('Showing Task Details', {
          variant: 'submitted',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        // navigate(PATH_DASHBOARD.timesheet.approvalList);
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

  const handleMultipleOpened = () => {
    const payload = [...selected];

    dispatch(approveOrRejectIssueAssetAsync(payload.map((_x) => ({ asset_issue_id: _x, status: 'OPENED' })))).then(
      () => {
        // console.info('Submitted Issue is in process');
        enqueueSnackbar('OPENED', {
          variant: 'Submitted',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        window.location.reload(false);
      }
    );
  };

  const handleMultipleProcess = () => {
    const payload = [...selected];

    dispatch(approveOrRejectIssueAssetAsync(payload.map((_x) => ({ asset_issue_id: _x, status: 'INPROGRESS' })))).then(
      () => {
        console.info('Submitted Issue is in process');
        enqueueSnackbar('INPROGRESS', {
          variant: 'Submitted',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        window.location.reload(false);
      }
    );
  };

  const handleMultipleClosed = () => {
    const payload = [...selected];

    dispatch(approveOrRejectIssueAssetAsync(payload.map((_x) => ({ asset_issue_id: _x, status: 'CLOSED' })))).then(
      () => {
        // console.info('Submitted Issue is in process');
        enqueueSnackbar('CLOSED', {
          variant: 'Submitted',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        window.location.reload(false);
      }
    );
  };

  const handleBulkApproval = () => {
    const payload = [...selected];

    dispatch(approveOrRejectIssueAssetAsync(payload.map((_x) => ({ id: _x }))))
      .then(() => {
        console.log('approved');
        enqueueSnackbar('Approved Successfully', {
          variant: 'Submitted',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        dispatch(getPendingIssueAssetAsync());
        setSelected([]);
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

  useEffect(() => {
    dispatch(getPendingIssueAssetAsync());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Issue List', href: PATH_DASHBOARD.admin },
            { name: 'List' }
          ]}
          action={
            <>
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.timesheet.pendingIssue}
                startIcon={<Icon icon={plusFill} />}
              >
                Pending Issue
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
          <ApplyIssueToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onOpened={handleMultipleOpened}
            onProcess={handleMultipleProcess}
            onClosed={handleMultipleClosed}
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
                  handleBulkApproval={handleBulkApproval}
                  handleDelete={handleClearFilter}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row12) => {
                    const {
                      asset_issue_id: assetIssueId,
                      asset_id: assetId,
                      empName,
                      empId,
                      submittedOn,
                      reason,
                      description,
                      status
                    } = row12;
                    const isItemSelected = selected.indexOf(assetIssueId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={assetIssueId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, assetIssueId)} />
                        </TableCell>
                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}> */}
                        {/* <Avatar alt={employeeName} /> */}
                        {/* <Typography variant="subtitle2" noWrap>
                              {assetIssueId}
                            </Typography> */}
                        {/* </Stack> */}
                        {/* </TableCell> */}
                        {/* <TableCell align="left">{userId}</TableCell> */}
                        {/* <TableCell align="left">{assetIssueId}</TableCell> */}
                        {/* <TableCell align="left">{assetId}</TableCell> */}
                        <TableCell align="left">{empName}</TableCell>
                        <TableCell align="left">{empId}</TableCell>
                        <TableCell align="left">{submittedOn}</TableCell>
                        <TableCell align="left">{reason}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{status}</TableCell>
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
