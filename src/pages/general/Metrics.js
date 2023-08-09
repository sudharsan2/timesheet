import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid } from '@mui/material';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import AppWelcome from '../../components/_external-pages/dashboard/AppWelcomeMessage';
import { getUserDetailsFromAuth } from '../../redux/slices/authSlice';

export default function Metrics() {
  const { themeStretch } = useSettings();
  const title = 'Metrics';

  const user = useSelector(getUserDetailsFromAuth);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user && user.name} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
