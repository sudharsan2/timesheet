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
import MasterMoreMenu from '../../components/_administrator/list/MasterMoreMenu';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import { getListOfMasterScreenDetailsAsync } from '../../redux/slices/masterSlice';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'master_id', label: 'Id', alignRight: false, margin: '' },
  { id: 'crm_representative', label: 'CRM Representative', alignRight: false, margin: '' },
  { id: 'classification', label: 'CLASSIFICATION', alignRight: false, margin: '' },
  { id: 'country', label: 'COUNTRY', alignRight: false, margin: '' },
  { id: 'state', label: 'STATE', alignRight: false, margin: '' },
  { id: 'city', label: 'CITY', alignRight: false, margin: '' },
  { id: 'company_name', label: 'COMPANY NAME', alignRight: false, margin: '' },
  { id: 'business_vertical', label: 'BUSINESS_VERTICAL', alignRight: false, margin: '' },
  { id: 'contact_persion_name', label: 'CONTACT_PERSON_NAME', alignRight: false, width: 200 },
  { id: 'email', label: 'EMAIL_ID', alignRight: false },
  { id: 'alternative_email', label: 'ALTERNATIVE_EMAIL_ID', alignRight: false },
  { id: 'country_code', label: 'COUNTRY_CODE', alignRight: false },
  { id: 'phone_number', label: 'PHONE_NUMBER', alignRight: false },
  // { id: 'country_code_1', label: 'ALT_COUNTRY_CODE', alignRight: false },
  { id: 'alternative_phone_number', label: 'ALTERNATIVE_PHONE_NUMBER', alignRight: false }
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
    return filter(array, (_user) => _user.company_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MasterManager() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { masters: userList } = useSelector((state) => state.master);
  console.log('aefh', userList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('classification');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getListOfMasterScreenDetailsAsync());
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'Customer Master';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Master', href: PATH_DASHBOARD.crm.Master },
            { name: 'New Entry', href: PATH_DASHBOARD.crm.MasterNewentry }
          ]}
          action={
            <>
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.crm.MasterNewentry}
                startIcon={<Icon icon={plusFill} />}
              >
                New entry
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row7) => {
                    const {
                      master_id: MasterId,
                      crm_representative: crmRepresentative,
                      classification,
                      country,
                      state,
                      city,
                      company_name: companyName,
                      business_vertical: businessVertical,
                      contact_persion_name: contactPersonName,
                      email,
                      alternative_email: alternativeEmail,
                      country_code: countryCode,
                      phone_number: phoneNumber,
                      // country_code_1: countryCode1,
                      alternative_phone_number: alternativePhoneNumber
                    } = row7;
                    const isItemSelected = selected.indexOf(classification) !== -1;

                    return (
                      <TableRow
                        hover
                        key={MasterId}
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
                              {MasterId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{crmRepresentative}</TableCell>
                        <TableCell align="left">{classification}</TableCell>
                        <TableCell align="left">{country}</TableCell>
                        <TableCell align="left">{state}</TableCell>
                        <TableCell align="left">{city}</TableCell>
                        <TableCell align="left">{companyName}</TableCell>
                        <TableCell align="left">{businessVertical}</TableCell>
                        <TableCell align="left">{contactPersonName}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{alternativeEmail}</TableCell>
                        <TableCell align="left">+{countryCode}</TableCell>
                        <TableCell align="left">{phoneNumber}</TableCell>
                        {/* <TableCell align="left">+{countryCode1}</TableCell> */}
                        <TableCell align="left">{alternativePhoneNumber}</TableCell>

                        {/* <TableCell align="right">
                          <MasterMoreMenu MasterId={MasterId} />
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
