import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

TaskNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function TaskNotFound({ ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        No task created yet!
      </Typography>
      <Typography variant="body2" align="center">
        Select a date and create a task and then save it.
      </Typography>
    </Paper>
  );
}
