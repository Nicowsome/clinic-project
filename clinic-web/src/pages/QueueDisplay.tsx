import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { keyframes } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useClinicStore, QueueItem } from '../store/clinicStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

// Add audio file import (place your audio file in public folder)
const notificationSound = '/notification.mp3';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const QueueDisplay = (): JSX.Element => {
  const { queueItems, error, clearErrors } = useClinicStore();
  const [localQueue, setLocalQueue] = useState<QueueItem[]>([]);
  const [now, setNow] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string}>({
    open: false,
    message: ''
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lastInProgressId, setLastInProgressId] = useState<string | null>(null);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error });
      clearErrors();
    }
  }, [error, clearErrors]);

  // Live clock with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  // Update local queue when queueItems changes with loading state
  useEffect(() => {
    const updateQueue = async () => {
      try {
        setIsLoading(true);
        setLocalQueue([...queueItems]);
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to update queue' });
      } finally {
        setIsLoading(false);
      }
    };
    updateQueue();
  }, [queueItems]);

  const activeQueueItems = useMemo(() => 
    localQueue
      .filter((item: QueueItem) => 
        item.status === 'Waiting' || item.status === 'In Progress'
      )
      .sort((a: QueueItem, b: QueueItem) => {
        if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
        if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
        return (a.queueNumber || 0) - (b.queueNumber || 0);
      }),
    [localQueue]
  );

  const inProgressItem = activeQueueItems.find(item => item.status === 'In Progress');
  const waitingItems = activeQueueItems.filter(item => item.status === 'Waiting');
  const totalQueueCount = activeQueueItems.length;

  // Only show one queue item: in progress, or next waiting
  let displayQueueItem: QueueItem | undefined = undefined;
  if (inProgressItem) {
    displayQueueItem = inProgressItem;
  } else if (waitingItems.length > 0) {
    displayQueueItem = waitingItems[0];
  }

  // Modern gradient background
  const background = `linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)`;

  // Play sound when a new queue becomes In Progress
  useEffect(() => {
    const playNotification = async () => {
      if (displayQueueItem?.status === 'In Progress' && displayQueueItem.id !== lastInProgressId) {
        try {
          if (audioRef.current) {
            await audioRef.current.play();
            setLastInProgressId(displayQueueItem.id);
          }
        } catch (err) {
          console.error('Error playing notification sound:', err);
        }
      }
    };

    playNotification();
  }, [displayQueueItem, lastInProgressId]);

  const handleSnackbarClose = useCallback((): void => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Render Snackbar for notifications
  const renderSnackbar = useCallback((): JSX.Element => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  ), [snackbar, handleSnackbarClose]);

  // Render the snackbar component

  return (
    <Box 
      sx={{ 
        p: 4,
        minHeight: '100vh',
        background: background,
        animation: `${fadeIn} 0.5s ease-out`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Date and Time at the very top */}
      <Typography 
        variant="h2" 
        sx={{ 
          color: '#64748b',
          mb: 4,
          textAlign: 'center',
          fontWeight: 800,
          letterSpacing: 2,
          fontSize: { xs: '2.5rem', md: '4.5rem' },
          lineHeight: 1.1,
        }}
      >
        {now.toLocaleDateString()} {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </Typography>

      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 800,
          color: '#2563eb',
          mb: 2,
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        Current Queue
      </Typography>

      <Typography 
        variant="h5" 
        sx={{ 
          color: '#334155',
          mb: 4,
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        Total Patients in Queue: {totalQueueCount}
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : activeQueueItems.length > 0 && !inProgressItem ? (
        <Box 
          sx={{ 
            mb: 6,
            p: 4,
            background: 'rgba(255, 193, 7, 0.15)',
            borderRadius: 4,
            textAlign: 'center',
            animation: `${fadeIn} 0.5s ease-out`,
            boxShadow: '0 4px 32px 0 rgba(255,193,7,0.08)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#b45309',
              fontWeight: 700,
            }}
          >
            Please Wait
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <audio id="notification-sound" preload="auto">
            <source src={notificationSound} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
      
      {renderSnackbar()}

      <Grid container spacing={6} sx={{ maxWidth: 1800, width: '100%', justifyContent: 'center' }}>
        {displayQueueItem && (
          <Grid item xs={12} md={6} key={displayQueueItem.id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card 
              sx={{ 
                borderRadius: 8,
                boxShadow: '0 12px 48px 0 rgba(31, 41, 55, 0.18)',
                animation: `${fadeIn} 0.5s ease-out`,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(18px)',
                border: '2px solid rgba(255,255,255,0.5)',
                transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-10px) scale(1.04)',
                  boxShadow: '0 24px 64px 0 rgba(31, 41, 55, 0.22)',
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: { xs: 420, md: 600 },
                minWidth: { xs: 0, md: 700 },
                maxWidth: 900,
                width: '100%',
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 10 }, textAlign: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: { xs: 3, md: 6 } }}>
                  <Avatar
                    sx={{
                      bgcolor: displayQueueItem.status === 'In Progress' ? '#2563eb' : '#f59e42',
                      width: { xs: 100, md: 160 },
                      height: { xs: 100, md: 160 },
                      boxShadow: '0 4px 16px rgba(31,41,55,0.12)',
                      mr: { xs: 2, md: 6 },
                    }}
                  >
                    {displayQueueItem.status === 'In Progress' ? (
                      <CheckCircleIcon sx={{ color: '#fff', fontSize: { xs: 64, md: 120 } }} />
                    ) : (
                      <HourglassEmptyIcon sx={{ color: '#fff', fontSize: { xs: 64, md: 120 } }} />
                    )}
                  </Avatar>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      color: '#2563eb',
                      fontSize: { xs: '8rem', md: '16rem' },
                      lineHeight: 1,
                      textShadow: '0 8px 48px #60a5fa44',
                      animation: displayQueueItem.status === 'In Progress' ? `${pulse} 2s infinite` : 'none',
                    }}
                  >
                    {displayQueueItem.queueNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: { xs: 2, md: 4 } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: displayQueueItem.status === 'In Progress' ? '#2563eb' : '#f59e42',
                      fontWeight: 800,
                      letterSpacing: 2,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      px: { xs: 3, md: 6 },
                      py: { xs: 1, md: 2 },
                      borderRadius: 4,
                      background: displayQueueItem.status === 'In Progress' ? 'rgba(37,99,235,0.10)' : 'rgba(245,158,66,0.13)',
                      boxShadow: displayQueueItem.status === 'In Progress' ? '0 4px 16px #2563eb22' : '0 4px 16px #f59e4222',
                      display: 'inline-block',
                    }}
                  >
                    {displayQueueItem.status === 'In Progress' ? 'In Progress' : 'Waiting'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {activeQueueItems.length === 0 && (
        <Typography 
          variant="h4" 
          color="text.secondary"
          sx={{ 
            textAlign: 'center',
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          No patients in queue
        </Typography>
      )}

      <audio ref={audioRef} src="/sounds/queue-in-progress.mp3" preload="auto" />
    </Box>
  );
};

export default QueueDisplay;