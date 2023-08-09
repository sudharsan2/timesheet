import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Box,
  Link,
  IconButton,
  Card
} from '@mui/material';
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
import React, { useState, useEffect } from 'react';
// import { makeStyles } from '@mui/styles';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import axios from 'axios';
import { resetPasswordAction } from '../../redux/slices/resetpasswordSlice';
import { postAckAsync } from '../../redux/slices/taskSlice';
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
    margin: theme.spacing(2)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));
export default function Acknowledge() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jtoken, setJToken] = useState('');
  const [empId, setEmpId] = useState('');
  const [oldId, setOldId] = useState('');
  const [newId, setNewId] = useState('');
  const { token } = useParams();
  console.log('first', token);
  const { resetToken } = useParams();
  console.log('sec', resetToken);
  const { employeeId } = useParams();
  const { oldManagerId } = useParams();
  const { newManagerId } = useParams();
  console.log('sec', employeeId);
  console.log('sec', oldManagerId);
  console.log('sec', newManagerId);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/techstep/auth/service/postAck/${resetToken}/${employeeId}/${oldManagerId}/${newManagerId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        console.log('this is response data', res.data);
        setJToken(res.data.message);
      })
      .catch((err) => {
        console.log('Error', err);
      });

    console.log('local stroage', JSON.parse(localStorage.getItem('Details')));
  }, []);

  console.log('543', jtoken);

  // const token = new URLSearchParams(search).get('token');
  // const uidb64 = new URLSearchParams(search).get('uidb64');

  return (
    <RootStyle title="Reset Password | TechStepHub">
      <LogoOnlyLayout />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card>
          <div className={classes.paper}>
            {/* <Avatar
              sx={{ width: '20%', height: '20%' }}
              src={`${process.env.PUBLIC_URL}/static/icons/animation_ll0urdml_large.gif`}
            /> */}
            <Avatar
              sx={{ width: '10%', height: '10%' }}
              src={`${process.env.PUBLIC_URL}/static/icons/animation_ll196430_large.gif`}
            />
            <Typography component="h1" variant="h5">
              {jtoken}
            </Typography>
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
          </div>
        </Card>
      </Container>
    </RootStyle>
  );
}
