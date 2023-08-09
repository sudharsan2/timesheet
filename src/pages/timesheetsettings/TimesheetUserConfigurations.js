import React from 'react';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import TimesheetUserDetailsList from './timesheet-user-configurations-components/TimesheetUserDetailsList';

export default function TimesheetUserConfigurations() {
  const { themeStretch } = useSettings();
  const title = 'Timesheet User Configurations';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Settings', href: PATH_DASHBOARD.timesheet.settings },
            { name: 'Timesheet User Configurations' }
          ]}
        />
        <TimesheetUserDetailsList
          rows={[
            {
              id: 5,
              username: 'navinuser',
              name: 'navin kumar',
              employeeId: 'M1019',
              email: 'navin@dgmail.com',
              roleId: 3,
              roleDescription: 'Sales executive',
              avatarUrl: '',
              isActive: 'Y'
            }
          ]}
          isLoading={false}
        />
      </Container>
    </Page>
  );
}
