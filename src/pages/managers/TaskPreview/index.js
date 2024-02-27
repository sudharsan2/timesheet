import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import DownloadingIcon from '@mui/icons-material/Downloading';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

TaskPreview.propTypes = {
  isViewOpen: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired
};

export default function TaskPreview({ isViewOpen, setView }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const activities = [
    {
      id: 1,
      activity: 'Activity 1',
      created_by: 'Thangamani K (M1003)',
      created_at: new Date(),
      assignee: 'Thangamani K (M1003)'
    },
    {
      id: 2,
      activity: 'Activity 1',
      created_by: 'Thangamani K (M1003)',
      created_at: new Date(),
      assignee: 'Thangamani K (M1003)'
    },
    {
      id: 3,
      activity: 'Activity 1',
      created_by: 'Thangamani K (M1003)',
      created_at: new Date(),
      assignee: 'Thangamani K (M1003)'
    }
  ];

  const comments = [
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 1,
      comment: 'Comment 1 ',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    },
    {
      id: 2,
      comment: 'Comment 2',
      file_url: null,
      created_at: new Date(),
      created_by: 'Thangamani K (M1003)'
    }
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="lg"
      open={isViewOpen}
      onClose={() => setView(!isViewOpen)}
      aria-labelledby="epic-preview"
    >
      <DialogTitle id="epic-preview">Epic Details</DialogTitle>
      <DialogContent>
        <Box m={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <Card variant="outlined" sx={{ minWidth: 300 }}>
                <CardContent>
                  <List sx={{ maxHeight: 300 }}>
                    <ListItem>
                      <ListItemText primary="Current Manager" secondary="Thangamani K (M1003)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Project" secondary="LMW" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="EPIC" secondary="LMW SCM Implementation" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Work Load" secondary="High" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Start Date" secondary="High" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="End Date" secondary="High" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card variant="outlined" sx={{ minWidth: 300 }}>
                <CardContent>
                  {activities.length > 0 && (
                    <Grid item xs={12} sm={12} md={12}>
                      <List sx={{ maxHeight: 300 }}>
                        {activities.map((_x, i) => (
                          <div key={i}>
                            <ListItem>
                              <ListItemText primary={_x.activity} />
                              <Tooltip title="Change manager" placement="top">
                                <IconButton edge="end" aria-label="change" size="small" color="info">
                                  <Avatar
                                    alt="Remy Sharp"
                                    src="/static/mock-images/avatar_1.jpg"
                                    sx={{ width: 24, height: 24 }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </ListItem>
                            <Divider variant="fullWidth" component="li" />
                          </div>
                        ))}
                      </List>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card variant="outlined" sx={{ minWidth: 300 }}>
                <CardContent>
                  {comments.length > 0 && (
                    <Grid item xs={12} sm={12} md={12}>
                      <List>
                        {comments.map((_x, i) => (
                          <div key={i}>
                            <ListItem key={i}>
                              <ListItemText
                                primary={_x.comment}
                                secondary={
                                  <>
                                    <Typography variant="body2" color="text.primary">
                                      - {_x.created_by}
                                    </Typography>
                                    {format(_x.created_at, 'yyyy-MMM-dd hh:mm:ss')}
                                  </>
                                }
                              />
                              <Tooltip title="Download Attachments" placement="top">
                                <IconButton edge="start" aria-label="delete" size="small" color="info">
                                  <DownloadingIcon />
                                </IconButton>
                              </Tooltip>
                            </ListItem>
                            <Divider variant="fullWidth" component="li" />
                          </div>
                        ))}
                      </List>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setView(!isViewOpen)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
