import React from 'react';
import { Container, Stack, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';
import { createKpiKraActionAsync, getIsLoadingFromGroup } from '../../../redux/slices/timesheetSettingsSlice';

export default function KpiKraConfigurationCreate() {
  const { themeStretch } = useSettings();
  const title = 'KPI-KRA Master';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoadingFromGroup);

  const NewKpiKraSchema = Yup.object().shape({
    name: Yup.string().required('KPI Name is required'),
    description: Yup.string(),
    rating: Yup.number()
      .required('Rating is required')
      .max(100, 'Maximum number should be 100')
      .min(1, 'Minimum nuber should be 1')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      rating: ''
    },
    validationSchema: NewKpiKraSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        dispatch(createKpiKraActionAsync(values));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Created successfully', { variant: 'success' });
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
            { name: 'KPI-KRA Master', href: PATH_DASHBOARD.timesheet.kpiKraMaster },
            { name: 'Create' }
          ]}
        />
        <Card>
          <CardContent>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="KPI"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <TextField
                    fullWidth
                    label="Rating"
                    type="number"
                    {...getFieldProps('rating')}
                    error={Boolean(touched.rating && errors.rating)}
                    helperText={touched.rating && errors.rating}
                  />

                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting || isLoading}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
