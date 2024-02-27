import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRemarksHistoryAsync } from '../../redux/slices/leadSlice';

History.propTypes = {
  isViewOpen: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired
};

export default function History({ isViewOpen, setView }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { remarks } = useSelector((state) => state.lead);
  console.log('wayfh', remarks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRemarksHistoryAsync());
  }, []);

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="lg"
      open={isViewOpen}
      onClose={() => setView(!isViewOpen)}
      aria-labelledby="epic-preview"
    >
      <DialogTitle id="epic-preview">History</DialogTitle>
      <DialogContent>
        {remarks.map((_x, i) => (
          <MenuItem key={i} value={_x.remarks_name}>
            {_x.remarks}
            <br />
            {_x.lead_id}
            <br />
            {_x.crm_representative}
            <br />
            {_x.createdAt}
          </MenuItem>
        ))}
      </DialogContent>
    </Dialog>
  );
}
