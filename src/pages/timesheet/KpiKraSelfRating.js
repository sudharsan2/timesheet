import React from 'react';
import {
  Container,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Box,
  TextField,
  Chip,
  TableFooter
} from '@mui/material';
import { format } from 'date-fns';
import DatePicker from '@mui/lab/DatePicker';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useDispatch, useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import {
  getKpiKraForTheMonthAsync,
  getKpiKraSelfRatingList,
  getKpiKraSelfRating,
  setSelfrating,
  submitKpiKraSelfRatingActionAsync,
  getIsLoadingFromKpi
} from '../../redux/slices/kpiKraSlice';
import { MIconButton } from '../../components/@material-extend';

const TABLE_HEAD = [
  { id: 'kpi-name', label: 'KPI', alignRight: false },
  { id: 'kpi-description', label: 'Description', alignRight: false },
  { id: 'kpi-rating', label: 'Rating', alignRight: false },
  { id: 'selfrating', label: 'Self Rating', alignRight: false },
  { id: 'managerRating', label: 'Manager Rating', alignRight: false }
];

export default function KpiKraSelfRating() {
  const { themeStretch } = useSettings();
  const title = 'KPI-KRA Self Rating';
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [date, setDate] = React.useState(new Date());

  const rows = useSelector(getKpiKraSelfRatingList);
  const details = useSelector(getKpiKraSelfRating);
  const isLoading = useSelector(getIsLoadingFromKpi);

  const sumKpi = rows.length === 0 ? 0 : rows.map((o) => o.rating).reduce((a, c) => Number(a) + Number(c));
  const sumKpiUser = rows.length === 0 ? 0 : rows.map((o) => o.selfrating).reduce((a, c) => Number(a) + Number(c));
  const sumKpiManager =
    rows.length === 0 ? 0 : rows.map((o) => o.managerRating).reduce((a, c) => Number(a) + Number(c));

  const handleChange = (newValue) => {
    setDate(newValue);
    const formatteDate = format(newValue, 'MM/yyyy');
    dispatch(getKpiKraForTheMonthAsync(formatteDate));
  };

  const handleSelfRatingChange = (row, e) => {
    const payload = {
      row,
      value: e.target.value
    };
    dispatch(setSelfrating(payload));
  };

  const handleSubmit = (state) => {
    const formatteDate = format(date, 'MM/yyyy');
    const payload = {
      state,
      formatteDate
    };
    dispatch(submitKpiKraSelfRatingActionAsync(payload));

    if (state === 'save') {
      enqueueSnackbar('Saved successfully', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } else {
      enqueueSnackbar('Submitted successfully', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
  };

  React.useEffect(() => {
    const formatteDate = format(date, 'MM/yyyy');
    dispatch(getKpiKraForTheMonthAsync(formatteDate));
  }, [date, dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'KPI-KRA Self Rating' }]}
        />
        <Card>
          <Box m={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <DatePicker
                views={['month', 'year']}
                label="Month and Year"
                value={date}
                onChange={(newValue) => handleChange(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              {isLoading ? null : (
                <Chip
                  label={details.status}
                  color={details.status === 'SUBMITTED' || details.status === 'APPROVED' ? 'success' : 'primary'}
                />
              )}
            </Stack>
          </Box>
          <CardContent>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow style={{ whiteSpace: 'nowrap' }}>
                      {TABLE_HEAD.map((headCell) => (
                        <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
                          {headCell.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => {
                      const { kpi, description, rating, selfrating, managerRating } = row;

                      return (
                        <TableRow hover key={i} tabIndex={-1}>
                          <TableCell align="left">{kpi}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="right">{rating}</TableCell>
                          <TableCell align="right">
                            {details.status === 'SUBMITTED' || details.status === 'APPROVED' ? (
                              <>{selfrating}</>
                            ) : (
                              <FormControl fullWidth>
                                <Select
                                  displayEmpty
                                  size="small"
                                  value={selfrating}
                                  onChange={(e) => handleSelfRatingChange(row, e)}
                                >
                                  <MenuItem value="0">
                                    <em>None</em>
                                  </MenuItem>
                                  {[...Array.from({ length: +rating }, (_, i) => i + 1)].map((_x, i) => (
                                    <MenuItem key={i} value={_x}>
                                      {_x}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </TableCell>
                          <TableCell align="right">{managerRating || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={1} />
                      <TableCell align="center">Total </TableCell>
                      <TableCell align="right">{sumKpi}</TableCell>
                      <TableCell align="right">{sumKpiUser}</TableCell>
                      <TableCell align="right">{sumKpiManager}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={1} />
                      <TableCell align="center">KPI - (100/10) </TableCell>
                      <TableCell align="right">{sumKpi / 10}</TableCell>
                      <TableCell align="right">{sumKpiUser / 10}</TableCell>
                      <TableCell align="right">{sumKpiManager / 10}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Scrollbar>
          </CardContent>
          <CardActions disableSpacing>
            <Stack
              style={{ width: '100em' }}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
              component={Paper}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => handleSubmit('save')}
                disabled={details.status === 'SUBMITTED' || details.status === 'APPROVED' || isLoading}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleSubmit('submit')}
                disabled={details.status === 'SUBMITTED' || details.status === 'APPROVED' || isLoading}
              >
                Submit
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
}
