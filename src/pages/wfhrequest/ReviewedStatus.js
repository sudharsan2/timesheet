import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format, isWeekend } from 'date-fns';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import {
  getApprovalListFromWfh,
  getWfhListApprovalAsync,
  getWfhTaskDeetailsAsync,
  getIsLoadingFromWfhApproval
} from '../../redux/slices/wfhApprovalSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';

import { MIconButton } from '../../components/@material-extend';

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

  if (typeof query === 'string') {
    return array.filter((_user) => _user.emp_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'empno',
    numeric: false,
    disablePadding: false,
    label: 'Emp No'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  },

  {
    id: 'taskdate',
    numeric: false,
    disablePadding: false,
    label: 'Task Date'
  },

  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Review'
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all list'
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const filterOptions = ['Reviewed', 'DRAFT']; // Define filter options
export default function ReviewedStatus() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { themeStretch } = useSettings();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [selectedFilter, setSelectedFilter] = useState(''); // State to manage selected filter
  const rows = useSelector(getApprovalListFromWfh);
  const isLoading = useSelector(getIsLoadingFromWfhApproval);
  const title = 'Approval List';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWeekendDay = (dateString) => {
    const date = new Date(dateString);
    return isWeekend(date);
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
  const filteredRows = filteredByStatus(rows, selectedFilter);
  const filteredAndSearchedRows = filteredBySearch(filteredRows, searchQuery);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n) => n.id);
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
    setSearchQuery(event.target.value);
  };

  // const handleFilterByName = (event) => {
  //   // setFilterName(event.target.value);
  //   setPage(0);
  //   dispatch(setFilterAppr(event.target.value));
  // };

  // const handleClearFilter = () => {
  //   setPage(0);
  //   dispatch(setFilterAppr(''));
  // };

  const handleEdit = async (row) => {
    await dispatch(getWfhTaskDeetailsAsync(row))
      .then(() => {
        enqueueSnackbar('Showing Task Details', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        navigate(PATH_DASHBOARD.travel.taskApproval);
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredUsers = applySortFilter(rows, getComparator(order, orderBy), searchQuery);

  useEffect(() => {
    dispatch(getWfhListApprovalAsync());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Approval List' }]}
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

        <Scrollbar>
          {isLoading && <LinearProgress />}
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {filteredAndSearchedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    // key={item.id}
                    style={{ backgroundColor: isWeekendDay(row.date) ? '#919EAB' : 'transparent' }}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, row.id)}
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell> */}
                    <TableCell align="center">{row.userId}</TableCell>
                    <TableCell align="center">{row.emp_name}</TableCell>

                    <TableCell align="center">{row.taskdate.substr(0, 10)}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleEdit(row)}> Review</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Scrollbar>
      </Container>
    </Page>
  );
}
