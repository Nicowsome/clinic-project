import { Request, Response } from 'express';
import Notification, { INotification } from '../models/notification';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all notifications for the current user
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user?._id;

    // Query parameters for pagination and filtering
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const readStatus = req.query.read;

    const query: any = { recipientId: userId };

    // Filter by read status if provided
    if (readStatus !== undefined) {
      query.read = readStatus === 'true';
    }

    // Count total notifications matching the query
    const totalCount = await Notification.countDocuments(query);

    // Fetch notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get unread count for the badge
    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: (error as Error).message,
    });
  }
};

// Mark a notification as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Find and update the notification
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: (error as Error).message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    // Update all unread notifications for the user
    const result = await Notification.updateMany(
      { recipientId: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: (error as Error).message,
    });
  }
};

// Delete a notification
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Find and delete the notification
    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipientId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: (error as Error).message,
    });
  }
};

// Delete all notifications for the current user
export const deleteAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    // Delete all notifications for the user
    const result = await Notification.deleteMany({ recipientId: userId });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all notifications',
      error: (error as Error).message,
    });
  }
};

// Create a new notification (admin/system only)
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { recipientId, message, title, type, link, linkText, expiresIn } = req.body;

    // Validate required fields
    if (!recipientId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message are required',
      });
    }

    // Calculate expiration date if provided
    let expiresAt;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 1000 * 60 * 60 * 24); // Convert days to milliseconds
    }

    // Create the notification
    const notification = await Notification.create({
      recipientId,
      message,
      title,
      type: type || 'info',
      link,
      linkText,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: (error as Error).message,
    });
  }
};

// Create notifications for multiple users (admin/system only)
export const createBulkNotifications = async (req: Request, res: Response) => {
  try {
    const { recipientIds, message, title, type, link, linkText, expiresIn } = req.body;

    // Validate required fields
    if (!recipientIds || !recipientIds.length || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient IDs and message are required',
      });
    }

    // Calculate expiration date if provided
    let expiresAt;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 1000 * 60 * 60 * 24); // Convert days to milliseconds
    }

    // Create notifications for each recipient
    const notifications = recipientIds.map((recipientId: string) => ({
      recipientId,
      message,
      title,
      type: type || 'info',
      link,
      linkText,
      expiresAt,
    }));

    // Insert all notifications
    const result = await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Created ${result.length} notifications`,
      count: result.length,
    });
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bulk notifications',
      error: (error as Error).message,
    });
  }
};
