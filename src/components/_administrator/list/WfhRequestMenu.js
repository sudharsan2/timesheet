import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useRef, useState } from 'react';
import { PATH_DASHBOARD } from '../../../routes/paths';

WfhRequestMenu.propTypes = {
  id: PropTypes.string
};

export default function WfhRequestMenu({ id }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.travel.statusApproval}/${id}`}
          sx={{ color: 'text.secondary ' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          {/* <ListItemText primary="Action" primaryTypographyProps={{ variant: 'body2' }} /> */}
        </MenuItem>
      </Menu>
    </>
  );
}
