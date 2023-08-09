import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik, Field } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { DatePicker, LoadingButton } from '@mui/lab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material';

import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import closeFill from '@iconify/icons-eva/close-fill';
import { getUserDetailsFromAuth } from '../../redux/slices/authSlice';
import { getListOfMasterClassificationAsync, createOrUpdateMasterAsync } from '../../redux/slices/masterSlice';
import { getAllGroupsAsync, getAllUsersFromGroups } from '../../redux/slices/timesheetSettingsSlice';
import { getAllCountriesAsync, getCoutriesFromLeaveMaster } from '../../redux/slices/leaveSlice';
import { numbers, upperCaseLetters, lowerCaseLetters, specialCharacters } from '../../utils/characters';
import { fData } from '../../utils/formatNumber';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import { UploadAvatar } from '../../components/upload';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import { email } from 'src/utils/mock-data/email';
import {
  createUserActionAsync,
  setMsgNull,
  getMsgFromUser,
  getIsLoadingFromUser,
  getAllRolesActionAsync,
  getAllManagersActionAsync,
  getRolesListFromUser,
  getManagersListFromUser,
  getListOfDesignationActionAsync,
  getDesignationsListFromUser,
  getErrorFromUser,
  setErrorNull
} from '../../redux/slices/userSlice';
import { MIconButton } from '../../components/@material-extend';

// ----------------------------------------------------------------------

/**
 * TODO Intergrate with service donot use this
 */

