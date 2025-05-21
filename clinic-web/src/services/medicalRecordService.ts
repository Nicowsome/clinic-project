import api from './api';
import { IMedicalRecord } from '../models/MedicalRecord';

export interface MedicalRecordFormData {
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
  notes?: string;
}

export const medicalRecordService = {
  // Get all medical records for a patient
  getPatientRecords: async (patientId: string): Promise<IMedicalRecord[]> => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  },

  // Get a single medical record by ID
  getRecordById: async (id: string): Promise<IMedicalRecord> => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },

  // Create a new medical record
  createRecord: async (recordData: MedicalRecordFormData): Promise<IMedicalRecord> => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  // Update a medical record
  updateRecord: async (id: string, recordData: MedicalRecordFormData): Promise<IMedicalRecord> => {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  },

  // Delete a medical record
  deleteRecord: async (id: string): Promise<void> => {
    await api.delete(`/medical-records/${id}`);
  },

  // Get records by date range
  getRecordsByDateRange: async (patientId: string, startDate: string, endDate: string): Promise<IMedicalRecord[]> => {
    const response = await api.get(`/medical-records/patient/${patientId}/date-range`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get records by doctor
  getRecordsByDoctor: async (doctor: string): Promise<IMedicalRecord[]> => {
    const response = await api.get(`/medical-records/doctor/${encodeURIComponent(doctor)}`);
    return response.data;
  },
}; 