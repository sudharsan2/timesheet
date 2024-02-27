import React from 'react';
import { Container, Button, Stack, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import {
  getAllUsersFromGroups,
  getAllGroupsAsync,
  createGroupActionAsync,
  getIsLoadingFromGroup,
  getAllKpiKraActionAsync,
  getkkmasterDetailsFromTimesheetSettings
} from '../../redux/slices/timesheetSettingsSlice';
import KpiKraConfigurationList from './kpi-kra-configuration-components/KpiKraConfigurationList';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function KpiKraConfiguration() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const title = 'KPI-KRA Configuration';
  const [open, setOpen] = React.useState(false);

  const KkMaster = useSelector(getkkmasterDetailsFromTimesheetSettings);

  const NewGroupSchema = Yup.object().shape({
    name: Yup.string().required('Group Name is required'),
    description: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      kpiIds: []
    },
    validationSchema: NewGroupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('🚀 => values', values);
        dispatch(createGroupActionAsync({ ...values, kpiIds: values.kpiIds.map((_x) => _x && _x.id) }));
        resetForm();
        setSubmitting(false);
        handleClose();
        enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  const rows = useSelector(getAllUsersFromGroups);
  const isLoading = useSelector(getIsLoadingFromGroup);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    dispatch(getAllGroupsAsync());
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
            { name: 'KPI-KRA Configuration' }
          ]}
          action={
            <Button variant="contained" startIcon={<Icon icon={plusFill} />} onClick={handleClickOpen}>
              New Group
            </Button>
          }
        />
        <KpiKraConfigurationList rows={rows} isLoading={isLoading} />

        <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="add-new-group">
          <DialogTitle id="add-new-group">Add new group</DialogTitle>
          <DialogContent dividers>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Group Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="Kpi-Kra-Master-Id">Kpi-Kra Master</InputLabel>
                    <Select
                      labelId="Kpi-Kra-Master-Id"
                      id="Kpi-Kra-Master-multiple-checkbox"
                      multiple
                      {...getFieldProps('kpiIds')}
                      input={<OutlinedInput label="Kpi-Kra Master" />}
                      renderValue={(selected) => selected.map((_x) => _x && _x.name).join(', ')}
                      MenuProps={MenuProps}
                    >
                      {KkMaster.map((_x, i) => (
                        <MenuItem key={i} value={_x}>
                          <Checkbox checked={values.kpiIds.map((_x) => _x.id).indexOf(_x.id) > -1} />
                          <ListItemText primary={`(${_x.rating})${_x.name}`} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting || isLoading}
                  >
                    Save
                  </LoadingButton>
                </DialogActions>
              </Form>
            </FormikProvider>
          </DialogContent>
        </Dialog>
      </Container>
    </Page>
  );
}
