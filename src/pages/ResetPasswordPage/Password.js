import React from 'react';
import { Avatar, Button, CssBaseline, TextField, Typography, Container, Box, Link, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router';

import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlinedIcon';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-unresolved
import { styled, makeStyles } from '@mui/styles';
// import LogoOnlyLayout from 'src/layouts/LogoOnlyLayout';
import { useSnackbar } from 'notistack';
// import { makeStyles } from '@mui/styles';
import HttpsIcon from '@mui/icons-material/Https';
import { resetPasswordAction } from '../../redux/slices/resetpasswordSlice';
import { PATH_AUTH } from '../../routes/paths';
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
    marginTop: theme.spacing(8),
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

export default function Password() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  console.log('first', token);

  // const token = new URLSearchParams(search).get('token');
  // const uidb64 = new URLSearchParams(search).get('uidb64');
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
        password: values.password,
        token
        // uidb64
      };
      dispatch(resetPasswordAction(payload))
        .then(() => {
          enqueueSnackbar('Password changed successfully', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          navigate(PATH_AUTH.login);
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
    <RootStyle title="Reset Password | TechStepHub">
      <LogoOnlyLayout />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <HttpsIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
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
                // value={values.password}
                // onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmpassword"
                label="Confirm Password"
                id="confirmpassword"
                // autoComplete="current-password"
                {...formik.getFieldProps('confirmpassword')}
                error={Boolean(formik.touched.confirmpassword && formik.errors.confirmpassword)}
                helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
                // value={values.confirmpasswordpassword}
                // onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                // onClick={handleUpdate}
              >
                Reset Password
              </Button>
              <Box
                sx={{
                  my: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <Link variant="subtitle2" to={PATH_AUTH.login} component={RouterLink}>
                  <IconButton color="primary" size="small">
                    Go to Login Page
                    <LoginOutlinedIcon />
                  </IconButton>
                </Link>
              </Box>
            </Form>
          </FormikProvider>
        </div>
      </Container>
    </RootStyle>
  );
}
