import {
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Card
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useSettings from '../../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';

// eslint-disable-next-line spaced-comment

export default function MainReview() {
  const title = 'Status Review';
  const { themeStretch } = useSettings();
  function getStandardWeekNumber(date) {
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    // Find The Thursday in this week

    currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));

    // The first Week of the year is the one that includes January 1st

    const week1 = new Date(currentDate.getFullYear(), 0, 1);

    // Calculate the Difference In days

    const daysDifference = Math.floor((currentDate - week1) / (24 * 60 * 60 * 1000));

    // Calculate the week number

    const weekNumber = Math.floor(daysDifference / 7) + 1;

    return weekNumber;
  }

  const [selectedRadio, setSelectedRadio] = useState('Support');

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const today = new Date(); // Your Date

  const standardWeekNumber = getStandardWeekNumber(today);

  const [weekNumber, setWeekNumber] = useState(standardWeekNumber);

  console.log(`Week Number: ${standardWeekNumber}`);

  console.log('params week no', weekNumber);

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Status Review' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={30} md={1}>
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {/* {touched.avatarUrl && errors.avatarUrl} */}
            </FormHelperText>
          </Grid>
          <Grid item xs={19} md={5}>
            <Card sx={{ p: 4, mt: 1 }}>
              <Stack spacing={2}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-status-review"
                    defaultValue="Support"
                    name="radio-button-status-review"
                    value={selectedRadio}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel value="Support" control={<Radio />} label="Support" />
                    <FormControlLabel value="Fixed Bid" control={<Radio />} label="Fixed Bid" />
                  </RadioGroup>
                </FormControl>
                {selectedRadio === 'Support' ? (
                  <Grid spacing={20}>
                    <TextField
                      style={{ width: '60px' }}
                      size="small"
                      id="outlined-number"
                      label="Week"
                      type="number"
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(e.target.value)}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <TextField
                      style={{ width: '100px', marginLeft: 10 }}
                      size="small"
                      id="outlined-number"
                      label="Year"
                      type="number"
                      value={year}
                      disabled
                    />
                    <LoadingButton
                      style={{ marginLeft: '5%' }}
                      type="submit"
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#1E90FF' }}
                      component={RouterLink}
                      // to={PATH_DASHBOARD.review.supportProjectReview}
                      to={`${PATH_DASHBOARD.review.supportProjectReview}/${weekNumber}/${year}`}
                    >
                      START
                    </LoadingButton>
                  </Grid>
                ) : (
                  <Grid spacing={20}>
                    {/* <TextField
                style={{ width: '60px' }}
                size="small"
                id="outlined-number"
                label="Week"
                type="number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              /> */}
                    <TextField
                      style={{ width: '60px' }}
                      size="small"
                      id="outlined-number"
                      label="Week"
                      type="number"
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(e.target.value)}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <TextField
                      style={{ width: '100px', marginLeft: 10 }}
                      size="small"
                      id="outlined-number"
                      label="Year"
                      type="number"
                      value={year}
                      disabled
                    />
                    <LoadingButton
                      style={{ marginLeft: '5%' }}
                      type="submit"
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#1E90FF' }}
                      component={RouterLink}
                      // to={PATH_DASHBOARD.review.fixedStatus}
                      to={`${PATH_DASHBOARD.review.fixedStatus}/${weekNumber}/${year}`}
                    >
                      START
                    </LoadingButton>
                  </Grid>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
