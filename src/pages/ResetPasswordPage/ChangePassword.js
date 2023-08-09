import React from 'react';
import { Button, CssBaseline, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router';

import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlinedIcon';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-unresolved
import { styled, makeStyles } from '@mui/styles';
// import LogoOnlyLayout from 'src/layouts/LogoOnlyLayout';
import { useSnackbar } from 'notistack';

// eslint-disable-next-line import/no-unresolved
// import { makeStyles } from '@mui/styles';
// eslint-disable-next-line import/no-unresolved
import { updatePasswordAction } from 'src/redux/slices/resetpasswordSlice';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
import { MIconButton } from '../../components/@material-extend';

// import { confirmPassword } from '~/redux/actions/authenticationAction';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8, 0)
  // backgroundColor: theme.palette.secondary.lighter
}));

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function ChangePassword() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    password: '',
    confirmpassword: ''
  };

  const PasswordSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, actions) => {
      const payload = {
        password: values.password
      };
      dispatch(updatePasswordAction(payload))
        .then(() => {
          enqueueSnackbar('Password changed successfully', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          navigate(PATH_DASHBOARD.general.root);
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

      actions.resetForm({
        values: initialValues
      });
    },
    validationSchema: PasswordSchema
  });

  return (
    <RootStyle title="Change Password | TechStepHub">
      <LogoOnlyLayout />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                autoFocus
                {...formik.getFieldProps('password')}
                error={Boolean(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmpassword"
                label="Confirm Password"
                id="confirmpassword"
                {...formik.getFieldProps('confirmpassword')}
                error={Boolean(formik.touched.confirmpassword && formik.errors.confirmpassword)}
                helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                Change Password
              </Button>
            </Form>
          </FormikProvider>
        </div>
      </Container>
    </RootStyle>
  );
}
