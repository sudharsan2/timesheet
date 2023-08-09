/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
import axios from 'axios';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import DatePicker from 'react-multi-date-picker';
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
  FormControl,
  Grid,
  TextField
} from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import LeadMoreMenu from '../../components/_administrator/list/LeadMoreMenu';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import History from './History';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'company_name', label: 'COMPANY NAME', alignRight: false, margin: '' },
  { id: 'crm_representative', label: 'CRM REPRESENTATIVE', alignRight: false, margin: '' },
  { id: 'client_designation', label: 'CLIENT DESIGNATION', alignRight: false, margin: '' },
  { id: 'location', label: 'CLIENT LOCATION', alignRight: false, margin: '' },
  { id: 'level', label: 'LEVEL', alignRight: false, margin: '' },
  { id: 'projectname', label: 'PROJECT_NAME', alignRight: false, width: 200 },
  { id: 'additional_details', label: 'ADDITIONAL_DETAILS', alignRight: false },
  { id: 'email', label: 'CLIENT_EMAIL', alignRight: false, margin: '' },
  { id: 'contact_person_name', label: 'CONTACT_PERSON_NAME', alignRight: false },
  { id: 'contact', label: 'CONTACT_PERSON_NUMBER', alignRight: false },
  { id: 'internal_division', label: 'INTERNAL_DIVISION', alignRight: false },
  { id: 'project_approximate_value', label: 'PROJECT_APROXIMATE_VALUE', alignRight: false },
  { id: 'currency', label: 'CURRENCY', alignRight: false },
  { id: 'lead_source', label: 'LEAD SOURCE', alignRight: false, margin: '' },
  { id: 'lead_qualified', label: 'LEAD QUALIFIED', alignRight: false, margin: '' },
  { id: 'lead_mined_by', label: 'LEAD MINEDBY', alignRight: false, margin: '' },
  { id: 'priority', label: 'PRIORITY', alignRight: false },
  { id: 'next_action', label: 'NEXT_ACTION', alignRight: false },
  { id: 'responsibility', label: 'RESPONSIBILITY', alignRight: false },
  { id: 'status', label: 'STATUS', alignRight: false },
  { id: 'final_completion_date', label: 'FINAL_COMPLETION_DATE', alignRight: false }
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

export default function FollowUpManager() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userList = useState('');
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [isViewOpen, setView] = useState(false);
  const [orderBy, setOrderBy] = useState('classification');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newArr, setNewArr] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const token = localStorage.getItem('accessToken');

  const startChange = (event) => {
    setStartDate(event.target.value);
    console.log('startDate', event.target.value);
    // localStorage.setItem('follow_up_date', event.target.value);
    axios
      .post(
        'https://secure.focusrtech.com:5050/techstep/api/CrmLead/Service/getAllFollowUpNotification',
        {
          // follow_up_date: localStorage.getItem('select')w
          follow_up_date: String(event.target.value)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prefer-template
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('response data new post', res.data);
        setNewArr(res.data);
        console.log('first');
      })
      .catch((err) => {
        console.log('error new post', err);
      });
  };

  useEffect(() => {
    localStorage.removeItem('follow_up_date');
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const d = `${year}-${month}-${day}`;
    console.log('d', d);
    setStartDate(String(d));
    axios
      .post(
        'https://secure.focusrtech.com:5050/techstep/api/CrmLead/Service/getAllFollowUpNotification',
        {
          follow_up_date: String(d)
          //   follow_up_date: '2023-05-19'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prefer-template
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('response data new post', res.data);
        setNewArr(res.data);
        console.log('first');
      })
      .catch((err) => {
        console.log('error new post', err);
      });
  }, []);

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const title = 'FollowUp Notifications';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'FollowUp', href: PATH_DASHBOARD }
          ]}
          action={
            <>
              <Grid>
                <Typography sx={{ marginLeft: '-25%', color: '	#000000' }}>
                  <b> Select Date</b>
                </Typography>
                <TextField
                  sx={{ marginLeft: '-30%', marginBottom: '10', width: '90%' }}
                  size="small"
                  type="date"
                  name="Select date"
                  value={startDate}
                  onChange={startChange}
                />
              </Grid>
            </>
          }
        />

        <Card>
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
                  {newArr.map((x, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{x.company_name}</TableCell>
                        <TableCell>{x.crm_representative}</TableCell>
                        <TableCell>{x.client_designation}</TableCell>
                        <TableCell>{x.location}</TableCell>
                        <TableCell>{x.level}</TableCell>
                        <TableCell>{x.projectname}</TableCell>
                        <TableCell>{x.additional_details}</TableCell>
                        <TableCell>{x.email}</TableCell>
                        <TableCell>{x.contact_person_name}</TableCell>
                        <TableCell>{x.contact}</TableCell>
                        <TableCell>{x.internal_division}</TableCell>
                        <TableCell>{x.project_approximate_value}</TableCell>
                        <TableCell>{x.currency}</TableCell>
                        <TableCell>{x.lead_source}</TableCell>
                        <TableCell>{x.lead_qualified}</TableCell>
                        <TableCell>{x.lead_mined_by}</TableCell>
                        <TableCell>{x.priority}</TableCell>
                        <TableCell>{x.next_action}</TableCell>
                        <TableCell>{x.responsibility}</TableCell>
                        <TableCell>{x.status}</TableCell>
                        <TableCell>
                          {x.final_completion_date === null ? '' : String(x.final_completion_date).slice(0, 10)}
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
      <History isViewOpen={isViewOpen} setView={setView} />
    </Page>
  );
}
