import {
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Container,
  Card,
  Stack,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Button,
  Autocomplete
} from '@mui/material';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { DatePicker, LoadingButton } from '@mui/lab';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Icon } from '@iconify/react';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import closeFill from '@iconify/icons-eva/close-fill';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { createDispatchHook, useDispatch, useSelector } from 'react-redux';
import {
  createOrUpdatecalendarAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser,
  getAllDaysAsync
} from '../../redux/slices/projectSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { MIconButton } from '../../components/@material-extend';
import useSettings from '../../hooks/useSettings';

/* eslint-disable */

export default function CreateCalendar() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const empty = [];
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState([]);
  const title = 'Create Calendar';
  const { weekdays } = useSelector((state) => state.project);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [selectedCities, setSelectedCities] = useState(null);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.4 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const NewGroupSchema = Yup.object().shape({
    calendarname: Yup.string().required('Calendar Name is required'),
    weekOffs: Yup.array().required('Week Offs is required')
  });

  const formik = useFormik({
    initialValues: {
      calendarname: '',
      weekOffs: []
    },
    validationSchema: NewGroupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('🚀 => values', values);
        dispatch(createOrUpdatecalendarAsync({ ...values, weekOffs: values.weekOffs.map((_x) => _x.value) }));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
      setTimeout(() => navigate('/dashboard/project/project-calendar'), 1000);
    }
  });

  useEffect(() => {
    dispatch(getAllDaysAsync());
  }, [dispatch]);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
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

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Calendar Details', href: PATH_DASHBOARD.project.projectCalendar },
            { name: 'Create' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={10}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        required
                        fullWidth
                        label="Calendar Name"
                        {...getFieldProps('calendarname')}
                        error={Boolean(touched.calendarname && errors.calendarname)}
                        helperText={touched.calendarname && errors.calendarname}
                      />
                    </Stack>
                    <FormControl
                      fullWidth
                      varient="outlined"
                      size="large"
                      error={Boolean(touched.weekOffs && errors.weekOffs)}
                    >
                      <InputLabel id="week-off-name">Week Off</InputLabel>
                      <Select
                        fullWidth
                        labelId="week-off-checkbox-label"
                        id="week-off-name"
                        multiple
                        {...getFieldProps('weekOffs')}
                        input={<OutlinedInput label="Week Offs" />}
                        renderValue={(selected) => selected.map((_x) => _x && _x.value).join(', ')}
                        MenuProps={MenuProps}
                      >
                        {weekdays.map((_x, i) => (
                          <MenuItem key={i} value={_x}>
                            <Checkbox checked={values.weekOffs.map((_x) => _x.value).indexOf(_x.value) > -1} />
                            <ListItemText primary={_x.value} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      {/* <Button variant="contained" onClick={click}>
                        CANCEL
                      </Button> */}
                      <LoadingButton
                        style={{ marginLeft: 5 }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        CREATE
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
