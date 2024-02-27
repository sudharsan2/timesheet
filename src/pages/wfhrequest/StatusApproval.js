/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';

export default function StatusApproval() {
  const { themeStretch } = useSettings();
  const params = useParams();
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [todate, SetToDate] = useState('');
  const [noOfDays, setNoOfDays] = useState('');
  const [reason, setReason] = useState('');
  const [reportingManager, setReportingManager] = useState('');
  const [podManager, setPodManager] = useState('');
  const [backLog, setBackLog] = useState('');
  const [remarks, setRemarks] = useState('');
  const [reqStatus, setReqStatus] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const [id, setId] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const token = localStorage.getItem('accessToken');

  const fetchRequestData = () => {
    axios
      .get('https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/wfh', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('Request Response', res.data);
        const requestId = parseInt(params.id, 10);
        const requestArray = res.data.filter((val) => val.id === requestId);
        console.log('Sample Get', requestArray);

        if (requestArray.length > 0) {
          const requestItem = requestArray[0];
          setId(requestItem.id);
          setFromDate(requestItem.fromdate);
          SetToDate(requestItem.todate);
          setNoOfDays(requestItem.numberOfDays);
          setReason(requestItem.reason);
          setReportingManager(requestItem.manager);
          setPodManager(requestItem.projectmanager);
          setBackLog(requestItem.backlog);
          setRemarks(requestItem.remarks);
          setReqStatus(requestItem.status);
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  useEffect(() => {
    fetchRequestData();
  }, [params.id]);

  const approveStatus = (status, remarks) => {
    setLoading(true);
    axios
      .put(
        `https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/wfhComplete/${id}`,
        {
          status,
          remarks
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        setLoading(false);
        console.log('Request updated successfully', res.data);
        enqueueSnackbar('Approved', { variant: 'success' });
        navigate(PATH_DASHBOARD.travel.requestApproval);
      })
      .catch((err) => {
        setLoading(false);
        console.log('Error updating request', err);
        enqueueSnackbar('Approved failed', { variant: 'error' });
      });
  };

  const rejectStatus = (status, remarks) => {
    setLoadingReject(true);
    axios
      .put(
        `https://techstephub.focusrtech.com:3030/techstep/api/Timesheet/Service/wfhComplete/${id}`,
        {
          status,
          remarks
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        setLoadingReject(false);
        console.log('Request Rejected', res.data);
        enqueueSnackbar('Rejected', { variant: 'error' });
        navigate(PATH_DASHBOARD.travel.requestApproval);
      })
      .catch((err) => {
        setLoadingReject(false);
        console.log('Error updating request', err);
        enqueueSnackbar('Rejection failed', { variant: 'error' });
      });
  };

  const labelStyle = {
    fontWeight: 'italic',
    color: 'blue'
  };

  const handleBack = () => {
    // Logic to handle the back button click, for example, navigate to a previous page or route
    navigate(PATH_DASHBOARD.travel.requestApproval);
  };
  const title = 'WFH Request Approval';
  return (
    <Page title={title}>
      <Container sx={{ mt: -3 }} maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Create Request', href: PATH_DASHBOARD.travel.requestApproval },
            { name: 'Req' }
          ]}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            <Card sx={{ p: 3, mt: -3 }}>
              <Stack spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} columnGap={25}>
                    <Typography>
                      <span style={labelStyle}>From Date:</span> {String(fromDate).slice(0, 10)}
                    </Typography>
                    <Typography>
                      <span style={labelStyle}>To Date:</span> {String(todate).slice(0, 10)}
                    </Typography>
                    <Typography>
                      {' '}
                      <span style={labelStyle}>No Of Days:</span> {noOfDays}
                    </Typography>
                  </Stack>
                </Grid>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormControl fullWidth>
                    <Typography>
                      <span style={labelStyle}>Reason :</span> {reason}
                    </Typography>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} columnGap={22}>
                  <Typography>
                    {' '}
                    <span style={labelStyle}>Reporting Manager:</span> {reportingManager}
                  </Typography>
                  <Typography>
                    <span style={labelStyle}>PDO Manager: </span>
                    {podManager}
                  </Typography>
                </Stack>

                <Grid item xs={12} sm={12} md={12}>
                  <Typography>
                    {/* <span style={labelStyle}>BackLog:</span> {backLog} */}
                    <TextField label="Backlogs" disabled value={backLog} multiline size="small" fullWidth />
                  </Typography>
                </Grid>
                <TextField
                  label="Remarks"
                  variant="outlined"
                  fullWidth
                  disabled={reqStatus !== 'submitted'}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={handleBack} aria-label="back">
                    <ArrowBackIcon sx={{ color: 'blue' }} />
                  </IconButton>
                  <LoadingButton
                    loading={loading}
                    disabled={reqStatus !== 'submitted'}
                    onClick={() => approveStatus('approved', remarks) /* You can set your own remarks here */}
                  >
                    Approve
                  </LoadingButton>
                  {/* <Button
                    disabled={reqStatus !== 'submitted'}
                    onClick={() => rejectStatus('rejected', remarks) }
                  >
                    Reject
                  </Button> */}
                  <LoadingButton
                    loading={loadingReject}
                    disabled={reqStatus !== 'submitted'}
                    onClick={() => rejectStatus('rejected', remarks) /* You can set your own remarks here */}
                  >
                    Reject
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
