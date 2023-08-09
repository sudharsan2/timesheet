import {
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Container,
  Card,
  Stack,
  CardContent,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import React, { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { useNavigate, useParams } from 'react-router';
import { createDispatchHook, useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  uploadHolidaysAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser
} from '../../redux/slices/projectSlice';
import { MIconButton } from '../../components/@material-extend';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { UploadLeave } from '../../components/upload';

export default function LeaveUpload() {
  // return <Typography variant="h3">Ajay</Typography>;
  const { themeStretch } = useSettings();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isLoading = useSelector(getIsLoadingFromUser);
  const params = useParams();
  const dispatch = useDispatch();
  const msg = useSelector(getMsgFromUser);
  const error = useSelector(getErrorFromUser);
  const [_files, setFiles] = useState([]);
  const { projId } = useState([]);
  const { projects } = useSelector((state) => state.proj);
  console.log('first', projects);

  // const leaveDetails = projects.find((val) => {
  //   console.log('sdfgh', val.name);
  //   return val.proj_Id === params.projId;
  // });

  const calendarDetails = projects.find((_x) => _x.proj_Id === Number(params.projId));
  console.log('sec', calendarDetails.proj_Id);

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

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', _files[0]);
    formData.append('proj_Id', calendarDetails.proj_Id);
    dispatch(uploadHolidaysAsync(formData));
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

  // const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

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

  const title = 'Leave Upload';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Project Details', href: PATH_DASHBOARD.project.projectCreate },
            { name: 'Create' }
          ]}
        />

        <Card>
          <CardContent>
            <UploadLeave
              showPreview={false}
              accept=".xlsx, .xls"
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
