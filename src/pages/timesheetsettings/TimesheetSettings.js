import React from 'react';
import { Container, Grid } from '@mui/material';
import ApiIcon from '@mui/icons-material/Api';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Tiles from '../../components/Tiles';

const settings = [
  {
    id: 1,
    icon: <ApiIcon />,
    path: PATH_DASHBOARD.timesheet.kpiKraConfigurations,
    name: 'KPI-KRA Configuration'
  },
  {
    id: 2,
    icon: <ListAltIcon />,
    path: PATH_DASHBOARD.timesheet.kpiKraMaster,
    name: 'KPI-KRA Master'
  }
  // {
  //   id: 3,
  //   icon: <ListAltIcon />,
  //   path: PATH_DASHBOARD.timesheet.leaveMasterSettings,
  //   name: 'Leave Policy'
  // },
  // {
  //   id: 3,
  //   icon: <ListAltIcon />,
  //   path: PATH_DASHBOARD.timesheet.overtimeMasterSettings,
  //   name: 'Overtime Policy'
  // },
  // {
  //   id: 5,
  //   icon: <ListAltIcon />,
  //   path: PATH_DASHBOARD.timesheet.projectMaster,
  //   name: 'Project Master'
  // }
];

export default function TimesheetSettings() {
  const { themeStretch } = useSettings();
  const title = 'Timesheet Settings';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Timesheet Settings' }]}
        />
        <Grid container spacing={7}>
          {settings.map((_x, i) => (
            <Grid key={i} item xs={12} sm={6} md={2}>
              <Tiles icon={_x.icon} path={_x.path} name={_x.name} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
