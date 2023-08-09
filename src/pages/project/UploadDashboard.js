import { Container, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import Tiless from '../../components/Tiless';

export default function UploadDashboard() {
  const title = 'Upload Details';
  const { themestretch } = useSettings();

  const settings = [
    {
      id: 1,
      icon: <UploadFileIcon />,
      path: PATH_DASHBOARD.project.uploadPaysquare,
      name: 'Upload PaySquare'
    },
    {
      id: 2,
      icon: <UploadFileIcon />,
      path: PATH_DASHBOARD.project.uploadBiometric,
      name: 'Upload BioMetric'
    }
  ];

  return (
    <Page title={title}>
      <Container maxWidth={themestretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Upload Details' }]}
        />
        <Grid container spacing={60}>
          {settings.map((_x, i) => (
            <Grid key={i} item xs={12} sm={12} md={2}>
              <Tiless icon={_x.icon} path={_x.path} name={_x.name} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
