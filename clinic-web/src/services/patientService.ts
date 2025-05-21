import api from './api';
import { IPatient } from '../models/Patient';

export interface PatientFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
}

export const patientService = {
  // Get all patients
  getAllPatients: async (): Promise<IPatient[]> => {
    const response = await api.get('/patients');
    return response.data;
  },

  // Get a single patient by ID
  getPatientById: async (id: string): Promise<IPatient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create a new patient
  createPatient: async (patientData: PatientFormData): Promise<IPatient> => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  // Update a patient
  updatePatient: async (id: string, patientData: PatientFormData): Promise<IPatient> => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete a patient
  deletePatient: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  // Search patients
  searchPatients: async (query: string): Promise<IPatient[]> => {
    const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
}; 