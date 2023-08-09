import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, FormHelperText, MenuItem, IconButton, Button } from '@mui/material';
import Axios from 'axios';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { PATH_DASHBOARD } from '../../routes/paths';
import { getRemarksHistoryAsync } from '../../redux/slices/leadSlice';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';

Remarks.propTypes = {
  isViewOpen: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired
};

export default function Remarks({ isViewOpen, setView }) {
  const params = useParams();
  const { themeStretch } = useSettings();
  const title = ' Remarks';
  const [post, setPost] = useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { remarks } = useSelector((state) => state.lead);
  console.log('wayfh', remarks);
  const dispatch = useDispatch();

  const handlePreview = (row) => {
    setView(true);
  };

  const [view, setNewView] = useState(false);

  useEffect(() => {
    console.log('this is param value', params.lead_id);
    dispatch(getRemarksHistoryAsync(params.lead_id));
    setNewView(true);
  }, []);

  return (
    <Dialog fullScreen={fullScreen} maxWidth="200" open={view} aria-labelledby="epic-preview">
      <DialogTitle id="epic-preview">History</DialogTitle>
      <DialogContent>
        {remarks.map((_x, i) => (
          <MenuItem key={i} value={_x.remarks_name}>
            {_x.remarks}
            <br />
            {/* {_x.lead_id} */}
            {/* <br /> */}
            {_x.crm_representative}
            <br />

            {String(_x.createdAt).slice(0, 10)}
          </MenuItem>
        ))}
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          close
        </Button>
      </DialogContent>
    </Dialog>
    //   </Container>
    // </Page>
  );
}
