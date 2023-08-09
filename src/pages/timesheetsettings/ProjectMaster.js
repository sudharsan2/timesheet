import React from 'react';
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { getIsLoadingFromTS, getProjectLOVAsync, getProjectLOVFromTS } from '../../redux/slices/timesheetSlice';
import ProjectMasterList from './ProjectMasterComponents/ProjectMasterList';

export default function ProjectMaster() {
  const { themeStretch } = useSettings();
  const title = 'Project Master';

  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoadingFromTS);
  const rows = useSelector(getProjectLOVFromTS);
  console.log(rows);

  React.useEffect(() => {
    dispatch(getProjectLOVAsync());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Settings', href: PATH_DASHBOARD.timesheet.settings },
            { name: 'Project Master' }
          ]}
          //   action={
          //     <Button
          //       variant="contained"
          //       component={RouterLink}
          //       to={PATH_DASHBOARD.timesheet.projectMasterCreate}
          //       startIcon={<Icon icon={plusFill} />}
          //     >
          //       Configure
          //     </Button>
          //   }
        />
        <ProjectMasterList rows={rows} isLoading={isLoading} />
      </Container>
    </Page>
  );
}
