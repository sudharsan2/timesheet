import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

AssetMoreMenu.propTypes = {
  assetCategory: PropTypes.any
};

export default function AssetMoreMenu({ assetCategory }) {
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
          to={`${PATH_DASHBOARD.admin.assetEdit}/${assetCategory}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
        //   component={RouterLink}
        //   to={`${PATH_DASHBOARD.admin.assetEdit}/${assetCategory}`}
        //   sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>{/* <Icon icon="ant-design:delete-twotone" width={24} height={24} /> */}</ListItemIcon>
          {/* <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} /> */}
        </MenuItem>
        <MenuItem component={RouterLink} to={PATH_DASHBOARD.admin.assetHistory} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon="carbon:view-filled" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="History" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
