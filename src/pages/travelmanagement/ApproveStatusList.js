import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  DialogContentText,
  List,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  useMediaQuery
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { MIconButton } from '../../components/@material-extend';
// import { getRecruiterFromUser, getRecruiterNamesAsync } from '../../redux/slices/userSlice';
// import { UserListHead } from 'src/components/_administrator/list';
// import ErrorCustom from '../error/Customerror';

// ---------------------------------------------------------------------

ApprovalListToolbar.propTypes = {
  setView: PropTypes.func.isRequired
};

export default function ApprovalListToolbar() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [view, setNewView] = useState(false);
  //   const recruiter = useSelector(getAllRecFromUser);
  const [Salert, setAlert] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [resumeId, setResumeId] = useState('');
  const [id, setId] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const { managerList: userList } = useSelector((state) => state.project);
  console.log('list', userList);

  const statusList = [{ value: 'OPENED' }, { value: 'BOOKED' }, { value: 'CANCELLED' }];

  // const savefile = userList.find((val) => {
  //   console.log('kijhgfd', userList);
  //   return val.ticketid === params.ticketid;
  // });
  // console.log('first', savefile.savefile);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const NewGroupSchema = Yup.object().shape({
    resume_id: Yup.string().required('Resume Id is required'),
    assign_to: Yup.array().required('Assign To is required')
  });

  useEffect(() => {
    setNewView(true);
  }, []);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get(
        // "http://66.85.137.50:5050/eprocurement/api/Users/Service/getListOfUsers",
        'https://secure.focusrtech.com:3030/techstep/api/Travel/Service/getListOfAllTravelDetails',
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prefer-template
            Authorization: 'Bearer ' + token
          }
        }
      )
      /*eslint-disable*/
      .then((res) => {
        localStorage.removeItem('travelID');
        console.log('this is response data', res.data);
        console.log('this is fullname from params', params);
        // const travelId = res.data.map((x, i) => x.travel_id == params.travel_id);

        const travelId = res.data.filter((val) => {
          return val.travel_id == params.travel_id;
        });
        console.log('travelId', travelId);
        localStorage.setItem('travelID', JSON.stringify(travelId));

        // const newAr = res.data.filter((val) => {
        //   console.log('sdfgh', val.travel_id);
        //   return val.travel_id === params.travel_id;
        // });
        // console.log('this is current user id', newAr[0].travel_id);
        // console.log('this is newAr', newAr);
        // setId(params.travel_id);
        // // setId(newAr[0].id);
        // setResumeId(newAr[0].travel_id);
        // console.log('dfghj', newAr[0].travel_id);
        // // console.log('resume id', resumeId);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  const sendData = () => {
    if (assignTo === '') {
      setAlert(true);
      console.log('Semd ', sendData);
    } else {
      console.log('hhhhhhh', JSON.parse(localStorage.getItem('travelID'))[0].travel_id);
      axios
        .put(
          // "http://66.85.137.50:5050/eprocurement/api/auth/signup",
          'https://secure.focusrtech.com:3030/techstep/api/Travel/Service/changeStatusAdmin',
          [
            {
              // id: projectDetails.id || '',
              travel_id: String(JSON.parse(localStorage.getItem('travelID'))[0].travel_id),
              status: String(assignTo)
            }
          ],
          {
            headers: {
              'Content-Type': 'application/json',
              // eslint-disable-next-line prefer-template
              Authorization: 'Bearer ' + token
            }
          }
        )
        .then((res) => {
          console.log('Ok', res.data);
          enqueueSnackbar('Assigned Successfully', {
            autoHideDuration: 1000,
            variant: 'success'
          });
          setSuccess(true);
          console.log('response status', res.status);
          window.history.back();
        })
        .catch((er) => {
          console.log('error accquired', er.response.data.message);
          enqueueSnackbar(er.response.data.message, {
            autoHideDuration: 1000,
            variant: 'error'
          });
          console.log('new error', er);
        });
    }
    // navigate(PATH_DASHBOARD.travel.reqStatus);
  };

  return (
    <Dialog fullScreen={fullScreen} open={view} aria-labelledby="epic-preview">
      <DialogTitle id="epic-preview" sx={{ marginBottom: '10%' }}>
        HR Status
      </DialogTitle>
      <DialogContent>
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ marginBottom: '7%' }} spacing={{ xs: 3, sm: 2 }}>
          <TextField
            sx={{
              width: '100%'
            }}
            value={id}
            onChange={(e) => setId(e.target.value)}
            label="EMail Id"
            placeholder="Enter email id"
            helperText={
              id === '' ? (
                <p
                  style={{
                    color: '#b71c1c'
                  }}
                >
                  {`id ${ErrorCustom.Required}`}
                </p>
              ) : null
            }
          />
        </Stack> */}
        <FormControl fullWidth>
          <InputLabel id="assign-type-label">Status</InputLabel>
          <Select
            labelId="assign-type-label"
            id="assign-select"
            label="Status"
            name="Status"
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            // MenuProps={MenuProps}
          >
            {statusList.map((_x, i) => (
              <MenuItem key={i} value={_x.value}>
                {_x.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>{' '}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          back
        </Button>{' '}
        <Button
          type="submit"
          variant="contained"
          onClick={sendData}
          // onClick={() => {
          //   window.history.back();
          // }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
