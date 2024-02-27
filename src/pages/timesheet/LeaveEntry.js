import React from 'react';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';

export default function LeaveEntry() {
  const { themeStretch } = useSettings();
  const title = 'Leave Application';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Leave Application' }]}
        />
        <span>Leave</span>
      </Container>
    </Page>
  );
}
