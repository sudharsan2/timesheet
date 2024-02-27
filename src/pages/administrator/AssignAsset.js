import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-outline';
import { Link as RouterLink } from 'react-router-dom';
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
import AssetMoreMenu from '../../components/_administrator/list/AssetMoreMenu';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// import { getListOfAssetsAsync } from '../../redux/slices/assetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'asset_id', label: 'ASSET_ID', alignRight: false, margin: '' },
  { id: 'user_id', label: 'USER_ID', alignRight: false, margin: '' },
  //   { id: 'asset_category', label: 'ASSET_CATEGORY', alignRight: false, margin: '' },
  //   { id: 'make', label: 'MAKE_NAME', alignRight: false, width: 200 },
  //   { id: 'model', label: 'MODEL_NAME', alignRight: false },
  //   { id: 'asset_serial_no', label: 'ASSET_SERIAL_NO', alignRight: false },
  //   { id: 'battery_serial_no', label: 'BATTERY_SERIAL_NO', alignRight: false },
  //   { id: 'product_id', label: 'PRODUCT_ID', alignRight: false },
  //   { id: 'os_version', label: 'OS_VERSION', alignRight: false },
  //   { id: 'os_key', label: 'OS_KEY', alignRight: false },
  //   { id: 'os_type', label: 'OS_TYPE', alignRight: false },
  //   { id: 'ram', label: 'RAM_SIZE', alignRight: false },
  //   { id: 'display_size', label: 'DISPLAY_SIZE', alignRight: false },
  //   { id: 'storage', label: 'STORAGE', alignRight: false },
  //   { id: 'problem', label: 'PROBLEM', alignRight: false },
  //   { id: 'conditions', label: 'CONDITIONS', alignRight: false },
  //   { id: 'value_of_asset', label: 'VALUE_OF_ASSET', alignRight: false },
  { id: 'start_date', label: 'START_DATE', alignRight: false },
  { id: 'end_date', label: 'END_DATE', alignRight: false }
  //   { id: 'remarks', label: 'REMARKS', alignRight: false }
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

  //   useEffect(() => {
  //     dispatch(getListOfAssetsAsync());
  //   }, [dispatch]);

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

  // const handleMultipleDelete = () => {
  //   dispatch(multipleUserDeleteActionAsync({ ids: selected }));
  //   setPage(0);
  //   setSelected([]);
  // };

  // const handleMultipleActive = () => {
  //   dispatch(multipleUserActiveActionAsync({ ids: selected }));
  //   setPage(0);
  //   setSelected([]);
  // };

  // const handleMultipleInActive = () => {
  //   dispatch(multipleUserInActiveActionAsync({ ids: selected }));
  //   setPage(0);
  //   setSelected([]);
  // };

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
            { name: 'Asset Management', href: PATH_DASHBOARD.admin.createAsset },
            { name: 'List' }
          ]}
          action={
            <>
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.admin.assetDetails}
                startIcon={<Icon icon={plusFill} />}
              >
                Asset ID Details
              </Button>{' '} */}
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.admin.createUserAsset}
                startIcon={<Icon icon={plusFill} />}
              >
                Assign Asset
              </Button>{' '} */}
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.admin.assetCreate}
                startIcon={<Icon icon={plusFill} />}
              >
                Assign User
              </Button>{' '} */}
            </>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // onDelete={handleMultipleDelete}
            // onInactive={handleMultipleActive}
            // onActive={handleMultipleInActive}
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
                    const {
                      asset_id: assetId,
                      user_id: userId,
                      //   asset_category: assetCategory,
                      //   make,
                      //   model,
                      //   asset_serial_no: assetSerialNo,
                      //   battery_serial_no: batterySerialNo,
                      //   product_id: productId,
                      //   os_version: osVersion,
                      //   os_key: osKey,
                      //   os_type: osType,
                      //   ram,
                      //   display_size: displaySize,
                      //   storage,
                      //   problem,
                      //   conditions,
                      //   value_of_asset: valueOfAsset,
                      start_date: startDate,
                      end_date: endDate
                      //   remarks
                    } = row12;
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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell> */}
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={employeeName} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {assetId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{userId}</TableCell>
                        {/* <TableCell align="left">{assetCategory}</TableCell>
                        <TableCell align="left">{make}</TableCell>
                        <TableCell align="left">{model}</TableCell>
                        <TableCell align="left">{assetSerialNo}</TableCell>
                        <TableCell align="left">{batterySerialNo}</TableCell>
                        <TableCell align="left">{productId}</TableCell>
                        <TableCell align="left">{osVersion}</TableCell>
                        <TableCell align="left">{osKey}</TableCell>
                        <TableCell align="left">{osType}</TableCell>
                        <TableCell align="left">{ram}</TableCell>
                        <TableCell align="left">{displaySize}</TableCell>
                        <TableCell align="center">{storage}</TableCell>
                        <TableCell align="left">{problem}</TableCell>
                        <TableCell align="left">{conditions}</TableCell>
                        <TableCell align="left">{valueOfAsset}</TableCell> */}
                        <TableCell align="left">{startDate}</TableCell>
                        <TableCell align="center">{endDate}</TableCell>
                        {/* <TableCell align="left">{remarks}</TableCell> */}

                        {/* <TableCell align="right">
                          <AssetMoreMenu assetCategory={assetId} />
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
