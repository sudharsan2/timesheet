import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Stack, Avatar, Drawer, Tooltip, Typography, CardActionArea } from '@mui/material';
import jwtdecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import { MHidden } from '../../components/@material-extend';
import {
  sidebarConfig,
  userSidebarConfig,
  managerCRMSidebar,
  userCRMSidebar,
  CRMandManagerSidebar,
  ManagerRepSidebar,
  travelRequest,
  pmoExcecutive,
  roleManager
} from './SidebarConfig';
import { getUserDetailsFromAuth } from '../../redux/slices/authSlice';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 270;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

// ----------------------------------------------------------------------

IconCollapse.propTypes = {
  onToggleCollapse: PropTypes.func,
  collapseClick: PropTypes.bool
};

function IconCollapse({ onToggleCollapse, collapseClick }) {
  return (
    <Tooltip title="Mini Menu">
      <CardActionArea
        onClick={onToggleCollapse}
        sx={{
          width: 18,
          height: 18,
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '50%',
          alignItems: 'center',
          color: 'text.primary',
          justifyContent: 'center',
          border: 'solid 1px currentColor',
          ...(collapseClick && {
            borderWidth: 2
          })
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'currentColor',
            transition: (theme) => theme.transitions.create('all'),
            ...(collapseClick && {
              width: 0,
              height: 0
            })
          }}
        />
      </CardActionArea>
    </Tooltip>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const authDetails = useSelector(getUserDetailsFromAuth);
  const { role } = authDetails ? jwtdecode(authDetails.accessToken) : {};
  // const config = role === 'ROLE_TEAM_MEMBER' || role === 'ROLE_SALES' ? userSidebarConfig : sidebarConfig;

  const config = (() => {
    switch (true) {
      case role === 'CRM_REPRESENTATIVE':
        return userCRMSidebar;
      case role === 'CRM_MANAGER':
        return managerCRMSidebar;
      case role === 'ROLE_TEAM_MEMBER' || role === 'ROLE_SALES':
        return userSidebarConfig;
      case role === 'ROLE_MANAGER AND CRM_MANAGER':
        return CRMandManagerSidebar;
      case role === 'TEAM_MEMBER AND CRM_REP':
        return userCRMSidebar;
      case role === 'ROLE_SALES AND CRM_REPRESENTATIVE':
        return userCRMSidebar;
      case role === 'ROLE_MANAGER AND CRM_REPRESENTATIVE':
        return ManagerRepSidebar;
      case role === 'ROLE_TEAM MEMBER AND TRAVEL_APPROVER':
        return travelRequest;
      case role === 'PMO_EXCECUTIVE':
        return pmoExcecutive;
      case role === 'ROLE_MANAGER':
        return roleManager;
      default:
        return sidebarConfig;
    }
  })();

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
            <Logo />
          </Box>

          <MHidden width="lgDown">
            {!isCollapse && <IconCollapse onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />}
          </MHidden>
        </Stack>

        {isCollapse ? (
          <Avatar
            alt="My Avatar"
            src={`${process.env.PUBLIC_URL}/static/mock-images/avatars/avatar_default.jpg`}
            sx={{ mx: 'auto', mb: 2 }}
          />
        ) : (
          <Link underline="none" component={RouterLink} to="#">
            <AccountStyle>
              <Avatar alt="My Avatar" src={`${process.env.PUBLIC_URL}/static/mock-images/avatars/avatar_default.jpg`} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {authDetails && authDetails.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {authDetails && authDetails.designation}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        )}
      </Stack>

      <NavSection navConfig={config} isShow={!isCollapse} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
