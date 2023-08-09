/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Stack, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { getListOfCountries, updateCountryAction } from '../../../redux/slices/overTimeMasterSlice';

// eslint-disable-next-line react/prop-types
export default function OvertimeMasterEdit({ handleEditClose, editData }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewOvertimeSchema = Yup.object().shape({
    countryname: Yup.string().required('Country Name is required'),
    countrycode: Yup.string().required('Country Code is required'),
    totalworking: Yup.string().required('Total Working in a Month is required'),
    totalOthoursallowed: Yup.string().required('Total OverTime Working hours is allowed'),
    applybefore: Yup.string().required('Applied Before is required'),
    description: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      country_id: editData.country_id || '',
      countryname: editData.countryname || '',
      countrycode: editData.countrycode || '',
      totalworking: editData.total_working || '',
      totalOthoursallowed: editData.overtime_hours || '',
      applybefore: editData.applied_before || '',
      description: editData.description || ''
    },
    validationSchema: NewOvertimeSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('🚀 => values', values);
        const payload = {
          country_id: editData.country_id,
          countryname: values.countryname,
          countrycode: values.countrycode,
          total_working: values.totalworking,
          overtime_hours: values.totalOthoursallowed,
          applied_before: values.applybefore,
          description: values.description
        };
        console.log('🚀 => payload', payload);
        await dispatch(updateCountryAction(payload));
        await dispatch(getListOfCountries());
        resetForm();
        setSubmitting(false);
        handleEditClose();
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <div>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Country Name"
              {...getFieldProps('countryname')}
              error={Boolean(touched.countryname && errors.countryname)}
              helperText={touched.countryname && errors.countryname}
            />
            <TextField
              fullWidth
              label="Country Code"
              {...getFieldProps('countrycode')}
              error={Boolean(touched.countrycode && errors.countrycode)}
              helperText={touched.countrycode && errors.countrycode}
            />
            <TextField
              fullWidth
              label="Total Working in a month"
              {...getFieldProps('totalworking')}
              error={Boolean(touched.totalworking && errors.totalworking)}
              helperText={touched.totalworking && errors.totalworking}
            />
            <TextField
              fullWidth
              label="Total overtime Working hours allowed (in hrs per month)"
              {...getFieldProps('totalOthoursallowed')}
              error={Boolean(touched.totalOthoursallowed && errors.totalOthoursallowed)}
              helperText={touched.totalOthoursallowed && errors.totalOthoursallowed}
            />
            <TextField
              fullWidth
              label="Has to be applied before (in days)"
              {...getFieldProps('applybefore')}
              error={Boolean(touched.applybefore && errors.applybefore)}
              helperText={touched.applybefore && errors.applybefore}
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
          </Stack>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
              Save
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </div>
  );
}
