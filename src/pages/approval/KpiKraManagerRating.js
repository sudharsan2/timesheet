import React from 'react';
import { Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import KpiKraManagerRatingList from './KpiKraManagerRatingComponents/KpiKraManagerRatingList';
import { getkpiAndKraManagerList, getAllKpiKraForTheManagerActionAsync } from '../../redux/slices/kpiKraSlice';

export default function KpiKraManagerRating() {
  const { themeStretch } = useSettings();
  const title = 'KPI-KRA Manager Rating';

  const dispatch = useDispatch();
  const rows = useSelector(getkpiAndKraManagerList);

  React.useEffect(() => {
    dispatch(getAllKpiKraForTheManagerActionAsync());
  }, [dispatch]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'KPI-KRA Manager Rating' }]}
        />
        <KpiKraManagerRatingList rows={rows} isLoading={false} />
      </Container>
    </Page>
  );
}
