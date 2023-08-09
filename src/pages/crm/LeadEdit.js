/* eslint-disable eqeqeq */
/* eslint-disable arrow-body-style */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unneeded-ternary */
import axios from 'axios';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';
import { DatePicker, LoadingButton } from '@mui/lab';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  FormHelperText,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import Switch from '@mui/material/Switch';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  UpdateLeadAsync,
  getMsgFromUser,
  getErrorFromUser,
  setErrorNull,
  setMsgNull,
  getIsLoadingFromUser,
  getListOfLevelAsync,
  getListOfPriorityAsync,
  getListOfStatusAsync,
  // getListOfProjectNameAsync,
  getListOfInternalDivisionAsync,
  getListOfNextActionAsync,
  getListOfClassificationAsync,
  getListofComapanyNamesAsync,
  getListOfCurrencyAsync,
  getActiveStatusAsync
} from '../../redux/slices/leadSlice';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { getUserDetailsFromAuth } from '../../redux/slices/authSlice';
import { MIconButton } from '../../components/@material-extend';

// ----------------------------------------------------------------------

export default function LeadEdit() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const params = useParams();
  const { themeStretch } = useSettings();
  const authDetails = useSelector(getUserDetailsFromAuth);
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const success = useSelector(getMsgFromUser);

  // const activeStatus = useSelector(getActiveStatus);

  const title = 'Lead Entry';
  const { levels } = useSelector((state) => state.lead);
  console.log('skhfg', levels);
  const { priorities } = useSelector((state) => state.lead);
  console.log('kfdhj', priorities);
  const { statuss } = useSelector((state) => state.lead);
  console.log('lidhh', statuss);
  const { companynames } = useSelector((state) => state.lead);
  console.log('khggf', companynames);
  const { internalDivisions } = useSelector((state) => state.lead);
  console.log('xcds', internalDivisions);
  const { nextactions } = useSelector((state) => state.lead);
  console.log('djks', nextactions);
  const { currencies } = useSelector((state) => state.lead);
  console.log('lkjug', currencies);
  const { activeStatus } = useSelector((state) => state.lead);
  console.log('astaus', activeStatus);
  const navigate = useNavigate();
  const { leads } = useSelector((state) => state.lead);

  const [active, setactive] = useState(false);

  const [formData, setFormData] = React.useState({
    from_date: null
  });
  const [status, setStatus] = React.useState('');
  const [statusReader, setStatusReader] = useState('');
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  console.log('statuss', statuss);
  const handleDateChange = (name, value) => {
    if (name === 'start_date') {
      setFormData((prevState) => ({ ...prevState, end_date: null }));
    }

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const [statusMonitor, setStatusMonitor] = useState(false);

  const leadDetails = leads.find((_x) => _x.lead_id === Number(params.lead_id));
  console.log('leadDetails', leadDetails);

  const handleActiveChange = (e) => {
    setactive(e.target.checked);
    // if (e.target.checked === true) {
    //   setStatusReader('ACTIVE');
    // } else {
    //   setStatusReader('INACTIVE');
    // }

    console.log('Statufghjkls', e.target.checked);
  };
  // const [arr, setArr] = useState([]);

  // setArr(statuss.push(arr));
  // console.log('arr', arr);

  const NewUserSchema = Yup.object().shape({
    company_name: Yup.string().required('Company Name is required'),
    client_designation: Yup.string().required('Client Designation is required'),
    location: Yup.string().required('Location is required'),
    level: Yup.string().required('Level is required'),
    projectname: Yup.string().required('Project Name is required'),
    additional_details: Yup.string().required('Additional details is required'),
    email: Yup.string().email('Invalid email', '^[a-z)A-Z0-9+_.-]+@[a-zA-Z0-9.-]+$').required('Required'),
    contact_person_name: Yup.string().required('Contact is required'),
    contact: Yup.number().required('Contact is required'),
    internal_division: Yup.string().required('Internal Division is required'),
    project_approximate_value: Yup.number().required('Project Aprox Value is required'),
    currency: Yup.string().required('Currency is required'),
    lead_source: Yup.string().required('Lead Source is required'),
    lead_qualified: Yup.string().required('Lead Qualified is required'),
    lead_mined_by: Yup.string().required('Lead Mined By is required'),
    priority: Yup.string().required('Priority is required'),
    next_action: Yup.string().required('Nextaction is required'),
    follow_up_date: Yup.string().required('FollowUp date is required'),
    responsibility: Yup.string().required('Responsibility is required'),
    // target_date: Yup.string().required('Target Date  is required'),
    final_completion_date: Yup.string(),
    status: Yup.string().required('Status  is required'),
    is_ACTIVE: Yup.string().required('Active Status  is required'),
    remarks: Yup.string().required('Remarks/Reason  is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      lead_id: leadDetails.lead_id || '',
      company_name: leadDetails.company_name || '',
      client_designation: leadDetails.client_designation || '',
      location: leadDetails.location || '',
      crm_representative: leadDetails.crm_representative || '',
      level: leadDetails.level || '',
      projectname: leadDetails.projectname || '',
      additional_details: leadDetails.additional_details || '',
      email: leadDetails.email || '',
      contact_person_name: leadDetails.contact_person_name || '',
      contact: leadDetails.contact || '',
      internal_division: leadDetails.internal_division || '',
      project_approximate_value: leadDetails.project_approximate_value || '',
      currency: leadDetails.currency || '',
      lead_source: leadDetails.lead_source || '',
      lead_qualified: leadDetails.lead_qualified || '',
      lead_mined_by: leadDetails.lead_mined_by || '',
      priority: leadDetails.priority || '',
      next_action: leadDetails.next_action || '',
      follow_up_date: leadDetails.follow_up_date || '',
      responsibility: leadDetails.responsibility || '',
      // target_date: leadDetails.target_date || '',
      final_completion_date: leadDetails.final_completion_date || '',
      status: leadDetails.status || '',
      is_ACTIVE: leadDetails.is_ACTIVE || '',
      remarks: leadDetails.remarks || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          lead_id: leadDetails.lead_id,
          company_name: values.company_name,
          client_designation: values.client_designation,
          location: values.location,
          crm_representative: values.crm_representative,
          level: values.level,
          projectname: values.projectname,
          additional_details: values.additional_details,
          email: values.email,
          contact_person_name: values.contact_person_name,
          contact: values.contact,
          internal_division: values.internal_division,
          project_approximate_value: values.project_approximate_value,
          currency: values.currency,
          lead_source: values.lead_source,
          lead_qualified: values.lead_qualified,
          lead_mined_by: values.lead_mined_by,
          priority: values.priority,
          next_action: values.next_action,
          follow_up_date: values.follow_up_date,
          responsibility: values.responsibility,
          // target_date: values.target_date,
          final_completion_date: values.final_completion_date,
          status: values.status,
          // eslint-disable-next-line prettier/prettier
          is_ACTIVE: active ? 'ACTIVE' : 'INACTIVE',
          remarks: values.remarks
        };
        await dispatch(UpdateLeadAsync(payload));

        setSubmitting(false);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
      navigate(PATH_DASHBOARD.crm.LeadEntryScreen);
    }
  });

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get(
        'https://secure.focusrtech.com:5050/techstep/api/CrmLead/Service/getListOfLeadEntryDetails',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prefer-template
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('LeadID', res.status);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const [selectedLevel, setSelectedLevel] = useState({ level: leadDetails.level } || null);
  const [selectedPriority, setSelectedPriority] = useState({ priority: values.priority } || null);
  const [selectedStatus, setSelectedStatus] = useState({ status: values.status } || null);
  const [selectedProjectName, setSelectedProjectName] = useState({ projectname: values.projectname } || null);
  const [selectedInternalDivison, setSelectedInternalDivision] = useState(
    { internal_division: values.internal_division } || null
  );
  const [selectedNextAction, setSelectedNextAction] = useState({ next_action: values.next_action } || null);
  const [selectedClassification, setSelectedClassification] = useState(
    { classification: values.classification } || null
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState({ company_name: values.company_name } || null);
  const [selectedCurrency, setSelectedCurrency] = useState({ currency: values.currency } || null);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  useEffect(() => {
    if (success) {
      enqueueSnackbar(success, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(setMsgNull());
    }
  }, [error]);

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
  }, [error]);

  useEffect(() => {
    dispatch(getListOfLevelAsync());
    dispatch(getListOfPriorityAsync());
    dispatch(getListOfStatusAsync());
    // dispatch(getListOfProjectNameAsync());
    dispatch(getListOfInternalDivisionAsync());
    dispatch(getListOfNextActionAsync());
    dispatch(getListOfClassificationAsync());
    dispatch(getListofComapanyNamesAsync());
    dispatch(getListOfCurrencyAsync());
    dispatch(getActiveStatusAsync());
  }, [dispatch, setFieldValue]);

  useEffect(() => {
    setactive(leadDetails.is_ACTIVE ? true : false);
  }, []);
  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Lead', href: PATH_DASHBOARD.crm.LeadEntryScreen },
            { name: 'Create' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(errors.company_name)}>
                        <InputLabel id="company_name-id">Company Name</InputLabel>
                        <Select
                          labelId="company_name-id"
                          id="company_name-id"
                          label="Company Name"
                          {...getFieldProps('company_name')}
                        >
                          {companynames.map((_x, i) => (
                            <MenuItem key={i} value={_x}>
                              {_x}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.company_name?.message}</FormHelperText>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Client Designation"
                        {...getFieldProps('client_designation')}
                        error={Boolean(touched.client_designation && errors.client_designation)}
                        helperText={touched.client_designation && errors.client_designation}
                      />
                      <TextField
                        fullWidth
                        label="Client Location"
                        {...getFieldProps('location')}
                        error={Boolean(touched.location && errors.location)}
                        helperText={touched.location && errors.location}
                      />
                      <TextField
                        fullWidth
                        label="CRM Representative"
                        // {...getFieldProps('state')}
                        // error={Boolean(touched.state && errors.state)}
                        // helperText={touched.state && errors.state}
                        value={authDetails.name}
                        disabled
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(errors.level)}>
                        <InputLabel id="level-id">Level</InputLabel>
                        <Select labelId="level-id" id="level-id" label="Level" {...getFieldProps('level')}>
                          {levels.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.level?.message}</FormHelperText>
                      </FormControl>
                      <TextField
                        fullWidth
                        label=" Project Name "
                        {...getFieldProps('projectname')}
                        error={Boolean(touched.projectname && errors.projectname)}
                        helperText={touched.projectname && errors.projectname}
                      />
                      <TextField
                        fullWidth
                        label="Additional details"
                        {...getFieldProps('additional_details')}
                        error={Boolean(touched.additional_details && errors.additional_details)}
                        helperText={touched.additional_details && errors.additional_details}
                      />
                      <TextField
                        fullWidth
                        label="Client Email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Contact Person Name"
                        {...getFieldProps('contact_person_name')}
                        error={Boolean(touched.contact_person_name && errors.contact_person_name)}
                        helperText={touched.contact_person_name && errors.contact_person_name}
                      />

                      <TextField
                        fullWidth
                        label="Contact Number"
                        {...getFieldProps('contact')}
                        error={Boolean(touched.contact && errors.contact)}
                        helperText={touched.contact && errors.contact}
                      />
                      <FormControl fullWidth error={Boolean(errors.internal_division)}>
                        <InputLabel id="internal_division-id">Internal Division</InputLabel>
                        <Select
                          labelId="internal_division-id"
                          id="internal_division-id"
                          label="Internal Division"
                          {...getFieldProps('internal_division')}
                        >
                          {internalDivisions.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.internal_division?.message}</FormHelperText>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Project Aprox value"
                        {...getFieldProps('project_approximate_value')}
                        error={Boolean(touched.project_approximate_value && errors.project_approximate_value)}
                        helperText={touched.project_approximate_value && errors.project_approximate_value}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(errors.currency)}>
                        <InputLabel id="currency-id">Currency</InputLabel>
                        <Select labelId="currency-id" id="currency-id" label="Currency" {...getFieldProps('currency')}>
                          {currencies.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.currency?.message}</FormHelperText>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Lead Source"
                        {...getFieldProps('lead_source')}
                        error={Boolean(touched.lead_source && errors.lead_source)}
                        helperText={touched.lead_source && errors.lead_source}
                      />
                      <TextField
                        fullWidth
                        label="Lead Qualified"
                        {...getFieldProps('lead_qualified')}
                        error={Boolean(touched.lead_qualified && errors.lead_qualified)}
                        helperText={touched.lead_qualified && errors.lead_qualified}
                      />
                      <TextField
                        fullWidth
                        label="Lead Mined By"
                        {...getFieldProps('lead_mined_by')}
                        error={Boolean(touched.lead_mined_by && errors.lead_mined_by)}
                        helperText={touched.lead_mined_by && errors.lead_mined_by}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth error={Boolean(errors.priority)}>
                        <InputLabel id="priority-id">Priority</InputLabel>
                        <Select labelId="priority-id" id="priority-id" label="Priority" {...getFieldProps('priority')}>
                          {priorities.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.priority?.message}</FormHelperText>
                      </FormControl>

                      <FormControl sx={{ width: 700 }} error={Boolean(errors.next_action)}>
                        <InputLabel id="next_action-id">Next Action</InputLabel>
                        <Select
                          labelId="next_action-id"
                          id="next_action-id"
                          label="Next Action"
                          {...getFieldProps('next_action')}
                        >
                          {nextactions.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.next_action?.message}</FormHelperText>
                      </FormControl>

                      <DatePicker
                        label="FollowUp Date"
                        value={values.follow_up_date}
                        inputFormat="dd/MM/yyyy"
                        disablePast
                        onChange={(newValue) => {
                          if (newValue) {
                            const parseddate = format(newValue, 'yyyy-MM-dd');
                            setFieldValue('follow_up_date', parseddate);
                          } else {
                            setFieldValue('follow_up_date', '');
                          }
                        }}
                        onChangeRaw={(e) => e.preventDefault()}
                        onKeyDown={(e) => e.preventDefault()}
                        renderInput={(params) => (
                          <Field
                            component={TextField}
                            size="small"
                            {...params}
                            style={{ width: 600 }}
                            label=" FollowUp Date"
                          />
                        )}
                      />

                      <TextField
                        fullWidth
                        label="Responsibility"
                        {...getFieldProps('responsibility')}
                        error={Boolean(touched.responsibility && errors.responsibility)}
                        helperText={touched.responsibility && errors.responsibility}
                      />
                    </Stack>

                    <Grid item xs={12} sm={12} md={12}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 12, sm: 2 }}
                        style={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between'
                        }}
                      >
                        <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                          <Autocomplete
                            id="status-id"
                            sx={{ width: 250 }}
                            defaultValue={values.status}
                            onChange={(_event, newValue) => {
                              if (newValue) {
                                setSelectedStatus(newValue);
                                setFieldValue('status', newValue.value);
                                console.log('status-newValue : ', newValue);
                                console.log('selected status value : ', selectedStatus);
                                if (newValue.value === 'Closed') {
                                  setStatusMonitor(true);
                                } else if (newValue.value === 'Open') {
                                  setStatusMonitor(false);
                                } else if (newValue.value === 'In-Progress') {
                                  setStatusMonitor(false);
                                } else if (newValue.value === 'Short Closed') {
                                  setStatusMonitor(false);
                                }
                              } else {
                                setSelectedStatus('');
                                setFieldValue('status', '');
                              }
                            }}
                            options={statuss}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                              ))
                            }
                            // getOptionSelected={(option, value) => option.value === value.value}
                            // isOptionEqualToValue={(option, value) => option.value === value.value}
                            getOptionLabel={(option) => option.value || values.status}
                            // onChange={(event, newValue) => field.onChange(newValue)}
                            // options={statuss.map((option) => option)}

                            renderInput={(params) => <Field component={TextField} {...params} label="Status" />}
                          />
                          <FormHelperText>{errors.status ? errors.status : null}</FormHelperText>
                        </FormControl>
                        {statusMonitor ? (
                          <DatePicker
                            label="Final Completion Date"
                            value={values.final_completion_date}
                            className="datePicker"
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');
                                setFieldValue('final_completion_date', parseddate);
                              } else {
                                setFieldValue('final_completion_date', '');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={isLoading}
                            renderInput={(params) => (
                              <Field
                                component={TextField}
                                size="large"
                                fullWidth
                                // style={{ width: 800 }}
                                {...params}
                                label="Final Completion Date"
                              />
                            )}
                          />
                        ) : (
                          <DatePicker
                            label="Final Completion Date"
                            value={values.final_completion_date}
                            className="datePicker"
                            inputFormat="dd/MM/yyyy"
                            disablePast
                            onChange={(newValue) => {
                              if (newValue) {
                                const parseddate = format(newValue, 'yyyy-MM-dd');
                                setFieldValue('final_completion_date', parseddate);
                              } else {
                                setFieldValue('final_completion_date', '');
                              }
                            }}
                            // onChangeRaw={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled
                            renderInput={(params) => (
                              <Field
                                component={TextField}
                                size="large"
                                // style={{ width: 800 }}
                                fullWidth
                                {...params}
                                label="Final Completion Date"
                              />
                            )}
                          />
                        )}

                        {/* <TextField
                          sx={{ width: 700 }}
                          label="Active / InActive"
                          {...getFieldProps('is_ACTIVE')}
                          error={Boolean(touched.is_ACTIVE && errors.is_ACTIVE)}
                          helperText={touched.is_ACTIVE && errors.is_ACTIVE}
                        /> */}

                        <div>
                          <Switch checked={active} onChange={handleActiveChange} />
                          {active ? 'Active' : 'Inactive'}
                        </div>

                        <TextField
                          sx={{ width: 1000 }}
                          label="Remarks/Reason"
                          {...getFieldProps('remarks')}
                          error={Boolean(touched.remarks && errors.remarks)}
                          helperText={touched.remarks && errors.remarks}
                        />
                      </Stack>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
                        Update Entry
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
