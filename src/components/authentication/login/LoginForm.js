import * as Yup from 'yup';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Link, Stack, Alert, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLoginDetailsAsync,
  getIsLoadingFromAuth,
  getIsAuthenticatedFromAuth,
  getErrorFromAuth,
  getIsAssetDetailsCaptured
} from '../../../redux/slices/authSlice';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoadingFromAuth);
  const isAuthenticated = useSelector(getIsAuthenticatedFromAuth);
  const isAssetDetailsCaptured = useSelector(getIsAssetDetailsCaptured);
  const isError = useSelector(getErrorFromAuth);

  const LoginSchema = Yup.object().shape({
    usernameOremployeeId: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      usernameOremployeeId: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        dispatch(fetchLoginDetailsAsync(values));

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.message });
        }
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAssetDetailsCaptured) {
        navigate(PATH_AUTH.assetCapture); // Redirect to asset capture screen
      } else {
        navigate(PATH_DASHBOARD.general.root);
      }

      enqueueSnackbar('Login success', {
        variant: 'success',
        action: (key) => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        )
      });
    }
  }, [closeSnackbar, enqueueSnackbar, isAssetDetailsCaptured, isAuthenticated, navigate]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {isError !== '' && <Alert severity="error">{isError}</Alert>}

          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Username"
            {...getFieldProps('usernameOremployeeId')}
            error={Boolean(touched.usernameOremployeeId && errors.usernameOremployeeId)}
            helperText={touched.usernameOremployeeId && errors.usernameOremployeeId}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isLoading}
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
