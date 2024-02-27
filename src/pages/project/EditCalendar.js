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
  Autocomplete
} from '@mui/material';
import * as Yup from 'yup';
import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { DatePicker, LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Icon } from '@iconify/react';
import Checkbox from '@mui/material/Checkbox';
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
  getListOfCalendarAsync,
  getAllDaysAsync
} from '../../redux/slices/projectSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { MIconButton } from '../../components/@material-extend';
import useSettings from '../../hooks/useSettings';

/*eslint-disable*/

export default function CreateCalendar() {
  // return <Typography variant="h3">Ajay</Typography>;
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isLoading = useSelector(getIsLoadingFromUser);
  const [personName, setPersonName] = React.useState([]);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const empty = [];
  const { weekdays } = useSelector((state) => state.project);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const { calender } = useSelector((state) => state.project);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const calendarDetails = calender.find((_x) => _x.calendar_id === Number(params.calenderId));

  const NewGroupSchema = Yup.object().shape({
    calendarname: Yup.string().required('Calendar Name is required'),
    weekOffs: Yup.array().required('Week Offs is required')
  });

  const [selectedCities, setSelectedCities] = useState(null);

  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003
    }
  ];

  const temp1 = [];

  const formik = useFormik({
    initialValues: {
      calendar_id: calendarDetails.calendar_id || '',
      calendarname: calendarDetails.calendarname || '',
      weekOffs:
        calendarDetails.weekOffs.map((week) => {
          temp1.push(week.weekoff);
          return week.weekoff;
        }) || []
    },

    validationSchema: NewGroupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('🚀 => values', values);
        dispatch(
          createOrUpdatecalendarAsync({
            ...values,
            weekOffs: values.weekOffs.map((_x) => (_x && _x.value ? _x.value : _x))
          })
        );
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

  console.log('rewww', temp1);

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

  useEffect(() => {
    dispatch(getListOfCalendarAsync());
    dispatch(getAllDaysAsync());
  }, [dispatch]);

  const title = 'Edit Calendar';

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
                        fullWidth
                        label="Calendar Name"
                        {...getFieldProps('calendarname')}
                        error={Boolean(touched.calendarname && errors.calendarname)}
                        helperText={touched.calendarname && errors.calendarname}
                      />{' '}
                      {/* <FormControl fullWidth>
                        <InputLabel id="week-off-id">Week Offs</InputLabel>
                        <Select
                          labelId="week-off-id"
                          id="week-off-id-checkbox"
                          multiple
                          isSearchable={true}
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
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      */}
                      <div className="card flex justify-content-center">
                        <FormControl fullWidth>
                          <MultiSelect
                            style={{ width: 400, height: 55 }}
                            // value={selectedCities}
                            // onChange={}
                            options={weekdays}
                            optionLabel="value"
                            optionValue="value"
                            filter
                            placeholder="Week Off"
                            maxSelectedLabels={7}
                            {...getFieldProps('weekOffs')}
                            className="w-full md:w-20rem"
                          />
                        </FormControl>
                      </div>
                    </Stack>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      {/* <LoadingButton variant="contained" onClick={click}>
                        CANCEL
                      </LoadingButton> */}
                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        Update
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
