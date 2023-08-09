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
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getListOfLaptopDetailsAsync } from '../../redux/slices/assetSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/_administrator/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { laptop_details_id: 'employee_name', label: 'EMPLOYEE_NAME', alignRight: false, margin: '' },
  { laptop_details_id: 'empCode', label: 'EMP_CODE', alignRight: false },
  { laptop_details_id: 'department', label: 'DEPARTMENT', alignRight: false },
  { laptop_details_id: 'focusr_laptop', label: 'FOCUSR_LAPTOP', alignRight: false },
  { laptop_details_id: 'make', label: 'MAKE_NAME', alignRight: false },
  { laptop_details_id: 'model', label: 'MODEL_NAME', alignRight: false, marginRight: '20%' },
  { laptop_details_id: 'asset_type', label: 'ASSET_TYPE', alignRight: false },
  { laptop_details_id: 'previously_used_by', label: 'PREVIOUSLY_USED_BY', alignRight: false },
  { laptop_details_id: 'laptop_serial_no', label: 'LAPTOP_SERIAL_NO', alignRight: false },
  { laptop_details_id: 'battery_serial_no', label: 'BATTERY_SERIAL_NO', alignRight: false },
  { laptop_details_id: 'os_version', label: 'OS_VERSION', alignRight: false },
  { laptop_details_id: 'windows_product_id', label: 'WINDOWS_PRODUCT_ID', alignRight: false },
  { laptop_details_id: 'ram', label: 'RAM_SIZE', alignRight: false },
  { laptop_details_id: 'storage', label: 'STORAGE', alignRight: false },
  { laptop_details_id: 'anti_virus_enabled', label: 'ANTI_VIRUS_ENABLED', alignRight: false },
  { laptop_details_id: 'anti_virus_type', label: 'ANTI_VIRUS_TYPE', alignRight: false },
  { laptop_details_id: 'email_configuration', label: 'EMAIL_CONFIGURATION', alignRight: false },
  { laptop_details_id: 'outlook_version', label: 'OUTLOOK_VERSION', alignRight: false },
  { laptop_details_id: 'date_of_asset_receipt', label: 'DATE_OF_ASSET_RECEIPT', alignRight: false },
  { laptop_details_id: 'charger_working', label: 'CHARGER_WORKING', alignRight: false },
  { laptop_details_id: 'other_software_installed', label: 'OTHER_SOFTWARE_INSTALLED', alignRight: false }
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
    return filter(array, (_user) => _user.employee_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
  const [orderBy, setOrderBy] = useState('employee_name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getListOfLaptopDetailsAsync());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.laptop_details_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, employeeName) => {
    const selectedIndex = selected.indexOf(employeeName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, employeeName);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Laptop Details';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Users', href: PATH_DASHBOARD.admin.userAsset },
            { name: 'List' }
          ]}
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      laptopDetailsId,
                      employee_name: employeeName,
                      emp_code: empCode,
                      department,
                      focusr_laptop: focusrLaptop,
                      make,
                      model,
                      asset_type: assetType,
                      previously_used_by: previouslyUsedBy,
                      laptop_serial_no: laptopSerialNo,
                      battery_serial_no: batterySerialNo,
                      os_version: osVersion,
                      windows_product_id: windowsProductId,
                      ram,
                      storage,
                      anti_virus_enabled: antiVirusEnabled,
                      anti_virus_type: antiVirusType,
                      email_configuration: emailConfiguration,
                      outlook_version: outlookVersion,
                      date_of_asset_receipt: dateOfAssetReceipt,
                      charger_working: chargerWorking,
                      other_software_installed: otherSoftwareInstalled
                    } = row;
                    const isItemSelected = selected.indexOf(laptopDetailsId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={laptopDetailsId}
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
                              {employeeName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{empCode}</TableCell>
                        <TableCell align="left">{department}</TableCell>
                        <TableCell align="center">{focusrLaptop} </TableCell>
                        <TableCell align="left">{make}</TableCell>
                        <TableCell align="left">{model}</TableCell>
                        <TableCell align="left">{assetType}</TableCell>
                        <TableCell align="left">{previouslyUsedBy}</TableCell>
                        <TableCell align="left">{laptopSerialNo}</TableCell>
                        <TableCell align="left">{batterySerialNo}</TableCell>
                        <TableCell align="left">{osVersion}</TableCell>
                        <TableCell align="left">{windowsProductId}</TableCell>
                        <TableCell align="left">{ram}</TableCell>
                        <TableCell align="left">{storage}</TableCell>
                        <TableCell align="center">{antiVirusEnabled}</TableCell>
                        <TableCell align="left">{antiVirusType}</TableCell>
                        <TableCell align="left">{emailConfiguration}</TableCell>
                        <TableCell align="left">{outlookVersion}</TableCell>
                        <TableCell align="left">{dateOfAssetReceipt}</TableCell>
                        <TableCell align="center">{chargerWorking}</TableCell>
                        <TableCell align="left">{otherSoftwareInstalled}</TableCell>
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(isActive === 'N' && 'error') || 'success'}
                          >s
                            {isActive === 'Y' ? 'Active' : 'Inactive'}
                          </Label>
                        </TableCell> */}

                        {/* <TableCell align="right">
                          <UserMoreMenu empCode={empCode} />
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
