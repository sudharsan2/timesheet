import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { getListOfLeadEntryDetailsAsync } from '../../redux/slices/leadSlice';
import ManagerMoreMenu from '../../components/_administrator/list/ManagerMoreMenu';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';

import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
// import { phoneNumber } from 'src/utils/mock-data/phoneNumber';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'lead_id', label: 'Id', alignRight: false, margin: '' },
  { id: 'company_name', label: 'COMPANY NAME', alignRight: false, margin: '' },
  { id: 'crm_representative', label: 'CRM Representative', alignRight: false, margin: '' },
  { id: 'client_designation', label: 'CLIENT DESIGNATION', alignRight: false, margin: '' },
  { id: 'location', label: 'CLIENT LOCATION', alignRight: false, margin: '' },
  { id: 'level', label: 'LEVEL', alignRight: false, margin: '' },
  { id: 'projectname', label: 'PROJECT_NAME', alignRight: false, width: 200 },
  { id: 'additional_details', label: 'ADDITIONAL_DETAILS', alignRight: false },
  { id: 'email', label: 'CLIENT_EMAIL', alignRight: false, margin: '' },
  { id: 'contact_person_name', label: 'CONTACT PERSON_NAME', alignRight: false },
  { id: 'contact', label: 'CONTACT PERSON_NUMBER', alignRight: false },
  { id: 'internal_division', label: 'INTERNAL DIVISION', alignRight: false },
  { id: 'project_approximate_value', label: 'PROJECT APROXIMATE_VALUE', alignRight: false },
  { id: 'currency', label: 'CURRENCY', alignRight: false },
  { id: 'lead_source', label: 'LEAD SOURCE', alignRight: false, margin: '' },
  { id: 'lead_qualified', label: 'LEAD QUALIFIED', alignRight: false, margin: '' },
  { id: 'lead_mined_by', label: 'LEAD MINEDBY', alignRight: false, margin: '' },
  { id: 'priority', label: 'PRIORITY', alignRight: false },
  { id: 'next_action', label: 'NEXT_ACTION', alignRight: false },
  { id: 'follow_up_date', label: 'FOLLOW_UP_DATE', alignRight: false, margin: '' },
  { id: 'responsibility', label: 'RESPONSIBILITY', alignRight: false },
  // { id: 'target_date', label: 'TARGET_DATE', alignRight: false },
  { id: 'status', label: 'STATUS', alignRight: false },
  { id: 'final_completion_date', label: 'FINAL COMPLETION_DATE', alignRight: false },
  { id: '', label: 'Active / InActive', alignRight: false },
  { id: 'remarks', label: 'REMARKS', alignRight: false },
  { id: 'remarks', label: 'REMARKS HISTORY', alignRight: false }
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

export default function LeadManager() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { leads: userList } = useSelector((state) => state.lead);
  console.log('aefh', userList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('classification');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getListOfLeadEntryDetailsAsync());
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

  const title = 'Lead Entry';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Lead', href: PATH_DASHBOARD.crm.LeadEntryScreen },
            { name: 'List' }
          ]}
          action={
            <>
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.crm.LeadNewentry}
                startIcon={<Icon icon={plusFill} />}
              >
                New Entry
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row18) => {
                    const {
                      lead_id: leadId,
                      company_name: companyName,
                      crm_representative: crmRepresentative,
                      client_designation: clientDesignation,
                      level,
                      projectname,
                      additional_details: additionalDetails,
                      contact_person_name: contactPersonName,
                      contact,
                      internal_division: internalDivision,
                      project_approximate_value: projectAproximatevalue,
                      currency,
                      priority,
                      next_action: nextAction,
                      responsibility,
                      location,
                      email,
                      lead_source: leadSource,
                      lead_qualified: leadQualified,
                      lead_mined_by: leadMinedBy,
                      follow_up_date: followUpDate,
                      // target_date: targetDate,
                      final_completion_date: finalCompletiondate,
                      status,
                      remarks
                    } = row18;
                    const isItemSelected = selected.indexOf(leadId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={leadId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={employeeName} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {leadId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{companyName}</TableCell>
                        <TableCell align="left">{crmRepresentative}</TableCell>
                        <TableCell align="left">{clientDesignation}</TableCell>
                        <TableCell align="left">{location}</TableCell>
                        <TableCell align="left">{level}</TableCell>
                        <TableCell align="left">{projectname}</TableCell>
                        <TableCell align="left">{additionalDetails}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{contactPersonName}</TableCell>
                        <TableCell align="left">{contact}</TableCell>
                        <TableCell align="left">{internalDivision}</TableCell>
                        <TableCell align="left">{projectAproximatevalue}</TableCell>
                        <TableCell align="left">{currency}</TableCell>
                        <TableCell align="left">{leadSource}</TableCell>
                        <TableCell align="left">{leadQualified}</TableCell>
                        <TableCell align="left">{leadMinedBy}</TableCell>
                        <TableCell align="left">{priority}</TableCell>
                        <TableCell align="center">{nextAction}</TableCell>
                        <TableCell align="left">{String(followUpDate).slice(0, 10)}</TableCell>
                        <TableCell align="left">{responsibility}</TableCell>
                        <TableCell align="left">{status}</TableCell>
                        <TableCell align="left">
                          {' '}
                          {finalCompletiondate === null ? '' : String(finalCompletiondate).slice(0, 10)}
                        </TableCell>
                        <TableCell />
                        <TableCell align="left">{remarks}</TableCell>

                        <TableCell align="right">
                          <ManagerMoreMenu leadId={leadId} />
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
