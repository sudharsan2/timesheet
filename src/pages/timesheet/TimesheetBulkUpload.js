import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import downloadIcon from '@iconify/icons-eva/download-fill';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { Card, CardContent, Container, Button } from '@mui/material';

import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UploadMultiFile } from '../../components/upload';
import { getIsLoadingFromUser } from '../../redux/slices/userSlice';
import {
  downloadTimesheetTemplateActionAsync,
  uploadTimesheetActionAsync,
  getErrorFromTS,
  setErrorNull,
  getMsgFromTS,
  setMsgNull
} from '../../redux/slices/timesheetSlice';
import { MIconButton } from '../../components/@material-extend';

export default function TimesheetBulkupload() {
  const title = 'Timesheet Bulk Upload';

  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromTS);
  const [_files, setFiles] = useState([]);
  const msg = useSelector(getMsgFromTS);

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

  const handleDownload = () => {
    dispatch(downloadTimesheetTemplateActionAsync());
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('File', _files[0]);
    dispatch(uploadTimesheetActionAsync(formData));
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
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Timesheet Entry', href: PATH_DASHBOARD.timesheet.timesheet },
            { name: 'Timesheet Bulk Upload' }
          ]}
          action={
            <>
              <Button variant="contained" onClick={handleDownload} startIcon={<Icon icon={downloadIcon} />}>
                Download sample template
              </Button>
            </>
          }
        />

        <Card>
          <CardContent>
            <UploadMultiFile
              showPreview={false}
              accept=".xlsx"
              maxFiles={1}
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
      </Container>
    </Page>
  );
}
