import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Grid,
  Stack,
  Card,
  Container,
  Button,
  Hidden,
  Typography,
  Snackbar,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';

/* eslint-disable */

const useStyles = makeStyles((theme) => ({
  responseList: {
    listStyleType: 'none',
    padding: 0,
    maxWidth: '300px' // Adjust the maximum width as needed
  },
  responseItem: {
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    backgroundColor: 'white',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center' // Center-align the content within the card
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginTop: theme.spacing(4)
  },
  card: {
    padding: theme.spacing(1),
    textAlign: 'center'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center' // Center-align content within the cards
  }
}));

const ProjectSequence = () => {
  const classes = useStyles();

  // Define the hardcoded responses for Support and Response lists
  const initialSupportResponses = [
    { id: 's1', content: 'TimeSheet Management' },
    { id: 's2', content: 'EKI' },
    { id: 's3', content: 'DFC' },
    { id: 's4', content: '2B' },
    { id: 's5', content: 'Elite' },
    { id: 's6', content: 'ATA' }
  ];

  const initialResponseResponses = [
    { id: 'r1', content: 'EKI' },
    { id: 'r2', content: 'DFC' },
    { id: 'r3', content: '2B' },
    { id: 'r4', content: 'ELITE' },
    { id: 'r5', content: 'TNPL' },
    { id: 'r6', content: 'ATA' }
    // Add more response responses as needed
  ];

  const [success, setSuccess] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [apiData, setApiData] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [apiDataFIxed, setApiDataFixed] = useState([]);

  const [supportResponses, setSupportResponses] = useState([]);
  const [responseResponses, setResponseResponses] = useState([]);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get(`https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/getIdProjectSequence/Support`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('Responce', res.data);
        setApiData(res.data);
        setSupportResponses(res.data); // Update supportResponses here
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/getIdProjectSequence/Fixed`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('Responce', res.data);
        setApiDataFixed(res.data);
        setResponseResponses(res.data);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  const [selectedRadio, setSelectedRadio] = useState('support');

  console.log('support', apiData);
  console.log('Fixed', apiDataFIxed);

  const { themeStretch } = useSettings();

  console.log('e45', supportResponses);

  const [supportSequence, setSupportSequence] = useState([]);
  const [responseSequence, setResponseSequence] = useState([]);

  const title = 'Project Sequence';

  const handleSupportDragEnd = (result) => {
    if (!result.destination) return;

    const updatedSupportResponses = [...supportResponses];
    const [removed] = updatedSupportResponses.splice(result.source.index, 1);
    updatedSupportResponses.splice(result.destination.index, 0, removed);

    setSupportResponses(updatedSupportResponses);
  };

  const handleResponseDragEnd = (result) => {
    if (!result.destination) return;

    const updatedResponseResponses = [...responseResponses];
    const [removed] = updatedResponseResponses.splice(result.source.index, 1);
    updatedResponseResponses.splice(result.destination.index, 0, removed);

    setResponseResponses(updatedResponseResponses);
  };

  const getSupportSequence = () => {
    // Get the current order of Support responses
    setSupportSequence(supportResponses.map((response) => response.value));
    console.log('Saving Support Sequence:', supportResponses);
  };

  const getResponseSequence = () => {
    // Get the current order of Response responses
    setResponseSequence(responseResponses.map((response) => response.value));
    console.log('Saving Support Sequence:', responseResponses);
  };

  const saveSequence = (project_Type) => {
    const payload = {
      project_Type,
      sequenceandvalue: responseResponses.map((item, index) => ({
        id: item.id,
        value: item.value,
        sequence_No: index + 1
      }))
    };

    axios
      .post('https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/UpdateSequence', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Set the Authorization header with the token
        }
      })
      .then((res) => {
        console.log(`Successfully saved ${project_Type} sequence:`, res.data);
        console.log(`Successfully saved ${sequence} sequence:`, res.data);
      })
      .catch((err) => {
        console.error(`Error saving ${project_Type} sequence:`, err);
        enqueueSnackbar('Saved Successfully', {
          autoHideDuration: 1000,
          variant: 'success'
        });
      });
  };

  const saveSupport = (project_Type) => {
    const payload = {
      project_Type,
      sequenceandvalue: supportResponses.map((item, index) => ({
        id: item.id,
        value: item.value,
        sequence_No: index + 1
      }))
    };

    axios
      .post('https://techstephub.focusrtech.com:6060/techstep/api/AllProject/Service/UpdateSequence', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Set the Authorization header with the token
        }
      })
      .then((res) => {
        console.log(`Successfully saved ${project_Type} sequence:`, res.data);
        console.log(`Successfully saved ${sequence} sequence:`, res.data);
      })
      .catch((err) => {
        console.error(`Error saving ${project_Type} sequence:`, err);
        enqueueSnackbar('Saved Successfully', {
          autoHideDuration: 1000,
          variant: 'success'
        });
      });
  };

  return (
    // <Page title="Project Sequence Setup">
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Typography marginTop={-3} variant="h4" component="h4" paragraph>
        Project Sequence Setup
      </Typography>
      <Grid container spacing={3}>
        <Stack sx={{ marginTop: 10 }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={selectedRadio}
            onChange={(e) => setSelectedRadio(e.target.value)}
          >
            <FormControlLabel value="support" control={<Radio />} label="Support Project" />
            <FormControlLabel value="fixed" control={<Radio />} label="Fixed Bid" />
          </RadioGroup>
        </Stack>
        {selectedRadio === 'support' ? (
          <Grid item xs={7} md={6}>
            <Card className={classes.card}>
              <div className={classes.headingContainer}>
                <Typography variant="h5">Support Project</Typography>
              </div>
              <DragDropContext onDragEnd={handleSupportDragEnd}>
                <Droppable droppableId="supportList">
                  {(provided) => (
                    <ul className={classes.responseList} {...provided.droppableProps} ref={provided.innerRef}>
                      {supportResponses.map((response, index) => (
                        <Draggable key={response.id} draggableId={response.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              className={classes.responseItem}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {response.value}
                            </li>
                          )}
                        </Draggable>
                      ))}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <Button variant="contained" color="primary" onClick={() => saveSupport('Support', supportSequence)}>
                Save Sequence
              </Button>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <div className={classes.headingContainer}>
                <Typography variant="h5">Fixed Bid Project</Typography>
              </div>
              <DragDropContext onDragEnd={handleResponseDragEnd}>
                <Droppable droppableId="responseList">
                  {(provided) => (
                    <ul className={classes.responseList} {...provided.droppableProps} ref={provided.innerRef}>
                      {responseResponses.map((response, index) => (
                        <Draggable key={response.id} draggableId={response.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              className={classes.responseItem}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {response.value}
                            </li>
                          )}
                        </Draggable>
                      ))}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <Button variant="contained" color="primary" onClick={() => saveSequence('Fixed', responseSequence)}>
                Save Sequence
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
    // </Page>
  );
};

export default ProjectSequence;
