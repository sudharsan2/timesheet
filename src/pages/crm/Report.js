/* eslint-disable eqeqeq */
import axios from 'axios';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Grid,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import moment from 'moment';
import { DatePicker, LoadingButton } from '@mui/lab';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useNavigate, useParams } from 'react-router';
import {
  setErrorNull,
  getMsgFromUser,
  setMsgNull,
  getErrorFromUser,
  getIsLoadingFromUser
} from '../../redux/slices/projectSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// eslint-disable-next-line import/named
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';
import Page from '../../components/Page';

// downloadLOPReportAsync

export default function CRMReport() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const title = 'CRM Reports';
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [date, setDate] = React.useState('');
  const [Todate, setToDate] = React.useState('');
  const [selectedReport, setReport] = React.useState('');
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const navigate = useNavigate();
  const [downloadDate, setDownloadDate] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [newArr, setNewArr] = useState([]);

  const token = localStorage.getItem('accessToken');

  const handleChange = (e) => {
    setReport(e.target.value);
  };

  const handleDownload = async () => {
    if (date == '' || date == null || Todate == '' || Todate == null) {
      enqueueSnackbar('Please Select Date', { variant: 'error' });
    } else {
      try {
        setLoading(true);
        const response = await axios.post(
          'https://secure.focusrtech.com:5050/techstep/api/CrmLead/Service/getFollowexcel',
          {
            follDate: date,
            followUpToDate: Todate
          },
          {
            responseType: 'blob',
            headers: {
              // eslint-disable-next-line prefer-template
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'CRM Reports.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        // window.location.reload();
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error downloading the report:', error);
      }
    }
  };

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(setErrorNull());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    if (msg) {
      enqueueSnackbar(msg, { variant: 'success' });
      dispatch(setMsgNull());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'CRM Reports' }]}
        />
        <Card>
          <CardContent sx={{ minHeight: 300 }}>
            <FormControl fullWidth>
              <Grid container spacing={0}>
                <Grid item xs={3} sx={{ marginLeft: 40 }}>
                  <DatePicker
                    // views={['month', 'year']}
                    label="From Date"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <TextField sx={{ width: 130 }} variant="standard" {...params} />}
                  />
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    // views={['month', 'year']}
                    label="To Date"
                    value={Todate}
                    onChange={(newValue) => setToDate(newValue)}
                    renderInput={(params) => <TextField sx={{ width: 130 }} variant="standard" {...params} />}
                  />
                </Grid>
              </Grid>

              <Stack sx={{ mt: 1, marginTop: 7 }}>
                <LoadingButton
                  loading={loading}
                  loadingIndicator="Downloading..."
                  endIcon={<SimCardDownloadIcon />}
                  variant="contained"
                  onClick={handleDownload}
                  size="small"
                >
                  Download
                </LoadingButton>
              </Stack>
            </FormControl>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
