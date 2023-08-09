import { DatePicker } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Logo from '../../../components/Logo';
import Page from '../../../components/Page';
import useSettings from '../../../hooks/useSettings';
import {
  captureAssetDetailsAction,
  getAssetRefObjState,
  getErrorFromAuth,
  getIsAssetDataCaptured,
  getIsLoadingFromAuth,
  getUserDetailsFromAuth,
  logoutAction
} from '../../../redux/slices/authSlice';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';

export default function AssetCapture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const authDetails = useSelector(getUserDetailsFromAuth);
  const isLoading = useSelector(getIsLoadingFromAuth);
  const isAssetDataCaptured = useSelector(getIsAssetDataCaptured);
  const error = useSelector(getErrorFromAuth);
  const { antiVirusList, assetTypeList, emailList, makeList, osList, outlookVersionList, ramList, storageList } =
    useSelector(getAssetRefObjState);
  const { themeStretch } = useSettings();
  const title = 'Asset Details Form';
  const [checked, setChecked] = React.useState(false);
  const handleCheck = (e) => {
    setChecked(e.target.checked);
  };

  const [value, setValue] = React.useState({
    focusr_laptop: '',
    make: '',
    model: '',
    asset_type: '',
    previously_used_by: 'Nil',
    laptop_serial_no: '',
    battery_serial_no: '',
    os_version: '',
    windows_product_id: '',
    ram: '',
    storage: '',
    anti_virus_enabled: '',
    anti_virus_type: '',
    email_configuration: '',
    outlook_version: '',
    date_of_asset_receipt: '',
    charger_working: '',
    other_software_installed: '',
    remarks: 'Nil'
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date) => {
    setValue({
      ...value,
      date_of_asset_receipt: date
    });
  };

  const handleLogout = () => {
    navigate(PATH_AUTH.login, { replace: true });
    dispatch(logoutAction());
  };

  const handleSubmit = () => {
    console.log(value);

    if (value.focusr_laptop === 'Y') {
      if (
        value.focusr_laptop &&
        value.make &&
        value.model &&
        value.asset_type &&
        value.previously_used_by &&
        value.laptop_serial_no &&
        value.battery_serial_no &&
        value.os_version &&
        value.windows_product_id &&
        value.ram &&
        value.storage &&
        value.anti_virus_enabled &&
        value.anti_virus_type &&
        value.email_configuration &&
        value.outlook_version &&
        value.date_of_asset_receipt &&
        value.charger_working &&
        value.other_software_installed &&
        value.remarks &&
        checked === true
      ) {
        dispatch(captureAssetDetailsAction(value));
      } else {
        enqueueSnackbar('Invalid Form. Fill all the details properly.', {
          variant: 'error'
        });
      }
    } else {
      dispatch(captureAssetDetailsAction({ focusr_laptop: 'N' }));
    }
  };

  React.useEffect(() => {
    if (isAssetDataCaptured) {
      enqueueSnackbar('Asset details captured successfully', {
        variant: 'success'
      });
      navigate(PATH_DASHBOARD.general.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAssetDataCaptured]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card sx={{ m: 2 }}>
          <CardHeader
            title="Asset details form"
            avatar={<Logo />}
            action={
              <Box sx={{ p: 1, pt: 1.5 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={isLoading || value.focusr_laptop === ''}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>{' '}
                <Button color="inherit" variant="outlined" onClick={handleLogout} disabled={isLoading}>
                  Logout
                </Button>
              </Box>
            }
          />

          <CardContent>
            <Alert severity="info">
              Welcome {authDetails && authDetails.name} . Please take some time to fill the below details.
            </Alert>
            <Stack divider={<Divider />} spacing={2} padding={2}>
              <Stack>
                <Stack>
                  <Typography variant="subtitle1" noWrap>
                    1. Whether you have FocusR provided laptop ?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    Eg. Yes or No
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start">
                  <FormControl>
                    <RadioGroup row name="focusr_laptop" value={value.focusr_laptop} onChange={handleChange}>
                      <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                      <FormControlLabel value="N" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Stack>
              </Stack>

              {value.focusr_laptop === 'Y' && (
                <>
                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        2. Choose any one brand from the list.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. HP/ Lenova/ Dell/ Toshiba or Others
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField select fullWidth size="small" name="make" value={value.make} onChange={handleChange}>
                        <MenuItem value="">Select</MenuItem>
                        {makeList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        3. Enter the Laptop Model Name/Number.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. HP 348 G7
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Enter"
                        name="model"
                        value={value.model}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        4. Choose from the options which describes about your laptop.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. New one / Used one / Others
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="asset_type"
                        value={value.asset_type}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {assetTypeList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        5. Enter the serial number of your Laptop.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Check the Back Side of your Laptop "SN#"
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Enter"
                        name="laptop_serial_no"
                        value={value.laptop_serial_no}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>
                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        6. Enter the name of previously used user.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. If it is a new laptop then type New orelse reach HR and fill the details
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Enter"
                        name="previously_used_by"
                        value={value.previously_used_by}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        7. Enter the batery serial number of your Laptop.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Please Shutdown your System and Click power button and hold immediately esc button - press
                        f1 to note your Battery Serial No
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Enter"
                        name="battery_serial_no"
                        value={value.battery_serial_no}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        8. Choose the OS version of your laptop
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Windows 8.1, 10, 11
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="os_version"
                        value={value.os_version}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {osList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        9. Choose the RAM of your laptop
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. 8/ 16/ 32 GB
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField select fullWidth size="small" name="ram" value={value.ram} onChange={handleChange}>
                        <MenuItem value="">Select</MenuItem>
                        {ramList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        10. Choose the storage space of your laptop
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. 1 TB/ 512 GB/ 256 GB
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="storage"
                        value={value.storage}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {storageList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        11. Any Antivirus software enabled ?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Active / Inactive antivirus
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <FormControl>
                        <RadioGroup
                          row
                          name="anti_virus_enabled"
                          value={value.anti_virus_enabled}
                          onChange={handleChange}
                        >
                          <FormControlLabel value="Y" control={<Radio />} label="Active" />
                          <FormControlLabel value="N" control={<Radio />} label="Inactive" />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        12. If Active, Choose the antivirus type from the list.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Windows Defender/ Bitdefender or Others
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="anti_virus_type"
                        value={value.anti_virus_type}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {antiVirusList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        13. Choose the Email Configuration from the list.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Outlook/ Tunderbird
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="email_configuration"
                        value={value.email_configuration}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {emailList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        14. Enter the verion details of your email confguration
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. 2007/2008/2009/2010 or Others
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="outlook_version"
                        value={value.outlook_version}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {outlookVersionList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        15. Whether battery health is good ?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Yes / No
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <FormControl>
                        <RadioGroup row name="charger_working" value={value.charger_working} onChange={handleChange}>
                          <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                          <FormControlLabel value="N" control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        16. Date of asset receipt.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Enter the date when you received your laptop from FocusR
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <DatePicker
                        value={value.date_of_asset_receipt}
                        onChange={(newValue) => {
                          handleDateChange(newValue);
                        }}
                        renderInput={(params) => <TextField size="small" fullWidth {...params} />}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        17. Enter the Softwares installed in your laptop.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Teams, Skype, Toad, SQL developer, Visual Studio Code .....
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Enter"
                        name="other_software_installed"
                        value={value.other_software_installed}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        18. If you have any other conserns kindly mention here
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. My laptop screen is damaged...
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        id="id-outlined-multiline-static"
                        multiline
                        rows={4}
                        placeholder="Enter here"
                        name="remarks"
                        value={value.remarks}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack>
                      <Typography variant="subtitle1" noWrap>
                        19. Enter the windows product ID of your laptop.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        Eg. Go to Settings - System - About - product ID
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start">
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Enter"
                        name="windows_product_id"
                        value={value.windows_product_id}
                        onChange={handleChange}
                      />
                    </Stack>
                  </Stack>
                  <stack>
                    <Typography variant="h6" noWrap>
                      <Checkbox
                        checked={checked}
                        name="decleration"
                        onChange={handleCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      Data Specified above are correct to the best of my knowledge and I will be responsible for the
                      given asset
                    </Typography>
                  </stack>
                </>
              )}
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              sx={{
                marginTop: '-3%'
              }}
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={isLoading || value.focusr_laptop === ''}
            >
              {isLoading ? 'Submitting' : 'Submit'}
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
}
