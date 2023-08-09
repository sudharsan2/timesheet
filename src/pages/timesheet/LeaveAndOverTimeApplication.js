import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Stack,
  Box,
  Drawer,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DatePicker from '@mui/lab/DatePicker';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import {
  getAllLeaveBalanceForUserAsync,
  getCurrentBalanceFromLeaveMaster,
  getIsAppliedSuccess,
  applyLeaveActionAsync,
  getErrorMessageFromLeaveMaster,
  getPendingLeaveForApprovalAsync,
  getLeaveStatusedFromLeaveMaster,
  getIsLoadingFromLeaveMaster
} from '../../redux/slices/leaveSlice';
import { UploadMultiFile } from '../../components/upload';
import LeaveCurrentBalance from './LeaveApplicationComponents/LeaveCurrentBalance';
import PendingLeaveBalance from './LeaveApplicationComponents/PendingLeaveBalance';
import PreviousLeaveBalance from './LeaveApplicationComponents/PreviousLeaveBalance';
import { MIconButton } from '../../components/@material-extend';
import RejectedLeaveBalance from './LeaveApplicationComponents/RejectedLeaveBalance';

export default function LeaveAndOverTimeApplication() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const title = 'Leave Application';
  const drawerWidth = 450;
  const [isAddOpened, setDrawer] = React.useState(false);
  const [value, setValue] = React.useState('1');
  const dispatch = useDispatch();
  const currentBalance = useSelector(getCurrentBalanceFromLeaveMaster);
  const isSuccess = useSelector(getIsAppliedSuccess);
  const errorMessage = useSelector(getErrorMessageFromLeaveMaster);
  const leaveStatus = useSelector(getLeaveStatusedFromLeaveMaster);
  const isLoading = useSelector(getIsLoadingFromLeaveMaster);
  const pendingLeave = leaveStatus.filter((_x) => _x.status === 'SUBMITTED');
  const approvedLeave = leaveStatus.filter((_x) => _x.status === 'APPROVED');
  const rejectedLeave = leaveStatus.filter((_x) => _x.status === 'REJECTED');

  const [formData, setFormData] = React.useState({
    from_date: null,
    to_date: null,
    from_first_half: '',
    to_first_half: '',
    from_second_half: '',
    to_second_half: '',
    mobile_num: '',
    userComments: '',
    category: ''
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFormData = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (name, value) => {
    if (name === 'from_date') {
      setFormData((prevState) => ({ ...prevState, to_date: null }));
    }

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // format(value, 'yyyy-MMM-dd')

  const handleCheckbox = (e) => {
    if (e.target.name === 'from_first_half') {
      setFormData((prevState) => ({ ...prevState, to_first_half: 'N' }));
    }

    if (e.target.name === 'to_first_half') {
      setFormData((prevState) => ({ ...prevState, from_first_half: 'N' }));
    }

    if (e.target.name === 'from_second_half') {
      setFormData((prevState) => ({ ...prevState, to_second_half: 'N' }));
    }

    if (e.target.name === 'to_second_half') {
      setFormData((prevState) => ({ ...prevState, from_second_half: 'N' }));
    }

    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.checked ? 'Y' : 'N' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const payload = {
      ...formData.category,
      empId: localStorage.getItem('empId'),
      from_date: format(formData.from_date, 'yyyy-MMM-dd'),
      to_date: format(formData.to_date, 'yyyy-MMM-dd'),
      from_first_half: formData.from_first_half === '' ? 'N' : formData.from_first_half,
      to_first_half: formData.to_first_half === '' ? 'N' : formData.to_first_half,
      from_second_half: formData.from_second_half === '' ? 'N' : formData.from_second_half,
      to_second_half: formData.to_second_half === '' ? 'N' : formData.to_second_half,
      mobile_num: formData.mobile_num,
      managerComments: formData.managerComments,
      userComments: formData.userComments
    };
    await dispatch(applyLeaveActionAsync(payload));
    await dispatch(getAllLeaveBalanceForUserAsync());
    await dispatch(getPendingLeaveForApprovalAsync());
  };

  const handleDraweropen = () => {
    setDrawer(true);
  };

  const handleDrawerClose = () => {
    setDrawer(false);
  };

  React.useEffect(() => {
    dispatch(getAllLeaveBalanceForUserAsync());
    dispatch(getPendingLeaveForApprovalAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  React.useEffect(() => {
    if (isSuccess) {
      setFormData({
        from_date: null,
        to_date: null,
        from_first_half: '',
        to_first_half: '',
        from_second_half: '',
        to_second_half: '',
        mobile_num: '',
        userComments: '',
        category: ''
      });
      setDrawer(false);
      enqueueSnackbar('Leave Applied Successfully', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }

    if (errorMessage && !isSuccess) {
      enqueueSnackbar(errorMessage || 'Something went wrong', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, errorMessage]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Leave Application' }]}
          action={
            <Button variant="contained" onClick={handleDraweropen} startIcon={<Icon icon={plusFill} />}>
              Apply Leave
            </Button>
          }
        />
        <Card>
          <CardContent>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Your leave balance" value="1" />
                  <Tab label="Pending applications" value="2" />
                  <Tab label="Approved Leaves" value="3" />
                  <Tab label="Rejected Leaves" value="4" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <LeaveCurrentBalance rows={currentBalance} isLoading={false} />
              </TabPanel>
              <TabPanel value="2">
                <PendingLeaveBalance rows={pendingLeave} isLoading={false} />
              </TabPanel>
              <TabPanel value="3">
                <PreviousLeaveBalance rows={approvedLeave} isLoading={false} />
              </TabPanel>
              <TabPanel value="4">
                <RejectedLeaveBalance rows={rejectedLeave} isLoading={false} />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
        <Drawer anchor="right" open={isAddOpened} onClose={handleDrawerClose}>
          <Box m={5} sx={{ width: { sm: 'auto', md: drawerWidth } }} role="presentation">
            <Typography variant="h6" gutterBottom component="div" align="center">
              Leave application
            </Typography>

            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Stack direction={{ sm: 'column', md: 'column' }} spacing={1}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="standard" size="small">
                      <InputLabel id="leave-select-label">Leave Type</InputLabel>
                      <Select
                        labelId="leave-select-label"
                        id="leave-select"
                        label="leave"
                        name="category"
                        value={formData.category}
                        onChange={handleFormData}
                        required
                      >
                        <MenuItem value="">Select</MenuItem>
                        {currentBalance.map((_x, i) => (
                          <MenuItem key={i} value={_x} disabled={_x.balance_leave === 0}>
                            {_x.category_name} ({_x.balance_leave})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormGroup>
                      <DatePicker
                        label="From Date"
                        name="from_date"
                        value={formData.from_date}
                        onChange={(newValue) => handleDateChange('from_date', newValue)}
                        renderInput={(params) => <TextField required variant="standard" {...params} />}
                      />
                      <FormControlLabel
                        name="from_first_half"
                        onChange={handleCheckbox}
                        control={<Checkbox checked={formData.from_first_half === 'Y'} />}
                        label="First Half"
                      />
                      <FormControlLabel
                        name="to_first_half"
                        onChange={handleCheckbox}
                        control={<Checkbox checked={formData.to_first_half === 'Y'} />}
                        label="Second Half"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <FormGroup>
                      <DatePicker
                        label="To Date"
                        name="to_date"
                        minDate={formData.from_date}
                        value={formData.to_date}
                        onChange={(newValue) => handleDateChange('to_date', newValue)}
                        renderInput={(params) => <TextField required variant="standard" {...params} />}
                      />
                      <FormControlLabel
                        name="from_second_half"
                        onChange={handleCheckbox}
                        control={<Checkbox checked={formData.from_second_half === 'Y'} />}
                        label="First Half"
                      />
                      <FormControlLabel
                        name="to_second_half"
                        onChange={handleCheckbox}
                        control={<Checkbox checked={formData.to_second_half === 'Y'} />}
                        label="Second Half"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      multiline
                      maxRows={4}
                      fullWidth
                      name="userComments"
                      size="small"
                      variant="standard"
                      label="Reason"
                      required
                      value={formData.userComments}
                      onChange={handleFormData}
                      inputProps={{ maxLength: 255 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="mobile_num"
                      size="small"
                      variant="standard"
                      label="Mobile No. and Address During Leave"
                      value={formData.mobile_num}
                      onChange={handleFormData}
                      inputProps={{ maxLength: 255 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <UploadMultiFile
                      showPreview
                      maxSize={3145728}
                      accept="image/*"
                      files={[]}
                      onDrop={console.log}
                      onRemove={console.log}
                      onRemoveAll={console.log}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ClearIcon />}
                        onClick={handleDrawerClose}
                        disabled={isLoading}
                      >
                        Close
                      </Button>{' '}
                      <Button variant="contained" fullWidth endIcon={<SendIcon />} disabled={isLoading} type="sumbit">
                        Apply
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </form>
          </Box>
        </Drawer>
      </Container>
    </Page>
  );
}
