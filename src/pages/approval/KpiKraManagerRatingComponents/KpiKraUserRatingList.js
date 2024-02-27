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
import { Icon } from '@iconify/react';
import DatePicker from '@mui/lab/DatePicker';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  getkpiKraManagerRating,
  setManagerRating,
  getIsLoadingFromKpi,
  submitKpiKraManagerRatingActionAsync
} from '../../../redux/slices/kpiKraSlice';
import { MIconButton } from '../../../components/@material-extend';

const TABLE_HEAD = [
  { id: 'kpi-name', label: 'KPI', alignRight: false },
  { id: 'kpi-description', label: 'Description', alignRight: false },
  { id: 'kpi-rating', label: 'Rating', alignRight: false },
  { id: 'selfrating', label: 'Self Rating', alignRight: false },
  { id: 'managerRating', label: 'Manager Rating', alignRight: false }
];

export default function KpiKraUserRatingList() {
  const { themeStretch } = useSettings();
  const title = 'KPI-KRA Manager Rating';
  const kpiKraInDetail = useSelector(getkpiKraManagerRating);
  const isLoading = useSelector(getIsLoadingFromKpi);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const rows = kpiKraInDetail.kpiList;
  const dispatch = useDispatch();

  const sumKpi = rows.length === 0 ? 0 : rows.map((o) => o.rating).reduce((a, c) => Number(a) + Number(c));
  const sumKpiUser = rows.length === 0 ? 0 : rows.map((o) => o.selfrating).reduce((a, c) => Number(a) + Number(c));
  const sumKpiManager =
    rows.length === 0 ? 0 : rows.map((o) => o.managerRating).reduce((a, c) => Number(a) + Number(c));

  const handleChange = (row, event) => {
    const payload = {
      row,
      value: event.target.value
    };
    dispatch(setManagerRating(payload));
  };

  const handleSubmit = () => {
    dispatch(submitKpiKraManagerRatingActionAsync('approve')).then(() => {
      enqueueSnackbar('Updated the rating', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      navigate(PATH_DASHBOARD.timesheet.kpiKraManagerRating);
    });
  };

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'KPI-KRA Manager Rating', href: PATH_DASHBOARD.timesheet.kpiKraManagerRating },
            { name: 'Kpi-kra' }
          ]}
        />
        <Card>
          <Box m={2} p={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
              <DatePicker
                views={['year', 'month']}
                label="Year and Month"
                value={kpiKraInDetail.date}
                disabled
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
              <TextField
                id="outlined-basic"
                label="EmployeeId"
                variant="outlined"
                disabled
                value={kpiKraInDetail.employeeId}
                onChange={(e) => e.preventDefault()}
              />
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                disabled
                value={kpiKraInDetail.username}
                onChange={(e) => e.preventDefault()}
              />
              <TextField
                id="outlined-basic"
                label="Designation"
                variant="outlined"
                disabled
                value={kpiKraInDetail.designation}
                onChange={(e) => e.preventDefault()}
              />
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
                          <TableCell align="right">{selfrating}</TableCell>
                          <TableCell align="right">
                            <FormControl fullWidth>
                              <Select
                                displayEmpty
                                size="small"
                                value={managerRating}
                                onChange={(e) => handleChange(row, e)}
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
                          </TableCell>
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
              {kpiKraInDetail.status === 'APPROVED' ? (
                <Chip label="Already approved" color="success" />
              ) : (
                <Button size="small" variant="contained" onClick={handleSubmit} disabled={isLoading}>
                  Submit
                </Button>
              )}
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
}
