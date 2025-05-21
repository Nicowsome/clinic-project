import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  recipientId: mongoose.Types.ObjectId;
  message: string;
  title?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  link?: string;
  linkText?: string;
  createdAt: Date;
  expiresAt?: Date;
}

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    type: {
      type: String,
      enum: ['success', 'error', 'warning', 'info'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    linkText: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create an index for automatic expiration of notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Add an index for efficiently retrieving notifications
notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
