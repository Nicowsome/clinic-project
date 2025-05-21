import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  lastVisit: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Add index for faster queries
PatientSchema.index({ firstName: 1, lastName: 1 });

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema); 