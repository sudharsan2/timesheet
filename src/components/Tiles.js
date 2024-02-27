import { alpha, Card, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

// utils
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  cursor: 'pointer',
  width: theme.spacing(20),
  height: theme.spacing(20),
  padding: theme.spacing(1, 5),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter,
  ':hover': {
    backgroundColor: 'warning.light',
    opacity: [0.9, 0.8, 0.7]
  }
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(9),
  height: theme.spacing(9),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

Tiles.propTypes = {
  icon: PropTypes.node,
  path: PropTypes.string,
  name: PropTypes.string
};

export default function Tiles({ icon, path, name }) {
  const navigate = useNavigate();

  return (
    <RootStyle onClick={() => navigate(path, { replace: true })}>
      <IconWrapperStyle>
        {/* <GroupsOutlinedIcon sx={{ width: 35, height: 35 }} /> */}
        {icon}
      </IconWrapperStyle>
      <Typography variant="subtitle1" gutterBottom sx={{ opacity: 0.72 }}>
        {name}
      </Typography>
    </RootStyle>
  );
}
