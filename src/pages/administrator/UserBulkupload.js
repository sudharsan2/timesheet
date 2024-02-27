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
import {
  downloadUserTemplateActionAsync,
  uploadUsersActionAsync,
  getIsLoadingFromUser
} from '../../redux/slices/userSlice';
import { MIconButton } from '../../components/@material-extend';

export default function UserBulkupload() {
  const title = 'User Bulk Upload';

  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const isLoading = useSelector(getIsLoadingFromUser);

  const [_files, setFiles] = useState([]);

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
    dispatch(downloadUserTemplateActionAsync());
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('File', _files[0]);
    dispatch(uploadUsersActionAsync(formData))
      .then(() => {
        enqueueSnackbar('Uploaded successfully', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setFiles([]);
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

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User Management', href: PATH_DASHBOARD.admin.userManagement },
            { name: 'User Bulk Upload' }
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
