import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification,
  createBulkNotifications,
} from '../controllers/notificationController';

const router = express.Router();

// Routes that require authentication
router.use(protect);

// User notification routes
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

// Admin-only routes
router.post('/', authorize(['admin']), createNotification);
router.post('/bulk', authorize(['admin']), createBulkNotifications);

export default router;
