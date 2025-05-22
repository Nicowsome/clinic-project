import axios from 'axios';
import { Notification } from '../context/NotificationContext';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://clinic-api-demo.herokuapp.com/api/v1';

// Interface for API notification objects (different from frontend Notification objects)
interface ApiNotification {
  _id: string;
  recipientId: string;
  message: string;
  title?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  link?: string;
  linkText?: string;
  createdAt: string;
  expiresAt?: string;
}

// Convert API notification to frontend notification
const mapApiToFrontendNotification = (apiNotification: ApiNotification): Notification => ({
  id: apiNotification._id,
  message: apiNotification.message,
  title: apiNotification.title,
  type: apiNotification.type,
  read: apiNotification.read,
  createdAt: new Date(apiNotification.createdAt),
  link: apiNotification.link,
  linkText: apiNotification.linkText,
});

// Function to fetch all notifications
export const fetchNotifications = async (token: string, page = 1, limit = 20, readStatus?: boolean) => {
  try {
    // Build query parameters
    const params: Record<string, string | number | boolean> = { page, limit };
    if (readStatus !== undefined) {
      params.read = readStatus;
    }

    // Make API request
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    // Map API notifications to frontend format
    const notifications = response.data.data.notifications.map(mapApiToFrontendNotification);
    
    return {
      notifications,
      pagination: response.data.data.pagination,
      unreadCount: response.data.data.unreadCount,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Function to mark a notification as read
export const markNotificationAsRead = async (token: string, notificationId: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return mapApiToFrontendNotification(response.data.data);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Function to mark all notifications as read
export const markAllNotificationsAsRead = async (token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/read-all`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.modifiedCount;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Function to delete a notification
export const deleteNotification = async (token: string, notificationId: string) => {
  try {
    await axios.delete(`${API_URL}/notifications/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Function to delete all notifications
export const deleteAllNotifications = async (token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.deletedCount;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};
