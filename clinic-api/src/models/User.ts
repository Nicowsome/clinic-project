import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions, TokenExpiredError } from 'jsonwebtoken';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'staff';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in query results by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'staff'],
    default: 'staff'
  },
  isActive: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  // Set default expiration to 24 hours (in seconds)
  // Using a numeric value (in seconds) for expiresIn to avoid TypeScript issues
  const defaultExpiry = 86400; // 24 hours in seconds
  
  // Create sign options object
  const options: SignOptions = {
    expiresIn: defaultExpiry // Numeric value in seconds is compatible with jsonwebtoken types
  };
  
  return jwt.sign(
    { id: this._id, role: this.role },
    secret,
    options
  );
};

// Add indexes (email is already unique, so no need for explicit index)
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema); 