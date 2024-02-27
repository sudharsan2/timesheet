import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import projectRev from '@iconify/icons-eva/book-open-outline';
import uploadOutline from '@iconify/icons-eva/upload-outline';
import arrowOutline from '@iconify/icons-eva/arrowhead-down-outline';
import listFill from '@iconify/icons-eva/list-fill';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

ProjectMenu.propTypes = {
  projId: PropTypes.any,
  ProjIdCopy: PropTypes.any
};

export default function ProjectMenu({ projId, ProjIdCopy }) {
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
        {/* <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.project.editProject}/${projId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={28} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.review.editReview}/${projId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={projectRev} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="ProjectReview" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.project.exceptionDetails}/${projId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={arrowOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Exception" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.project.leaveUpload}/${projId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={uploadOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Leaveupload" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.project.leaveList}/${projId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={listFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="LeaveList" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
