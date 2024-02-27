import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import searchFill from '@iconify/icons-eva/search-fill';
import baseThumbUp from '@iconify/icons-ic/baseline-thumb-up';
// import inProgress from '@iconify/icons-ic/baseline-thumb-down';
// import { Icon } from '@iconify/react';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Chip } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

// function onOpened() {
//   window.location.reload(false);
// }

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

ReqStatusList.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onOpened: PropTypes.func,
  onProcess: PropTypes.func,
  onClosed: PropTypes.func
};

export default function ReqStatusList({ numSelected, filterName, onFilterName, onOpened, onProcess, onClosed }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search Issue ..."
            startAdornment={
              <InputAdornment position="start">
                <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
          {/* {filterName && <Chip label={filterName} onDelete={handleDelete} />} */}
        </>
      )}

      {numSelected > 0 ? (
        <Stack direction="row" spacing={2}>
          <Tooltip title="Opened">
            <IconButton onClick={onOpened}>
              <Icon icon={baseThumbUp} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Inprogress">
            <IconButton onClick={onProcess}>
              <Icon icon="carbon:in-progress" />
            </IconButton>
          </Tooltip>{' '}
          <Tooltip title="Closed">
            <IconButton onClick={onClosed}>
              <Icon icon="ic:baseline-remove-done" />{' '}
            </IconButton>
          </Tooltip>{' '}
        </Stack>
      ) : null}
    </RootStyle>
  );
}
