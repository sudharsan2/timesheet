import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
import { useNavigate } from 'react-router';
import axios from 'axios';
// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  List,
  Stack,
  Snackbar,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { MIconButton } from '../../components/@material-extend';
import { PATH_DASHBOARD } from '../../routes/paths';

/* eslint-disable */

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  return {
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  return (
    <ListItemButton
      to="#"
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px'
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <img alt="Notification" src={`${process.env.PUBLIC_URL}/static/icons/ic_notification_chat.svg`} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={notification}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date())}
          </Typography>
        }
      />
      <ListItemAvatar>
        <Tooltip title="Mark as read">
          <MIconButton color="primary">
            <Icon icon={doneAllFill} width={20} height={20} />
          </MIconButton>
        </Tooltip>
      </ListItemAvatar>
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem('accessToken');

  const [notyCount, setNotyCount] = useState(0);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState([]);
  const [notifyMsg, setNotifyMsg] = useState();
  const [notifyId, setNofityId] = useState();
  const totalUnRead = notyCount;
  console.log('99999', notyCount);
  const [notId, setNotId] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get('https://techstephub.focusrtech.com:6060/techstep/api/notification/service/getMessage', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        const notificationMsg = res.data.notificationMsg;
        setNotificationMsg(notificationMsg);
        console.log('NOTIFYID', notificationMsg);
        const notificationMs = notificationMsg.map((val) => {
          return val.notificationMsg;
        });
        const notificationIds = notificationMsg.map((val) => {
          return val.id;
        });
        console.log('9009', notificationIds);
        setNotId(notificationIds);
        console.log('sdf', res.data);
        setNotyCount(res.data.count);
        console.log('first,', notyCount);
        setNotifyMsg(notificationMs);
        setNotifications(notificationMs); // Update notifications with API data
        const notificationId = notificationMsg.map((val) => {
          return val.id;
        });

        setNofityId(
          notificationId.map((val) => {
            val.id;
          })
        );
        console.log('777', notifyId);
        console.log('first', notificationId);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  // const fetchNotificationCount = () => {
  //   setTimeout(() => {
  //     const newNotificationCount = Math.floor(Math.random() * 1);
  //     setNotyCount(newNotificationCount);
  //   }, 2000); // Simulate an API call
  // };

  // useEffect(() => {
  //   fetchNotificationCount();
  // }, []);

  useEffect(() => {
    if (notyCount > 0) {
      enqueueSnackbar(`You have ${notyCount} new notifications`, {
        variant: 'info',
        autoHideDuration: 5000 // Adjust as needed
      });
    }
  }, [notyCount, enqueueSnackbar]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log('9090', notifyMsg);
  console.log('hi', notifyId);

  const onDelete = (notId) => {
    console.log('Deleting notification with id:', notId);

    if (!notId) {
      console.error('Invalid id:', notId);
      return;
    }
    axios
      .get(`https://techstephub.focusrtech.com:6060/techstep/api/notification/service/markRead?id=${notId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {
        console.log('Response data:', res.data);
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.notId !== notId)
        );
        // window.location.reload();
        // enqueueSnackbar('Message Readed', {
        //   autoHideDuration: 2000,
        //   variant: 'success'
        // });
        // setSuccess(true);
        setTimeout(
          () => handleClose(),
          enqueueSnackbar('Message Readed', {
            autoHideDuration: 2000,
            variant: 'success'
          }),
          setSuccess(false),
          window.location.reload(),
          2000
        );
        // handleClose();
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={notyCount} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 360 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {notyCount} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider />
        <Snackbar
          open={false} // Snackbar will be triggered programmatically
          onClose={() => {}} // No need to close it manually
          message={''} // Empty message, since the message is set dynamically
        />

        {notifications.length === 0 ? (
          <Stack>
            <img alt="No data" src={`${process.env.PUBLIC_URL}/static/icons/ic_notification_mail.svg`} />
          </Stack>
        ) : (
          <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  New
                </ListSubheader>
              }
            >
              {notificationMsg.slice(0, 3).map((notification, index) => (
                <div key={index} onClick={() => onDelete(notification.id)}>
                  <NotificationItem notification={notification.notificationMsg} />
                </div>
              ))}
            </List>
          </Scrollbar>
        )}
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to={PATH_DASHBOARD.general.root}>
            Go to dashboard
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
