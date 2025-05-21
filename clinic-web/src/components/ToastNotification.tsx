import React, { useEffect } from 'react';
import { Snackbar, Alert, AlertTitle, AlertColor } from '@mui/material';
import { useNotifications, Notification } from '../context/NotificationContext';

interface ToastNotificationProps {
  autoHideDuration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  autoHideDuration = 5000 
}) => {
  const { notifications } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Notification | null>(null);

  // Find the most recent notification to show as toast
  useEffect(() => {
    if (notifications.length > 0) {
      const recentNotification = notifications.find(n => !n.read && n.type !== 'info');
      if (recentNotification && (!current || current.id !== recentNotification.id)) {
        setCurrent(recentNotification);
        setOpen(true);
      }
    }
  }, [notifications, current]);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // After toast is closed, remove it from toast queue (but keep in notification center)
  const handleExited = () => {
    setCurrent(null);
  };

  // No notification to display
  if (!current) {
    return null;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ mb: 4 }}
      TransitionProps={{ onExited: handleExited }}
    >
      <Alert
        onClose={handleClose}
        severity={current.type as AlertColor}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {current.title && <AlertTitle>{current.title}</AlertTitle>}
        {current.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
