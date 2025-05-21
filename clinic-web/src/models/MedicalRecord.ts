import mongoose, { Document, Schema } from 'mongoose';
import { IPatient } from './Patient';

export interface IMedicalRecord extends Document {
  patientId: IPatient['_id'];
  date: Date;
  diagnosis: string;
  treatment: string;
  doctor: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true, default: Date.now },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  doctor: { type: String, required: true },
  notes: { type: String },
}, {
  timestamps: true,
});

// Add indexes for faster queries
MedicalRecordSchema.index({ patientId: 1, date: -1 });
MedicalRecordSchema.index({ doctor: 1 });

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema); 