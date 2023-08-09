import React from 'react';
import { Container, Stack, TextField, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';

export default function TimesheetUserUpdateDetails() {
  const { themeStretch } = useSettings();
  const title = 'Timesheet User Configuration Update';

  const { enqueueSnackbar } = useSnackbar();
  const { employeeId } = useParams();
  console.log('🚀 => employeeId', employeeId);

  const configurationSchema = Yup.object().shape({
    reporting_manager_emp_id: Yup.string().required('Reporting manager is required'),
    kpi_kra_group_id: Yup.number().required('KPI-KRA Group is required')
  });

  const formik = useFormik({
    initialValues: {
      reporting_manager_emp_id: '',
      kpi_kra_group_id: ''
    },
    validationSchema: configurationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('🚀 => values', values);
        setSubmitting(false);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Settings', href: PATH_DASHBOARD.timesheet.settings },
            { name: 'Timesheet User Configurations', href: PATH_DASHBOARD.timesheet.timesheetUserConfigurations },
            { name: 'Update' }
          ]}
        />
        <Card>
          <CardContent>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField fullWidth label="Username" defaultValue="Monish" disabled />
                        <TextField fullWidth label="Name" defaultValue="Monish" disabled />
                        <TextField fullWidth label="Employee Id" defaultValue="M1130" disabled />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField fullWidth label="Email Id" defaultValue="monish.n@focusrtech.com" disabled />
                        <TextField fullWidth label="Role" defaultValue="Team member" disabled />
                        <FormControlLabel control={<Switch defaultChecked />} label="Status" disabled />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel id="reporting-manager">Reporting Manager</InputLabel>
                          <Select
                            {...getFieldProps('reporting_manager_emp_id')}
                            labelId="reporting-manager"
                            id="reporting-manager-id"
                            label="Reporting Manager"
                            error={Boolean(touched.reporting_manager_emp_id && errors.reporting_manager_emp_id)}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                          <FormHelperText>
                            {touched.reporting_manager_emp_id && errors.reporting_manager_emp_id}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel id="kpi-kra-group-name">KPI-KRA Group Name</InputLabel>
                          <Select
                            {...getFieldProps('kpi_kra_group_id')}
                            labelId="kpi-kra-group-name"
                            id="kpi-kra-group-name-id"
                            label="KPI-KRA Group Name"
                            error={Boolean(touched.kpi_kra_group_id && errors.kpi_kra_group_id)}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                          <FormHelperText>{touched.kpi_kra_group_id && errors.kpi_kra_group_id}</FormHelperText>
                        </FormControl>
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                          Save
                        </LoadingButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
