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
  Stack
} from '@mui/material';
import moment from 'moment';
import { DatePicker, LoadingButton } from '@mui/lab';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useNavigate, useParams } from 'react-router';
import {
  downloadLOPReportAsync,
  setErrorNull,
  getMsgFromUser,
  setMsgNull,
  getErrorFromUser,
  getIsLoadingFromUser
} from '../../redux/slices/projectSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';
import Page from '../../components/Page';

// downloadLOPReportAsync

export default function DownloadReport() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const title = 'LOP Reports';
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [date, setDate] = React.useState(new Date());
  const [selectedReport, setReport] = React.useState('');
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const navigate = useNavigate();
  const [downloadDate, setDownloadDate] = useState('');
  const [loading, setLoading] = React.useState(false);

  const dateSlice = String(date).slice(4, 7);

  const yearSlice = String(date).slice(11, 16);

  console.log('year', yearSlice);

  const mome = moment().month(dateSlice).format('MM');

  console.log('month', mome);

  console.log('jan', dateSlice);

  const handleChange = (e) => {
    setReport(e.target.value);
  };

  const handleDownload = () => {
    setLoading(true);
    setDownloadDate(String(`${mome}${yearSlice}`));
    dispatch(downloadLOPReportAsync(String(`${mome}/${yearSlice}`)));
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
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'LOP Report' }]}
        />
        <Card>
          <CardContent sx={{ minHeight: 300 }}>
            <FormControl fullWidth>
              <Stack>
                <DatePicker
                  fullWidth
                  views={['month', 'year']}
                  label="Month and Year"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField variant="standard" {...params} />}
                />
              </Stack>
              <Stack sx={{ mt: 1 }}>
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
