import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getUserDetailsFromAuth } from '../../redux/slices/authSlice';
import Customdate from '../../components/date';
import Page from '../../components/Page';

// ---------------------------------------------------------------------------------------
/* eslint-disable */
const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
  maxWidth: 550,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(10, 0, 0, 0),
  padding: theme.spacing(4, 4),
  boxShadow: '-moz-initial'
}));

export default function OrderFood() {
  const authDetails = useSelector(getUserDetailsFromAuth);
  const navigation = useNavigate();
  // const [newLocation, setNewLocation] = useState('');
  const [location, setLocation] = useState('');
  const [menu, setMenu] = useState(false);
  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [three, setThree] = useState('');
  const [four, setFour] = useState('');
  const [five, setFive] = useState('');
  const [other, setOther] = useState('');
  const [otherMeal, setOtherMeal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [feedback, setFeedback] = useState('');
  useEffect(() => {
    axios
      .get('http://34.121.255.103:3333/api/getMeal')
      .then((res) => {
        console.log('foodie getmeal data', res.data);
        setOne(res.data[0].one);
        setTwo(res.data[0].two);
        setThree(res.data[0].three);
        setFour(res.data[0].four);
        setFive(res.data[0].five);
      })
      .catch((err) => {
        console.log('Error in foodie get meal', err);
      });
    axios
      .get(`http://34.121.255.103:3333/api/checkOrder/${authDetails.name}`)
      .then((res) => {
        console.log('foodie  data', res.data);
        console.log('first', res.data[0].need);
        if (res.data[0].need == 1 || res.data[0].need == '1') {
          setOrdered(true);
        } else {
          setOrdered(false);
        }
      })
      .catch((err) => {
        console.log('Error in foodie check order', err.response);
      });
  }, []);
  const openMenu = () => {
    if (location === '' || location === undefined) {
      alert('Please choose the location');
    } else {
      setMenu(true);
    }
  };

  const handleNeed = () => {
    setChecked(!checked);
  };
  const sendFoodNeed = () => {
    axios
      .post('http://34.121.255.103:3333/api/mealNeededOrNot', {
        need: checked ? '1' : '0',
        username: authDetails && authDetails.name,
        location: location,
        empId: localStorage.getItem('empId')
      })
      .then((res) => {
        console.log('Success', res);
      })
      .catch((err) => {
        console.log('error', err);
      });
    localStorage.setItem('Newlocation', location);
    alert('food ordered successfully');
    navigation('/rics');
    axios
      .get(`http://34.121.255.103:3333/api/checkOrder/${authDetails.name}`)
      .then((res) => {
        console.log('foodie  data', res.data);
        console.log('first', res.data[0].need);
        if (res.data[0].need == 1 || res.data[0].need == '1') {
          setOrdered(true);
        } else {
          setOrdered(false);
        }
      })
      .catch((err) => {
        console.log('Error in foodie get meal', err);
      });
  };

  const sendFeedBack = () => {
    axios
      .post('http://34.121.255.103:3333/api/sendFeedback', {
        username: authDetails && authDetails.name,
        location: localStorage.getItem('Newlocation'),
        feedback: feedback
      })
      .then((res) => {
        console.log('Success', res);
      })
      .catch((err) => {
        console.log('error', err);
      });
    alert('Feedback sended successfully');
    navigation('/dashboard/metrics');
  };
  // const hr = new Date().getHours() >= 11;
  const hr = false;
  return (
    <Container maxWidth="sm">
      {hr ? (
        <center>
          <h1
            style={{
              color: '#FF5050',
              fontStyle: 'italic'
            }}
          >
            Please Comeback Tommorrow before 10.30 AM
          </h1>
        </center>
      ) : (
        <SectionStyle sx={{ mt: -2 }}>
          {ordered ? (
            <Stack spacing={3}>
              <h1>Look's like you already ordered</h1>
              <p
                style={{
                  alignSelf: 'center'
                }}
              >
                Please submit your feedback
              </p>
              <TextField size="small" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
              <Button
                variant="contained"
                sx={{
                  width: '50%',
                  alignSelf: 'center'
                }}
                onClick={sendFeedBack}
              >
                Submit Feedback
              </Button>
            </Stack>
          ) : (
            <>
              <>
                <Stack
                  direction="column"
                  sx={{
                    width: '100%'
                  }}
                >
                  <p
                    style={{
                      textAlign: 'left',
                      fontWeight: 'bold'
                    }}
                  >
                    Choose Location
                  </p>
                  <Select size="small" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <MenuItem value="Salem">Salem</MenuItem>
                    <MenuItem value="Chennai">Chennai</MenuItem>
                  </Select>
                  <Button
                    sx={{
                      width: '35%',
                      alignSelf: 'center',
                      marginTop: '6%'
                    }}
                    variant="contained"
                    onClick={openMenu}
                  >
                    See Menu
                  </Button>
                </Stack>
              </>
              <>
                {menu ? (
                  <Stack spacing={2}>
                    <h1>Today's Menu</h1>
                    <p
                      style={{
                        textAlign: 'center',
                        border: '1px solid red',
                        padding: '0.2rem 0.2rem 0.2rem 0.2rem',
                        borderRadius: 25
                      }}
                    >
                      {Customdate}
                    </p>
                    <Stack
                      sx={{
                        border: '1px solid red',
                        alignItems: 'center',
                        paddingTop: '5%',
                        paddingBottom: '5%',
                        borderRadius: 2
                      }}
                    >
                      {location === 'Salem' ? (
                        <>
                          {otherMeal ? (
                            <p>{other}</p>
                          ) : (
                            <>
                              <p>{one}</p>
                              <p>{two}</p>
                              <p>{three}</p>
                              <p>{four}</p>
                              <p>{five || ''}</p>
                            </>
                          )}
                        </>
                      ) : (
                        <p
                          style={{
                            textAlign: 'center'
                          }}
                        >
                          Veg-Meals
                        </p>
                      )}
                    </Stack>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: 'stretch',
                        alignSelf: 'center',
                        border: '1px solid red',
                        paddingLeft: '5%',
                        borderRadius: 8
                      }}
                    >
                      <p
                        style={{
                          paddingTop: '5%'
                        }}
                      >
                        You want food today
                      </p>
                      <Checkbox value={checked} onChange={handleNeed} />
                    </Stack>
                    <Button
                      sx={{
                        width: '55%',
                        alignSelf: 'center'
                      }}
                      variant="contained"
                      onClick={sendFoodNeed}
                    >
                      Order Food
                    </Button>
                  </Stack>
                ) : null}
              </>
            </>
          )}
        </SectionStyle>
      )}
    </Container>
  );
}
