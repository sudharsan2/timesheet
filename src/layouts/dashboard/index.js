import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);

  const location = useLocation();

  // Define the path of the specific page where you want to hide the DashboardNavbar
  const specificPagePath = '/techstep/dashboard/review/support-project-review/42/2023'; // Replace with the actual path

  // Check if the current location matches the specific page's path
  const isSpecificPage = location.pathname === specificPagePath;
  console.log('Current location:', location.pathname);
  console.log('Specific page path:', specificPagePath);

  return (
    <RootStyle>
      {!isSpecificPage && <DashboardNavbar onOpenSidebar={() => setOpen(true)} />}
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '102px'
          })
        }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
