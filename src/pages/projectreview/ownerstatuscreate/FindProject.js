import {
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Container,
  Card,
  Stack,
  FormLabel,
  RadioGroup,
  TextField,
  Box,
  InputLabel,
  Select,
  FormControlLabel,
  Radio,
  MenuItem
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import calendarOutline from '@iconify/icons-eva/arrowhead-right-fill';
import { Icon } from '@iconify/react';
import { DatePicker, LoadingButton } from '@mui/lab';
import Page from '../../../components/Page';
import useSettings from '../../../hooks/useSettings';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';

/* eslint-disable */

export default function FindProject() {
  const title = 'Status Entry';
  const { themeStretch } = useSettings();
  const calender = [{ value: 'ATA' }];
  const manager = [{ value: 'ERP' }];

  const token = localStorage.getItem('accessToken');

  const [selectedRadio, setSelectedRadio] = useState('Support');
  const [projectData, setProjectData] = useState([]);
  const [projId, setProjId] = useState();

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  useEffect(() => {
    setSelectedProjectId('');
    setSelectedProjectName('');

    const loggedInEmployeeId = localStorage.getItem('empId');

    console.log('local', loggedInEmployeeId);

    const isEmployeeF1194OrF1259 = loggedInEmployeeId === 'C112' || loggedInEmployeeId === 'F1259';

    const apiUrl = isEmployeeF1194OrF1259
      ? `https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/getTypeBasedProject/${selectedRadio}`
      : `https://techstephub.focusrtech.com:3030/techstep/api/AllProject/Service/ProjectOwnerList/${selectedRadio}`;

    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('Responce', res.data);
        setProjectData(res.data);
        const projectIds = res.data.map((project) => project.proj_Id);
        setProjId(projectIds);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, [selectedRadio]);

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState('');

  console.log('projif', projId);

  console.log('Hello', projectData);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Find Create Review' }]}
        />

        <Grid container spacing={3}>
          <Grid item xs={30} md={1}>
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {/* {touched.avatarUrl && errors.avatarUrl} */}
            </FormHelperText>
          </Grid>
          <Grid item xs={19} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={selectedRadio}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel value="Support" control={<Radio />} label="Support Project" />
                      <FormControlLabel value="Fixed" control={<Radio />} label="Fixed Bid" />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                {selectedRadio === 'Support' ? (
                  <div>
                    {' '}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Project Name</InputLabel>
                        <Select
                          // size="small"
                          labelId="Manager-type-label"
                          id="Manager-select"
                          label="Project Name"
                          name="Project Name"
                          // value={selectedProjectId}
                          onChange={(event) => {
                            const selectedName = event.target.value;
                            setSelectedProjectName(selectedName);
                            const selectedId =
                              projectData.find((project) => project.proj_Name === selectedName)?.proj_Id || '';
                            setSelectedProjectId(selectedId);
                          }}
                          // {...getFieldProps('project')}
                          // error={Boolean(touched.calendarName && errors.calendarName)}
                          // helperText={touched.calendarName && errors.calendarName}
                          // MenuProps={MenuProps}
                        >
                          {projectData.map((_x, i) => (
                            <MenuItem key={i} value={_x.proj_Name}>
                              {_x.proj_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        startIcon={<Icon icon={calendarOutline} />}
                        component={RouterLink}
                        // to={PATH_DASHBOARD.review.createReview}
                        to={`${PATH_DASHBOARD.review.createReview}/${selectedProjectId}`}
                        //   loading={isSubmitting || isLoading}
                        disabled={!selectedProjectId}
                      >
                        Enter Status
                      </LoadingButton>
                    </Box>
                  </div>
                ) : (
                  <div>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Project Name</InputLabel>
                        <Select
                          // size="small"
                          labelId="Manager-type-label"
                          id="Manager-select"
                          label="Project Name"
                          name="Project Name"
                          // value={selectedProjectId}
                          onChange={(event) => {
                            const selectedName = event.target.value;
                            setSelectedProjectName(selectedName);
                            const selectedId =
                              projectData.find((project) => project.proj_Name === selectedName)?.proj_Id || '';
                            setSelectedProjectId(selectedId);
                          }}
                          // {...getFieldProps('project')}
                          // error={Boolean(touched.calendarName && errors.calendarName)}
                          // helperText={touched.calendarName && errors.calendarName}
                          // MenuProps={MenuProps}
                        >
                          {projectData.map((_x, i) => (
                            <MenuItem key={i} value={_x.proj_Name}>
                              {_x.proj_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        startIcon={<Icon icon={calendarOutline} />}
                        component={RouterLink}
                        // to={PATH_DASHBOARD.review.createFixed}
                        to={`${PATH_DASHBOARD.review.createFixed}/${selectedProjectId}`}
                        //   loading={isSubmitting || isLoading}
                        disabled={!selectedProjectId}
                      >
                        Enter Status
                      </LoadingButton>
                    </Box>
                  </div>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
