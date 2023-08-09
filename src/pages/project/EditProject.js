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
  Autocomplete,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  ListItemText
} from '@mui/material';
import Multiselect from 'multiselect-react-dropdown';
// import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Icon } from '@iconify/react';
import { MultiSelect } from 'primereact/multiselect';
import closeFill from '@iconify/icons-eva/close-fill';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router';
import { DatePicker, LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { createDispatchHook, useDispatch, useSelector } from 'react-redux';
import {
  createUpdateProjectAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser,
  getListOfCalendarAsync
} from '../../redux/slices/projectSlice';
import { getListofNamesAsync, getListofNames } from '../../redux/slices/assetSlice';
import { getAllProjectsAsync } from '../../redux/slices/projSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_administrator/list';
import { PATH_DASHBOARD } from '../../routes/paths';
import { MIconButton } from '../../components/@material-extend';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';

/*eslint-disable*/

export default function EditProject() {
  // return <Typography variant="h3">Ajay</Typography>;
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [arr, setArr] = useState([]);
  const [newAr, setNewAr] = useState();
  const arrr = [];
  const arrr1 = [];
  const [x, setX] = useState([]);
  const [emp, setEmp] = useState([]);
  const { employees } = useSelector((state) => state.asset);
  const { employees: userList } = useSelector((state) => state.asset);
  const params = useParams();
  console.log('Name', employees);
  const [empName, setEmpName] = React.useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sections] = React.useState([]);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const { projects } = useSelector((state) => state.proj);
  console.log('first5643', projects);
  // const { calender: userList } = useSelector((state) => state.project);
  const [checked, setChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { calender } = useSelector((state) => state.project);
  console.log('jaa', calender);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const projectDetails = projects.find((val) => {
    console.log('sdfgh', val.emp_Projects);
    return val.proj_Id == params.projId;
  });

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
  const [selectedCities, setSelectedCities] = useState(null);

  const empty = [];

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
  }

  const NewUserSchema = Yup.object().shape({
    proj_Name: Yup.string().required('Project name is required'),
    empNames: Yup.array().required('Employee name is required'),
    calendarName: Yup.string().required('Project name is required'),
    description: Yup.string().required('Project Description is required'),
    start_Date: Yup.string().required('Start date is required'),
    end_Date: Yup.string().required('End Date is required')
  });

  const temp1 = [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      proj_Id: projectDetails.proj_Id || '',
      proj_Name: projectDetails.proj_Name || '',
      empNames:
        projectDetails.emp_Projects.map((emp) => {
          console.log('Four', emp);
          temp1.push(emp.name);
          // return { value: emp.name, emp_Id: emp.emp_Id };
          return emp.name;
        }) || [],
      calendarName: projectDetails.calendarName || '',
      description: projectDetails.description || '',
      start_Date: projectDetails.start_Date || '',
      end_Date: projectDetails.end_Date || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        console.log('five', { ...values, empNames: values.empNames.map((_x) => _x.id) });
        console.log('five 2', values);
        dispatch(
          createUpdateProjectAsync({
            ...values,
            empNames: values.empNames.map((_x) => (_x && _x.value ? _x.value : _x))
          })
        );
        setSubmitting(false);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('Updated failed', { variant: 'error' });
        setErrors(error);
      }
      setTimeout(() => navigate('/dashboard/project/project-create'), 1000);
    }
  });

  console.log('45678', temp1);

  const handleChecked = (e) => {
    e.target.checked;
  };

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  console.log('Formik', formik);

  console.log('val 2', selectedOptions[2]);

  // React.useEffect(() => {
  //   setVal({
  //     empIds:
  //       projectDetails.emp_Projects.map((val) => {
  //         return val.name;
  //       }) || []
  //   });
  // }, [projectDetails]);

  // console.log('newww', val);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, value } = formik;

  useEffect(() => {
    dispatch(getListofNamesAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // setPersonName('Heloo');
    console.log('newAr', newAr);
  }, [dispatch, setFieldValue]);

  const onChangeHandler = (e) => {
    setSelected(...selected, e.target.value);
    console.log('third', selected);
  };

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
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllProjectsAsync());
  }, [dispatch]);

  const title = 'Edit Project';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Project Details', href: PATH_DASHBOARD.project.projectCreate },
            { name: 'Edit' }
          ]}
        />

        <FormikProvider value={formik}>
          <Form noValiddate autoComplete="off" onSubmit={handleSubmit}>
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
                        label="Project Name"
                        {...getFieldProps('proj_Name')}
                        error={Boolean(touched.proj_Name && errors.proj_Name)}
                        helperText={touched.proj_Name && errors.proj_Name}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {/* ---------------------- main --------------------------- */}
                      {/* <FormControl fullWidth> */}
                      {/* <Select
                          fullWidth
                          labelId="employee-name-checkbox-label"
                          id="employee-name"
                          // onChange={handleChecked}
                          multiple
                          {...getFieldProps('empNames')}
                          input={<OutlinedInput label="Employee Name" />}
                          renderValue={(selected) => selected.map((_x) => _x && _x.value).join(', ')}
                          MenuProps={MenuProps}
                        >
                          {employees.map((_x, i) => (
                            <MenuItem key={i} value={_x}>
                              <Checkbox
                                checked={
                                  values.empNames && values.empNames.map((_x) => _x.value).indexOf(_x.value) > -1
                                }
                              />
                              <ListItemText primary={_x.value} />
                            </MenuItem>
                          ))}
                        </Select> */}
                      <div className="card flex justify-content-center" style={{ width: '100%' }}>
                        <FormControl fullWidth>
                          <MultiSelect
                            // style={{ width: 840, height: 55 }}
                            fullWidth
                            options={employees}
                            optionLabel="value"
                            optionValue="value"
                            filter
                            placeholder="Employee Name"
                            maxSelectedLabels={7}
                            {...getFieldProps('empNames')}
                            className="w-full"
                          />
                        </FormControl>
                      </div>
                      {/* </FormControl> */}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Calendar Name *</InputLabel>
                        <Select
                          labelId="Calendar-type-label"
                          id="Calendar-select"
                          label="Calendar Type"
                          name="Calendar Type"
                          {...getFieldProps('calendarName')}
                          error={Boolean(touched.calendarName && errors.calendarName)}
                          helperText={touched.calendarName && errors.calendarName}
                          MenuProps={MenuProps}
                        >
                          {calender.map((_x, i) => (
                            <MenuItem key={i} value={_x.calendarname}>
                              {_x.calendarname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        rows={2}
                        multiline
                        label="Project Description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Stack>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 14, sm: 12 }}>
                        <DatePicker
                          fullWidth
                          label="Start Date"
                          value={values.start_Date}
                          inputFormat="dd/MM/yyyy"
                          disablePast
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('start_Date', parseddate);
                            } else {
                              setFieldValue('start_Date', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="Start Date" />
                          )}
                        />
                        <DatePicker
                          fullWidth
                          label="End Date"
                          value={values.end_Date}
                          inputFormat="dd/MM/yyyy"
                          disablePast
                          onChange={(newValue) => {
                            if (newValue) {
                              const parseddate = format(newValue, 'yyyy-MM-dd');
                              setFieldValue('end_Date', parseddate);
                            } else {
                              setFieldValue('end_Date', '');
                            }
                          }}
                          // onChangeRaw={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          disabled={isLoading}
                          renderInput={(params) => (
                            <Field component={TextField} size="small" {...params} label="End  Date" />
                          )}
                        />
                      </Stack>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                      >
                        UPDATE
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
