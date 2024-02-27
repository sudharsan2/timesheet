import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { getListofRemarksAsync } from '../../redux/slices/taskSlice';

TaskHistory.propTypes = {
  isViewOpen: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired
};

export default function TaskHistory({ isViewOpen, setView }) {
  const params = useParams();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { remarks } = useSelector((state) => state.task);
  console.log('wayfh', remarks);
  const dispatch = useDispatch();

  const handlePreview = (row) => {
    setView(true);
  };

  const [view, setNewView] = useState(false);

  useEffect(() => {
    console.log('this is param value', params.managerId);
    dispatch(getListofRemarksAsync(params.managerId));
    setNewView(true);
  }, []);

  return (
    <Dialog fullScreen={fullScreen} minWidth="lg" open={view} aria-labelledby="epic-preview">
      <DialogTitle id="epic-preview">History</DialogTitle>
      <DialogContent>
        {remarks.map((_x, i) => (
          <MenuItem key={i} value={_x.remarks_name}>
            {_x.updatedAt}
            <br />

            {_x.remarks_history}
            <br />
            {_x.remarks_name}
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
  );
}