export default function MasterNewentry() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [data, setData] = useState([]);
  const [getCountry, setCountry] = useState();
  const [getState, setState] = useState([]);
  const [selectedState, getSelectedState] = useState();
  const authDetails = useSelector(getUserDetailsFromAuth);
  const isLoading = useSelector(getIsLoadingFromUser);
  const error = useSelector(getErrorFromUser);
  const msg = useSelector(getMsgFromUser);
  const title = 'Master';
  const countries = useSelector(getCoutriesFromLeaveMaster);
  const { classifications } = useSelector((state) => state.master);
  console.log('fgkjk', classifications);
  const navigate = useNavigate();

  const NewUserSchema = Yup.object().shape({
    classification: Yup.string().required('Classification is required'),
    country: Yup.string().required(''),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    company_name: Yup.string().required('Company Name is required'),
    business_vertical: Yup.string().required('Business Vertical is required'),
    contact_persion_name: Yup.string().required('Contact Person Name is required'),
    email: Yup.string().email('Invalid email', '^[a-z)A-Z0-9+_.-]+@[a-zA-Z0-9.-]+$').required('Email is Required'),
    alternative_email: Yup.string().notOneOf([Yup.ref('email'), null], 'Use Different Email'),
    country_code: Yup.string().required(''),
    phone_number: Yup.string().required('Phone Number is  required'),
    // country_code_1: Yup.string().required(''),
    alternative_phone_number: Yup.string().notOneOf([Yup.ref('phone_number'), null], 'Use Different Phone Number')
  });

  useEffect(() => {
    dispatch(createOrUpdateMasterAsync());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      crm_representative: '',
      classification: '',
      country: '',
      state: '',
      city: '',
      company_name: '',
      business_vertical: '',
      contact_persion_name: '',
      email: '',
      alternative_email: '',
      country_code: '',
      phone_number: '',
      // country_code_1: '',
      alternative_phone_number: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const payload = {
          ...values,
          crm_representative: values.crm_representative,
          classification: values.classification,
          country: values.country,
          state: values.state,
          city: values.city,
          company_name: values.company_name,
          business_vertical: values.business_vertical,
          contact_persion_name: values.contact_persion_name,
          email: values.email,
          alternative_email: values.alternative_email,
          country_code: values.country_code,
          phone_number: values.phone_number,
          // country_code_1: values.country_code_1,
          alternative_phone_number: values.alternative_phone_number
        };
        await dispatch(createOrUpdateMasterAsync(payload));
        // await dispatch(getAllManagersActionAsync());
        // resetForm();
        // setFieldValue('is_bulk_upload', false);
        // setFieldValue('designation', '');
        // setFieldValue('password', createPassword(numbers + upperCaseLetters + lowerCaseLetters + specialCharacters));
        setSubmitting(false);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
      navigate(PATH_DASHBOARD.crm.Master);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const [selectedClassification, setSelectedClassification] = useState(
    { classification: values.classification } || null
  );
  // const [selectedCountrycode1, setSelectedcountrycode1] = useState({ country_code_1: values.country_code_1 } || null);
  const [selectedCountrycode, setSelectedcountrycode] = useState({ country_code: values.country_code } || null);
  const [selectedCountry, setSelectedcountry] = useState({ country: values.country } || null);
  // const [selectedCountry, setSelectedCountry] = useState({ country: values.country } || null);
  //   const handleShowPassword = () => {
  //     setShowPassword((show) => !show);
  //   };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  useEffect(() => {
    if (msg) {
      enqueueSnackbar(msg, { variant: 'success' });
      dispatch(setMsgNull());
      // resetForm();
      setFieldValue('crmrepresentative', '');
      setFieldValue('classification', '');
      setFieldValue('country', '');
      setFieldValue('state', '');
      setFieldValue('city', '');
      setFieldValue('company_name', '');
      setFieldValue('business_vertical', '');
      setFieldValue('contact_persion_name', '');
      setFieldValue('email', '');
      setFieldValue('alternative_email', '');
      setFieldValue('country_code', '');
      setFieldValue('phone_number', '');
      // setFieldValue('country_code_1', '');
      setFieldValue('alternative_phone_number', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  const countryi = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    {
      code: 'AE',
      label: 'United Arab Emirates',
      phone: '971'
    },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    {
      code: 'AG',
      label: 'Antigua and Barbuda',
      phone: '1268'
    },
    { code: 'AI', label: 'Anguilla', phone: '1264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AQ', label: 'Antarctica', phone: '672' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AS', label: 'American Samoa', phone: '1684' },
    { code: 'AT', label: 'Austria', phone: '43' },
    {
      code: 'AU',
      label: 'Australia',
      phone: '61',
      suggested: true
    },
    { code: 'AW', label: 'Aruba', phone: '297' },
    { code: 'AX', label: 'Alland Islands', phone: '358' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    {
      code: 'BA',
      label: 'Bosnia and Herzegovina',
      phone: '387'
    },
    { code: 'BB', label: 'Barbados', phone: '1246' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BF', label: 'Burkina Faso', phone: '226' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BI', label: 'Burundi', phone: '257' },
    { code: 'BJ', label: 'Benin', phone: '229' },
    { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
    { code: 'BM', label: 'Bermuda', phone: '1441' },
    { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
    { code: 'BO', label: 'Bolivia', phone: '591' },
    { code: 'BR', label: 'Brazil', phone: '55' },
    { code: 'BS', label: 'Bahamas', phone: '1242' },
    { code: 'BT', label: 'Bhutan', phone: '975' },
    { code: 'BV', label: 'Bouvet Island', phone: '47' },
    { code: 'BW', label: 'Botswana', phone: '267' },
    { code: 'BY', label: 'Belarus', phone: '375' },
    { code: 'BZ', label: 'Belize', phone: '501' },
    {
      code: 'CA',
      label: 'Canada',
      phone: '1',
      suggested: true
    },
    {
      code: 'CC',
      label: 'Cocos (Keeling) Islands',
      phone: '61'
    },
    {
      code: 'CD',
      label: 'Congo, Democratic Republic of the',
      phone: '243'
    },
    {
      code: 'CF',
      label: 'Central African Republic',
      phone: '236'
    },
    {
      code: 'CG',
      label: 'Congo, Republic of the',
      phone: '242'
    },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
    { code: 'CK', label: 'Cook Islands', phone: '682' },
    { code: 'CL', label: 'Chile', phone: '56' },
    { code: 'CM', label: 'Cameroon', phone: '237' },
    { code: 'CN', label: 'China', phone: '86' },
    { code: 'CO', label: 'Colombia', phone: '57' },
    { code: 'CR', label: 'Costa Rica', phone: '506' },
    { code: 'CU', label: 'Cuba', phone: '53' },
    { code: 'CV', label: 'Cape Verde', phone: '238' },
    { code: 'CW', label: 'Curacao', phone: '599' },
    { code: 'CX', label: 'Christmas Island', phone: '61' },
    { code: 'CY', label: 'Cyprus', phone: '357' },
    { code: 'CZ', label: 'Czech Republic', phone: '420' },
    {
      code: 'DE',
      label: 'Germany',
      phone: '49',
      suggested: true
    },
    { code: 'DJ', label: 'Djibouti', phone: '253' },
    { code: 'DK', label: 'Denmark', phone: '45' },
    { code: 'DM', label: 'Dominica', phone: '1767' },
    {
      code: 'DO',
      label: 'Dominican Republic',
      phone: '1809'
    },
    { code: 'DZ', label: 'Algeria', phone: '213' },
    { code: 'EC', label: 'Ecuador', phone: '593' },
    { code: 'EE', label: 'Estonia', phone: '372' },
    { code: 'EG', label: 'Egypt', phone: '20' },
    { code: 'EH', label: 'Western Sahara', phone: '212' },
    { code: 'ER', label: 'Eritrea', phone: '291' },
    { code: 'ES', label: 'Spain', phone: '34' },
    { code: 'ET', label: 'Ethiopia', phone: '251' },
    { code: 'FI', label: 'Finland', phone: '358' },
    { code: 'FJ', label: 'Fiji', phone: '679' },
    {
      code: 'FK',
      label: 'Falkland Islands (Malvinas)',
      phone: '500'
    },
    {
      code: 'FM',
      label: 'Micronesia, Federated States of',
      phone: '691'
    },
    { code: 'FO', label: 'Faroe Islands', phone: '298' },
    {
      code: 'FR',
      label: 'France',
      phone: '33',
      suggested: true
    },
    { code: 'GA', label: 'Gabon', phone: '241' },
    { code: 'GB', label: 'United Kingdom', phone: '44' },
    { code: 'GD', label: 'Grenada', phone: '1473' },
    { code: 'GE', label: 'Georgia', phone: '995' },
    { code: 'GF', label: 'French Guiana', phone: '594' },
    { code: 'GG', label: 'Guernsey', phone: '44' },
    { code: 'GH', label: 'Ghana', phone: '233' },
    { code: 'GI', label: 'Gibraltar', phone: '350' },
    { code: 'GL', label: 'Greenland', phone: '299' },
    { code: 'GM', label: 'Gambia', phone: '220' },
    { code: 'GN', label: 'Guinea', phone: '224' },
    { code: 'GP', label: 'Guadeloupe', phone: '590' },
    { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
    { code: 'GR', label: 'Greece', phone: '30' },
    {
      code: 'GS',
      label: 'South Georgia and the South Sandwich Islands',
      phone: '500'
    },
    { code: 'GT', label: 'Guatemala', phone: '502' },
    { code: 'GU', label: 'Guam', phone: '1671' },
    { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
    { code: 'GY', label: 'Guyana', phone: '592' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    {
      code: 'HM',
      label: 'Heard Island and McDonald Islands',
      phone: '672'
    },
    { code: 'HN', label: 'Honduras', phone: '504' },
    { code: 'HR', label: 'Croatia', phone: '385' },
    { code: 'HT', label: 'Haiti', phone: '509' },
    { code: 'HU', label: 'Hungary', phone: '36' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
    { code: 'IM', label: 'Isle of Man', phone: '44' },
    { code: 'IN', label: 'India', phone: '91' },
    {
      code: 'IO',
      label: 'British Indian Ocean Territory',
      phone: '246'
    },
    { code: 'IQ', label: 'Iraq', phone: '964' },
    {
      code: 'IR',
      label: 'Iran, Islamic Republic of',
      phone: '98'
    },
    { code: 'IS', label: 'Iceland', phone: '354' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'JE', label: 'Jersey', phone: '44' },
    { code: 'JM', label: 'Jamaica', phone: '1876' },
    { code: 'JO', label: 'Jordan', phone: '962' },
    {
      code: 'JP',
      label: 'Japan',
      phone: '81',
      suggested: true
    },
    { code: 'KE', label: 'Kenya', phone: '254' },
    { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
    { code: 'KH', label: 'Cambodia', phone: '855' },
    { code: 'KI', label: 'Kiribati', phone: '686' },
    { code: 'KM', label: 'Comoros', phone: '269' },
    {
      code: 'KN',
      label: 'Saint Kitts and Nevis',
      phone: '1869'
    },
    {
      code: 'KP',
      label: "Korea, Democratic People's Republic of",
      phone: '850'
    },
    { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'KY', label: 'Cayman Islands', phone: '1345' },
    { code: 'KZ', label: 'Kazakhstan', phone: '7' },
    {
      code: 'LA',
      label: "Lao People's Democratic Republic",
      phone: '856'
    },
    { code: 'LB', label: 'Lebanon', phone: '961' },
    { code: 'LC', label: 'Saint Lucia', phone: '1758' },
    { code: 'LI', label: 'Liechtenstein', phone: '423' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'LR', label: 'Liberia', phone: '231' },
    { code: 'LS', label: 'Lesotho', phone: '266' },
    { code: 'LT', label: 'Lithuania', phone: '370' },
    { code: 'LU', label: 'Luxembourg', phone: '352' },
    { code: 'LV', label: 'Latvia', phone: '371' },
    { code: 'LY', label: 'Libya', phone: '218' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'MC', label: 'Monaco', phone: '377' },
    {
      code: 'MD',
      label: 'Moldova, Republic of',
      phone: '373'
    },
    { code: 'ME', label: 'Montenegro', phone: '382' },
    {
      code: 'MF',
      label: 'Saint Martin (French part)',
      phone: '590'
    },
    { code: 'MG', label: 'Madagascar', phone: '261' },
    { code: 'MH', label: 'Marshall Islands', phone: '692' },
    {
      code: 'MK',
      label: 'Macedonia, the Former Yugoslav Republic of',
      phone: '389'
    },
    { code: 'ML', label: 'Mali', phone: '223' },
    { code: 'MM', label: 'Myanmar', phone: '95' },
    { code: 'MN', label: 'Mongolia', phone: '976' },
    { code: 'MO', label: 'Macao', phone: '853' },
    {
      code: 'MP',
      label: 'Northern Mariana Islands',
      phone: '1670'
    },
    { code: 'MQ', label: 'Martinique', phone: '596' },
    { code: 'MR', label: 'Mauritania', phone: '222' },
    { code: 'MS', label: 'Montserrat', phone: '1664' },
    { code: 'MT', label: 'Malta', phone: '356' },
    { code: 'MU', label: 'Mauritius', phone: '230' },
    { code: 'MV', label: 'Maldives', phone: '960' },
    { code: 'MW', label: 'Malawi', phone: '265' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MZ', label: 'Mozambique', phone: '258' },
    { code: 'NA', label: 'Namibia', phone: '264' },
    { code: 'NC', label: 'New Caledonia', phone: '687' },
    { code: 'NE', label: 'Niger', phone: '227' },
    { code: 'NF', label: 'Norfolk Island', phone: '672' },
    { code: 'NG', label: 'Nigeria', phone: '234' },
    { code: 'NI', label: 'Nicaragua', phone: '505' },
    { code: 'NL', label: 'Netherlands', phone: '31' },
    { code: 'NO', label: 'Norway', phone: '47' },
    { code: 'NP', label: 'Nepal', phone: '977' },
    { code: 'NR', label: 'Nauru', phone: '674' },
    { code: 'NU', label: 'Niue', phone: '683' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'PA', label: 'Panama', phone: '507' },
    { code: 'PE', label: 'Peru', phone: '51' },
    { code: 'PF', label: 'French Polynesia', phone: '689' },
    { code: 'PG', label: 'Papua New Guinea', phone: '675' },
    { code: 'PH', label: 'Philippines', phone: '63' },
    { code: 'PK', label: 'Pakistan', phone: '92' },
    { code: 'PL', label: 'Poland', phone: '48' },
    {
      code: 'PM',
      label: 'Saint Pierre and Miquelon',
      phone: '508'
    },
    { code: 'PN', label: 'Pitcairn', phone: '870' },
    { code: 'PR', label: 'Puerto Rico', phone: '1' },
    {
      code: 'PS',
      label: 'Palestine, State of',
      phone: '970'
    },
    { code: 'PT', label: 'Portugal', phone: '351' },
    { code: 'PW', label: 'Palau', phone: '680' },
    { code: 'PY', label: 'Paraguay', phone: '595' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'RE', label: 'Reunion', phone: '262' },
    { code: 'RO', label: 'Romania', phone: '40' },
    { code: 'RS', label: 'Serbia', phone: '381' },
    { code: 'RU', label: 'Russian Federation', phone: '7' },
    { code: 'RW', label: 'Rwanda', phone: '250' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'SB', label: 'Solomon Islands', phone: '677' },
    { code: 'SC', label: 'Seychelles', phone: '248' },
    { code: 'SD', label: 'Sudan', phone: '249' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'SH', label: 'Saint Helena', phone: '290' },
    { code: 'SI', label: 'Slovenia', phone: '386' },
    {
      code: 'SJ',
      label: 'Svalbard and Jan Mayen',
      phone: '47'
    },
    { code: 'SK', label: 'Slovakia', phone: '421' },
    { code: 'SL', label: 'Sierra Leone', phone: '232' },
    { code: 'SM', label: 'San Marino', phone: '378' },
    { code: 'SN', label: 'Senegal', phone: '221' },
    { code: 'SO', label: 'Somalia', phone: '252' },
    { code: 'SR', label: 'Suriname', phone: '597' },
    { code: 'SS', label: 'South Sudan', phone: '211' },
    {
      code: 'ST',
      label: 'Sao Tome and Principe',
      phone: '239'
    },
    { code: 'SV', label: 'El Salvador', phone: '503' },
    {
      code: 'SX',
      label: 'Sint Maarten (Dutch part)',
      phone: '1721'
    },
    {
      code: 'SY',
      label: 'Syrian Arab Republic',
      phone: '963'
    },
    { code: 'SZ', label: 'Swaziland', phone: '268' },
    {
      code: 'TC',
      label: 'Turks and Caicos Islands',
      phone: '1649'
    },
    { code: 'TD', label: 'Chad', phone: '235' },
    {
      code: 'TF',
      label: 'French Southern Territories',
      phone: '262'
    },
    { code: 'TG', label: 'Togo', phone: '228' },
    { code: 'TH', label: 'Thailand', phone: '66' },
    { code: 'TJ', label: 'Tajikistan', phone: '992' },
    { code: 'TK', label: 'Tokelau', phone: '690' },
    { code: 'TL', label: 'Timor-Leste', phone: '670' },
    { code: 'TM', label: 'Turkmenistan', phone: '993' },
    { code: 'TN', label: 'Tunisia', phone: '216' },
    { code: 'TO', label: 'Tonga', phone: '676' },
    { code: 'TR', label: 'Turkey', phone: '90' },
    {
      code: 'TT',
      label: 'Trinidad and Tobago',
      phone: '1868'
    },
    { code: 'TV', label: 'Tuvalu', phone: '688' },
    {
      code: 'TW',
      label: 'Taiwan, Province of China',
      phone: '886'
    },
    {
      code: 'TZ',
      label: 'United Republic of Tanzania',
      phone: '255'
    },
    { code: 'UA', label: 'Ukraine', phone: '380' },
    { code: 'UG', label: 'Uganda', phone: '256' },
    {
      code: 'US',
      label: 'United States',
      phone: '1',
      suggested: true
    },
    { code: 'UY', label: 'Uruguay', phone: '598' },
    { code: 'UZ', label: 'Uzbekistan', phone: '998' },
    {
      code: 'VA',
      label: 'Holy See (Vatican City State)',
      phone: '379'
    },
    {
      code: 'VC',
      label: 'Saint Vincent and the Grenadines',
      phone: '1784'
    },
    { code: 'VE', label: 'Venezuela', phone: '58' },
    {
      code: 'VG',
      label: 'British Virgin Islands',
      phone: '1284'
    },
    {
      code: 'VI',
      label: 'US Virgin Islands',
      phone: '1340'
    },
    { code: 'VN', label: 'Vietnam', phone: '84' },
    { code: 'VU', label: 'Vanuatu', phone: '678' },
    { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
    { code: 'WS', label: 'Samoa', phone: '685' },
    { code: 'XK', label: 'Kosovo', phone: '383' },
    { code: 'YE', label: 'Yemen', phone: '967' },
    { code: 'YT', label: 'Mayotte', phone: '262' },
    { code: 'ZA', label: 'South Africa', phone: '27' },
    { code: 'ZM', label: 'Zambia', phone: '260' },
    { code: 'ZW', label: 'Zimbabwe', phone: '263' }
  ];

  const handleCountry = (e) => {
    let states = data.filter((state) => state.country === e.target.value);
    states = [...new Set(states.map((item) => item.subcountry))];
    states.sort();

    setState(states);
  };

  const handleState = (e) => {
    // let cities = data.filter((city) => city.subcountry === e.target.value);
    //   console.log(cities);
  };

  useEffect(() => {
    dispatch(getListOfMasterClassificationAsync());
  }, [dispatch, setFieldValue]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.root },
            { name: 'Master', href: PATH_DASHBOARD.crm.Master },
            { name: 'Create' }
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={30} md={1}>
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
                {/* </Box> */}
                {/* </Card> */}
              </Grid>

              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="CRM Representative"
                        // {...getFieldProps('state')}
                        // error={Boolean(touched.state && errors.state)}
                        // helperText={touched.state && errors.state}
                        value={authDetails.name}
                        disabled
                      />

                      <FormControl fullWidth error={Boolean(touched.classification && errors.classification)}>
                        <Autocomplete
                          id="classification-id"
                          fullWidth
                          value={selectedClassification || {}}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedClassification(newValue);
                              setFieldValue('classification', newValue.value);
                            } else {
                              setSelectedClassification('');
                              setFieldValue('classification', '');
                            }
                          }}
                          options={classifications}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.value || ''}
                          renderInput={(params) => <Field component={TextField} {...params} label="Classification" />}
                        />
                        <FormHelperText>{errors.classification ? errors.classification : null}</FormHelperText>
                      </FormControl>

                      <FormControl fullWidth error={Boolean(touched.country && errors.country)}>
                        <Autocomplete
                          id="country-id"
                          fullWidth
                          value={selectedCountry || {}}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedcountry(newValue);
                              setFieldValue('country', newValue.label);
                            } else {
                              setSelectedcountry('');
                              setFieldValue('country', '');
                            }
                          }}
                          options={countryi}
                          isOptionEqualToValue={(option, value) => option.label === value.label}
                          getOptionLabel={(option) => option.label || ''}
                          renderInput={(params) => <Field component={TextField} {...params} label="Country" />}
                        />
                        <FormHelperText>{errors.country ? errors.country : null}</FormHelperText>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="State"
                        {...getFieldProps('state')}
                        error={Boolean(touched.state && errors.state)}
                        helperText={touched.state && errors.state}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="City"
                        {...getFieldProps('city')}
                        error={Boolean(touched.city && errors.city)}
                        helperText={touched.city && errors.city}
                      />
                      <TextField
                        fullWidth
                        label="Company Name"
                        {...getFieldProps('company_name')}
                        error={Boolean(touched.company_name && errors.company_name)}
                        helperText={touched.company_name && errors.company_name}
                      />
                      <TextField
                        fullWidth
                        label="Business Vertical"
                        {...getFieldProps('business_vertical')}
                        error={Boolean(touched.business_vertical && errors.business_vertical)}
                        helperText={touched.business_vertical && errors.business_vertical}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Contact Person name"
                        {...getFieldProps('contact_persion_name')}
                        error={Boolean(touched.contact_persion_name && errors.contact_persion_name)}
                        helperText={touched.contact_persion_name && errors.contact_persion_name}
                      />
                      <TextField
                        fullWidth
                        label="Email Id"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                      <TextField
                        fullWidth
                        label="Alternative Email Id"
                        {...getFieldProps('alternative_email')}
                        error={Boolean(touched.alternative_email && errors.alternative_email)}
                        helperText={touched.alternative_email && errors.alternative_email}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormControl error={Boolean(touched.country_code && errors.country_code)}>
                        <Autocomplete
                          id="country_code-id"
                          sx={{ width: 150 }}
                          value={selectedCountrycode || {}}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedcountrycode(newValue);
                              setFieldValue('country_code', newValue.phone);
                            } else {
                              setSelectedcountrycode('');
                              setFieldValue('country_code', '');
                            }
                          }}
                          options={countryi}
                          isOptionEqualToValue={(option, value) => option.phone === value.phone}
                          getOptionLabel={(option) => option.phone || ''}
                          renderInput={(params) => <Field component={TextField} {...params} label="Country Code" />}
                        />
                        <FormHelperText>{errors.country_code ? errors.country_code : null}</FormHelperText>
                      </FormControl>
                      <TextField
                        sx={{ width: 270 }}
                        label="Phone number"
                        {...getFieldProps('phone_number')}
                        error={Boolean(touched.phone_number && errors.phone_number)}
                        helperText={touched.phone_number && errors.phone_number}
                      />
                      {/* <FormControl fullWidth error={Boolean(touched.country_code_1 && errors.country_code_1)}>
                        <Autocomplete
                          id="country_code_1-id"
                          sx={{ width: 150 }}
                          value={selectedCountrycode1 || {}}
                          onChange={(_event, newValue) => {
                            if (newValue) {
                              setSelectedcountrycode1(newValue);
                              setFieldValue('country_code_1', newValue.phone);
                            } else {
                              setSelectedcountrycode1('');
                              setFieldValue('country_code_1', '');
                            }
                          }}
                          options={countryi}
                          isOptionEqualToValue={(option, value) => option.phone === value.phone}
                          getOptionLabel={(option) => option.phone || ''}
                          renderInput={(params) => <Field component={TextField} {...params} label="Country Code" />}
                        />
                        <FormHelperText>{errors.country_code_1 ? errors.country_code_1 : null}</FormHelperText>
                      </FormControl> */}
                      <TextField
                        sx={{ width: 300 }}
                        label="Alternative Phone number"
                        {...getFieldProps('alternative_phone_number')}
                        error={Boolean(touched.alternative_phone_number && errors.alternative_phone_number)}
                        helperText={touched.alternative_phone_number && errors.alternative_phone_number}
                      />
                    </Stack>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Create NewEntry
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
