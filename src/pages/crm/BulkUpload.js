import { Container, Typography, Grid, Card, CardContent, Button, Stack, TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import React, { useState, useCallback } from 'react';
import { DatePicker, LoadingButton } from '@mui/lab';
import { Link as RouterLink } from 'react-router-dom';
import downloadIcon from '@iconify/icons-eva/cloud-download-fill';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { MIconButton } from '../../components/@material-extend';
import UploadCRM from '../../components/upload/UploadCRM';
import {
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser
} from '../../redux/slices/projectSlice';

export default function BulkUploadCRM() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const title = 'CRM Upload';
  const { themeStretch } = useSettings();
  const error = useSelector(getErrorFromUser);
  const isLoading = useSelector(getIsLoadingFromUser);
  const [_files, setFiles] = useState([]);
  const msg = useSelector(getMsgFromUser);
  const [date, setDate] = React.useState(new Date());
  console.log('first', date);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = _files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  const handleUpload = (file) => {
    console.log('he;', String(date).slice(4, 8));

    console.log('yrt', String(date).slice(11, 15));

    const he = String(date).slice(4, 8);
    const yrt = String(date).slice(11, 15);
    const dat = he + yrt;
    console.log('concat', dat);
    const formData = new FormData();
    formData.append('file', _files[0]);
    formData.append('yearAndMonth', dat);
    // dispatch(uploadBiometricAsync(formData));
    setFiles([]);
    // .then(() => {
    //   enqueueSnackbar('Uploaded successfully', {
    //     variant: 'success',
    //     action: (key) => (
    //       <MIconButton size="small" onClick={() => closeSnackbar(key)}>
    //         <Icon icon={closeFill} />
    //       </MIconButton>
    //     )
    //   });

    // })
    // .catch((err) => {
    //   enqueueSnackbar(err, {
    //     variant: 'error',
    //     action: (key) => (
    //       <MIconButton size="small" onClick={() => closeSnackbar(key)}>
    //         <Icon icon={closeFill} />
    //       </MIconButton>
    //     )
    //   });
    // });
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
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Upload Details', href: PATH_DASHBOARD },
            { name: 'Upload CRM' }
          ]}
          // action={
          //   <>
          //     <Button
          //       variant="contained"
          //       component={RouterLink}
          //       to={PATH_DASHBOARD.project.downloadReport}
          //       startIcon={<Icon icon={downloadIcon} />}
          //     >
          //       Download the Report
          //     </Button>
          //   </>
          // }
        />
        <Grid item xs={12} sm={12} md={12}>
          <Card sx={{ marginTop: -3 }}>
            <Stack sx={{ marginLeft: 4, marginRight: 4, marginTop: 1 }}>
              {/* <DatePicker
                views={['month', 'year']}
                label="Month and Year"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField variant="standard" {...params} />}
              /> */}
              <DatePicker
                label="month and year"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField variant="standard" {...params} />}
                views={['month', 'year']}
                dateFormat="MMMM yyyy"
              />
            </Stack>
            <CardContent>
              <UploadCRM
                showPreview={false}
                accept=".xlsx, .xls"
                maxFiles={2}
                files={_files}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                handleUpload={handleUpload}
                removeLable="Remove"
                uploadLable="Upload"
              />
              {isLoading ? 'Uploading...' : null}
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Page>
  );
}
