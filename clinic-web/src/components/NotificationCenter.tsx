import React, { useState } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
  Stack,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useNotifications, Notification, NotificationType } from '../context/NotificationContext';

interface NotificationCenterProps {
  maxHeight?: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ maxHeight = 400 }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'info':
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getBackgroundColorForType = (type: NotificationType, read: boolean = false) => {
    if (read) return 'background.paper';
    
    switch (type) {
      case 'success':
        return 'success.light';
      case 'warning':
        return 'warning.light';
      case 'error':
        return 'error.light';
      case 'info':
      default:
        return 'info.light';
    }
  };

  const renderNotification = (notification: Notification) => {
    return (
      <ListItem
        key={notification.id}
        alignItems="flex-start"
        sx={{
          backgroundColor: getBackgroundColorForType(notification.type, notification.read),
          opacity: notification.read ? 0.8 : 1,
          mb: 0.5,
          borderRadius: 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        secondaryAction={
          <Stack direction="row" spacing={1}>
            {!notification.read && (
              <IconButton
                edge="end"
                aria-label="mark as read"
                onClick={() => markAsRead(notification.id)}
                size="small"
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => removeNotification(notification.id)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        }
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {getIconForType(notification.type)}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="subtitle2" component="div" fontWeight={notification.read ? 400 : 600}>
              {notification.title || notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                {notification.message}
              </Typography>
              {notification.link && (
                <Button 
                  size="small" 
                  href={notification.link} 
                  sx={{ mt: 1 }}
                  variant="outlined"
                >
                  {notification.linkText || 'View'}
                </Button>
              )}
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </>
          }
          primaryTypographyProps={{
            fontSize: '0.875rem',
          }}
          secondaryTypographyProps={{
            fontSize: '0.8125rem',
          }}
        />
      </ListItem>
    );
  };

  // Filter notifications based on tab
  const filteredNotifications = tabValue === 0 
    ? notifications 
    : tabValue === 1 
      ? notifications.filter(notification => !notification.read)
      : notifications.filter(notification => notification.read);

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="error" overlap="circular">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 360, maxWidth: '100%' }}>
          <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Button 
              variant="text" 
              size="small" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </Box>
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab label="All" />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label="Read" />
          </Tabs>
          
          <Divider />

          <Box sx={{ maxHeight, overflow: 'auto' }}>
            {filteredNotifications.length > 0 ? (
              <List sx={{ p: 1 }}>
                {filteredNotifications.map(renderNotification)}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary" variant="body2">
                  No notifications
                </Typography>
              </Box>
            )}
          </Box>

          {notifications.length > 0 && (
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
              <Button size="small" onClick={clearAll} fullWidth>
                Clear all
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
