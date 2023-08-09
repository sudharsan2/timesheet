import React from 'react';
import { Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import KpiKraMasterList from './kpi-kra-master-components/KpiKraMasterList';
import {
  getIsLoadingFromGroup,
  getAllKpiKraActionAsync,
  getkkmasterDetailsFromTimesheetSettings
} from '../../redux/slices/timesheetSettingsSlice';

export default function KpiKraMaster() {
  const { themeStretch } = useSettings();
  const title = 'KPI-KRA Master';

  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoadingFromGroup);
  const rows = useSelector(getkkmasterDetailsFromTimesheetSettings);

  React.useEffect(() => {
    dispatch(getAllKpiKraActionAsync());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Settings', href: PATH_DASHBOARD.timesheet.settings },
            { name: 'KPI-KRA Master' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.timesheet.kpiKraMasterCreate}
              startIcon={<Icon icon={plusFill} />}
            >
              Configure
            </Button>
          }
        />
        <KpiKraMasterList rows={rows} isLoading={isLoading} />
      </Container>
    </Page>
  );
}
