import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { format } from 'date-fns';
import { DatePicker, LoadingButton } from '@mui/lab';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import api from '../../services/api';
import fileSaver from '../../utils/fileSaver';
import { getAllUsersActionAsync, getAllUsersFromUser } from '../../redux/slices/userSlice';

export default function Reports() {
  const { themeStretch } = useSettings();
  const title = 'Timesheet reports';
  const [selectedReport, setReport] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [isLoading, setLoading] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState('');
  console.log('🚀 => selectedEmployee', selectedEmployee);
  const dispatch = useDispatch();
  const employees = useSelector(getAllUsersFromUser);
  const role = localStorage.getItem('role');
  const empId = localStorage.getItem('empId');

  const reportsAdmin = [
    {
      id: 1,
      report: 'Leave details for the month',
      api: '/techstep/api/Timesheet/Service/report/leave/',
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 2,
      report: 'All employee timsheet details for the month',
      api: '/techstep/api/Timesheet/Service/report/timesheet/ALL/',
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 3,
      report: 'Aggregated details of the employee',
      api: '/techstep/api/Timesheet/Service/report/aggregate/',
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 4,
      report: 'All employee detailed report',
      api: '/techstep/api/Timesheet/Service/report/detailedtimesheet/ALL/',
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 5,
      report: 'All KPI-KRA Details for the month',
      api: '/techstep/api/UsersKpiAndKra/Service/KpiReportManager/',
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 6,
      report: 'KPI - KRA Details for the month for an employee',
      api: '/techstep/api/UsersKpiAndKra/Service/KpiReportForSingleUser/',
      parameter: 'MonthYearAndUser',
      method: 'getDataWithOptions'
    }
  ];

  const reportsUser = [
    {
      id: 2,
      report: 'Your timesheet details for the month',
      api: `/techstep/api/Timesheet/Service/report/timesheet/${empId}/`,
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 4,
      report: 'Your detailed timesheet',
      api: `/techstep/api/Timesheet/Service/report/detailedtimesheet/${empId}/`,
      parameter: 'MonthYear',
      method: 'getDataWithOptions'
    },
    {
      id: 6,
      report: 'KPI - KRA Details for the month',
      api: '/techstep/api/UsersKpiAndKra/Service/KpiReportForSingleUser/',
      parameter: 'MonthYearIndividualUser',
      method: 'getDataWithOptions'
    }
  ];

  const handleChange = (e) => {
    setReport(e.target.value);
  };

  const handleDownload = async () => {
    setLoading(true);
    const report =
      role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER'
        ? reportsAdmin.find((_x) => _x.id === +selectedReport)
        : reportsUser.find((_x) => _x.id === +selectedReport);
    const formatteDate = format(date, 'MM/yyyy');
    const isMonthYearAndUser =
      // eslint-disable-next-line no-nested-ternary
      report.parameter === 'MonthYearAndUser'
        ? `${report.api + formatteDate}/${selectedEmployee.employeeId}`
        : report.parameter === 'MonthYearIndividualUser'
        ? `${report.api + formatteDate}/${empId}`
        : report.api + formatteDate;
    const response = await api.methods[report.method](isMonthYearAndUser, {
      responseType: 'blob' // **don't forget to add this**
    });

    const contentType = response.headers['content-type'];
    const blob = new Blob([response.data], {
      type: contentType
    });
    const filename = response.headers['content-disposition'].split('filename=')[1];
    fileSaver(blob, filename);
    setLoading(false);
  };

  const isFormUser =
    role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER'
      ? reportsAdmin.find((_x) => _x.id === +selectedReport)
      : reportsUser.find((_x) => _x.id === +selectedReport);

  React.useEffect(() => {
    dispatch(getAllUsersActionAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Timesheet reports' }]}
        />
        <Card>
          <CardContent sx={{ minHeight: 300 }}>
            <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="available-reports-id">Available reports</InputLabel>
                {role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER' ? (
                  <Select
                    variant="standard"
                    labelId="available-reports-id"
                    id="available-reports-select"
                    value={selectedReport}
                    label="Available reports"
                    onChange={handleChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {reportsAdmin.map((_x, i) => (
                      <MenuItem key={i} value={_x.id}>
                        {_x.report}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Select
                    variant="standard"
                    labelId="available-reports-id"
                    id="available-reports-select"
                    value={selectedReport}
                    label="Available reports"
                    onChange={handleChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {reportsUser.map((_x, i) => (
                      <MenuItem key={i} value={_x.id}>
                        {_x.report}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
              {isFormUser && isFormUser.parameter === 'MonthYear' && (
                <DatePicker
                  views={['month', 'year']}
                  label="Month and Year"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField variant="standard" {...params} />}
                />
              )}
              {isFormUser && isFormUser.parameter === 'MonthYearAndUser' && (
                <>
                  <DatePicker
                    views={['month', 'year']}
                    label="Month and Year"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                  />
                  <Autocomplete
                    disablePortal
                    autoHighlight
                    id="employeeId-id"
                    value={selectedEmployee}
                    onChange={(_event, newValue) => {
                      if (newValue) {
                        console.log('🚀 => newValue', newValue);
                        setSelectedEmployee(newValue);
                      }
                    }}
                    fullWidth
                    options={employees}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField variant="standard" {...params} label="User" />}
                  />
                </>
              )}
            </Stack>
            <Stack sx={{ mt: 1 }}>
              <LoadingButton
                loading={isLoading}
                endIcon={<SimCardDownloadIcon />}
                loadingIndicator="Downloading..."
                variant="contained"
                onClick={handleDownload}
                size="small"
                disabled={selectedReport === ''}
              >
                Download
              </LoadingButton>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
