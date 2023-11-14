/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-template */
/* eslint-disable react/self-closing-comp */
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Card,
  Grid,
  InputLabel,
  Container,
  MenuItem,
  Radio,
  RadioGroup,
  FormHelperText,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  createTheme
} from '@mui/material';
import saveAs from 'file-saver';
import React, { useEffect, useState } from 'react';
import calendarOutline from '@iconify/icons-eva/download-outline';
import axios from 'axios';
import { ArrowRightAlt } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';

// Create a Custom Theme
const customTheme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    }
  }
});

export default function Report() {
  const [selectedValue, setSelectedValue] = useState('Support');
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [projectData, setProjectData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [review_Status, setReviewStatus] = useState('N'); // Initialize to 'N'
  const [projId, setProjId] = useState();
  const [weekNumber, setWeekNumber] = useState('');
  const [weekNumberTo, setWeekNumberTo] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = React.useState(false);
  const [loadings, setLoadings] = React.useState(false);

  const handleChangeRadio = (event) => {
    setSelectedValue(event.target.value);
  };
  const title = 'Reports';
  const handleCheckboxChange = (event) => {
    const valueToSend = event.target.checked ? 'Y' : 'N';
    setIsChecked(event.target.checked);
    setReviewStatus(event.target.checked ? 'Y' : 'N'); // Update review_Status based on checkbox state
    console.log(valueToSend);
  };

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    setSelectedProjectId('');
    setSelectedProjectName('');

    axios
      .get(
        `https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/getIdTypeBasedProject/${selectedValue}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then((res) => {
        console.log('Response', res.data);
        setProjectData(res.data);
        const projectIds = res.data.map((project) => project.proj_Id);
        setProjId(projectIds);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, [selectedValue]);

  const postAndGetExcel = (payload, token) => {
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`
    };
    // Make a POST request to the API to get the Excel file
    axios
      .post('https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/getDailyReviewReport', payload, {
        responseType: 'arraybuffer', // Ensure binary response
        headers: headers // Include the headers with the token
      })

      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Report.xlsx'; // Specify the desired file name
        a.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error downloading Excel file:', error);
        enqueueSnackbar('Unable to get Review report data! Data not found', {
          autoHideDuration: 3000,
          variant: 'error'
        });
        setLoading(false);
      });
  };

  const handleDownload = () => {
    if (isChecked) {
      // Payload for "From to Till" scenario
      const payload = {
        projectType: selectedValue,
        projectName: selectedProjectName,
        projectFromtoTill: review_Status
      };
      postAndGetExcel(payload, token);
    } else {
      // Payload for "FromWeekNo to ToWeekNo" scenario
      const payload = {
        projectType: selectedValue,
        projectName: selectedProjectName,
        projectFromtoTill: review_Status,
        fromWeekNo: weekNumber,
        toWeekNo: weekNumberTo,
        year: 2023
      };
      postAndGetExcel(payload, token);
    }
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const getdownload = async () => {
    setLoadings(true);
    try {
      const response = await axios.get(
        `https://techstephub.focusrtech.com:6060/techstep/api/Project/Service/generatemilestone/${selectedProjectName}`,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // if (response.status !== 200) {
      //   console.error('Unable to get Review report data!Project not found');
      //   return;
      // }

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], {
        type: contentType
      });
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'Milestone.xlsx';
      saveAs(blob, filename);
    } catch (error) {
      console.error('Network error:', error.message);
      enqueueSnackbar('Unable to get Review report data!Project not found', {
        autoHideDuration: 3000,
        variant: 'error'
      });
    }
    setLoadings(false);
  };

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Download' }]}
        />

        <Grid container spacing={3}>
          <Grid item xs={30} md={1}>
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {/* {touched.avatarUrl && errors.avatarUrl} */}
            </FormHelperText>
          </Grid>
          <Grid item xs={19} md={6}>
            <Card sx={{ p: 2, mt: -3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={selectedValue}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel value="Support" control={<Radio />} label="Support Project" />
                      <FormControlLabel value="Fixed" control={<Radio />} label="Fixed Bid" />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                {selectedValue === 'Support' ? (
                  <div>
                    {' '}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Project Name</InputLabel>
                        <Select
                          labelId="Manager-type-label"
                          id="Manager-select"
                          label="Project Name"
                          name="Project Name"
                          size="small"
                          onChange={(event) => {
                            const selectedName = event.target.value;
                            setSelectedProjectName(selectedName);
                          }}
                        >
                          {projectData.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack spacing={3}>
                      <Stack>
                        <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                          <FormControlLabel
                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                            label="From to Till"
                          />
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={30} sx={{ mt: 2 }}>
                            <div sx={{ display: 'flex', alignItems: 'center' }}>
                              <TextField
                                style={{ width: '60px' }}
                                size="small"
                                id="outlined-number"
                                label="FROM"
                                type="number"
                                disabled={isChecked}
                                value={weekNumber}
                                onChange={(e) => setWeekNumber(e.target.value)}
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                              <ArrowRightAlt sx={{ margin: '0 8px' }} />
                              <TextField
                                style={{ width: '60px' }}
                                size="small"
                                id="outlined-number"
                                label="TO"
                                disabled={isChecked}
                                type="number"
                                value={weekNumberTo}
                                onChange={(e) => setWeekNumberTo(e.target.value)}
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                            </div>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        loading={loading}
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        variant="contained"
                        onClick={handleDownload}
                        startIcon={<Icon icon={calendarOutline} />}
                      ></LoadingButton>
                    </Box>
                  </div>
                ) : (
                  <div>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="Calendar-type-label">Project Name</InputLabel>
                        <Select
                          size="small"
                          labelId="Manager-type-label"
                          id="Manager-select"
                          label="Project Name"
                          name="Project Name"
                          onChange={(event) => {
                            const selectedName = event.target.value;
                            setSelectedProjectName(selectedName);
                          }}
                        >
                          {projectData.map((_x, i) => (
                            <MenuItem key={i} value={_x.value}>
                              {_x.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack spacing={3}>
                      <Stack>
                        <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                          <FormControlLabel
                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                            label="From to Till"
                          />
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={30} sx={{ mt: 2 }}>
                            <div sx={{ display: 'flex', alignItems: 'center' }}>
                              <TextField
                                style={{ width: '60px' }}
                                size="small"
                                id="outlined-number"
                                label="FROM"
                                type="number"
                                disabled={isChecked}
                                value={weekNumber}
                                onChange={(e) => setWeekNumber(e.target.value)}
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                              <ArrowRightAlt sx={{ margin: '0 8px' }} />
                              <TextField
                                style={{ width: '60px' }}
                                size="small"
                                id="outlined-number"
                                label="TO"
                                disabled={isChecked}
                                type="number"
                                value={weekNumberTo}
                                onChange={(e) => setWeekNumberTo(e.target.value)}
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                            </div>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        loading={loading}
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        onClick={handleDownload}
                        variant="contained"
                        startIcon={<Icon icon={calendarOutline} />}
                      ></LoadingButton>
                      <LoadingButton
                        loading={loadings}
                        style={{ marginLeft: '1%' }}
                        type="submit"
                        onClick={getdownload}
                        variant="contained"
                        startIcon={<Icon icon={calendarOutline} />}
                      >
                        Milestone
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
