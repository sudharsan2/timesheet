import { Link as ScrollLink } from 'react-scroll';
import { Outlet } from 'react-router-dom';
// material
import { Box, Link, Container, Typography } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
import MainNavbar from './MainNavbar';

// ----------------------------------------------------------------------

export default function MainLayout() {
  const companyName = process.env.REACT_APP_COMPANY_NAME;
  const companyWebsite = process.env.REACT_APP_COMPANY_WEBSITE;

  return (
    <>
      <MainNavbar />
      <div>
        <Outlet />
      </div>

      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          position: 'relative',
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <ScrollLink to="move_top" spy smooth>
            <Logo sx={{ mb: 1, mx: 'auto', cursor: 'pointer' }} />
          </ScrollLink>

          <Typography variant="caption" component="p">
            © All rights reserved
            <br /> made by &nbsp;
            <Link href={companyWebsite}>{companyName}</Link>
          </Typography>
        </Container>
      </Box>
    </>
  );
}
