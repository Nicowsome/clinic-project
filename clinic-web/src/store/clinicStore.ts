import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Gender = 'Male' | 'Female';
export type AppointmentType = 'Check-up' | 'Consultation' | 'Follow-up' | 'Emergency';
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type QueueStatus = 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
export type MedicalRecordStatus = 'Active' | 'Resolved' | 'Follow-up';

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  tags: string[];
}

export interface Patient {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  dateOfBirth?: string;
  nationalId?: string;
  maritalStatus?: string;
  occupation?: string;
  medicalConditions?: string[];
  surgicalHistory?: string[];
  familyHistory?: string[];
  allergies?: string[];
  labTests?: Array<{ name: string; date?: string; results?: string }>;
  imagingResults?: Array<{ type: string; date?: string; findings?: string }>;
  medications?: Array<{ name: string; dosage: string; frequency: string; duration: string; doctor: string }>;
  procedures?: Array<{ name: string; date?: string; doctor?: string }>;
  progressNotes?: Array<{ content: string; date?: string }>;
  referrals?: Array<{ specialist: string; reason: string; date?: string }>;
  insuranceInfo?: string;
  consentForms?: Array<{ type: string; date?: string }>;
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  respiratoryRate?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  attachments?: Attachment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  doctor: string;
  notes: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
  notes?: string;
  status: MedicalRecordStatus;
}

export interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  queueNumber: number;
  status: QueueStatus;
  type: AppointmentType;
  doctor: string;
  timestamp: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  isAvailable: boolean;
}

export interface ClinicStore {
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  queueItems: QueueItem[];
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => Promise<void>;
  deletePatient: (id: string, onConfirm: () => void) => Promise<void>;
  deleteAppointment: (id: string, onConfirm: () => void) => Promise<void>;
  deleteMedicalRecord: (id: string, onConfirm: () => void) => Promise<void>;
  addToQueue: (item: Omit<QueueItem, 'id' | 'queueNumber'>) => Promise<void>;
  updateQueueItem: (id: string, item: Partial<QueueItem>) => Promise<void>;
  removeFromQueue: (id: string, onConfirm: () => void) => Promise<void>;
  getNextQueueNumber: () => number;
  clearErrors: () => void;
  logout: () => void;
}

// Validation functions
const validatePatient = (patient: Partial<Patient>): boolean => {
  if (!patient.firstName || !patient.lastName) return false;
  if (patient.age && (patient.age < 0 || patient.age > 150)) return false;
  if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) return false;
  return true;
};

const validateAppointment = (appointment: Partial<Appointment>): boolean => {
  if (!appointment.patientId || !appointment.date || !appointment.time) return false;
  if (new Date(appointment.date) < new Date()) return false;
  return true;
};

const validateMedicalRecord = (record: Partial<MedicalRecord>): boolean => {
  if (!record.patientId || !record.diagnosis) return false;
  return true;
};

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Dummy data
const dummyPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Smith',
    age: 45,
    gender: 'Male',
    phone: '+1 234-567-8901',
    email: 'john.smith@email.com',
    address: '123 Main St, City, State',
    lastVisit: '2024-03-15',
  },
  {
    id: '2',
    firstName: 'Sarah',
    middleName: 'Elizabeth',
    lastName: 'Johnson',
    age: 32,
    gender: 'Female',
    phone: '+1 234-567-8902',
    email: 'sarah.j@email.com',
    address: '456 Oak Ave, City, State',
    lastVisit: '2024-03-10',
  },
  {
    id: '3',
    firstName: 'Michael',
    middleName: 'David',
    lastName: 'Brown',
    age: 28,
    gender: 'Male',
    phone: '+1 234-567-8903',
    email: 'michael.b@email.com',
    address: '789 Pine Rd, City, State',
    lastVisit: '2024-03-05',
  },
  {
    id: '4',
    firstName: 'Emily',
    middleName: 'Grace',
    lastName: 'Davis',
    age: 36,
    gender: 'Female',
    phone: '+1 234-567-8904',
    email: 'emily.davis@email.com',
    address: '321 Maple St, City, State',
    lastVisit: '2024-03-18',
  },
  {
    id: '5',
    firstName: 'David',
    middleName: 'Lee',
    lastName: 'Garcia',
    age: 52,
    gender: 'Male',
    phone: '+1 234-567-8905',
    email: 'david.garcia@email.com',
    address: '654 Cedar Ave, City, State',
    lastVisit: '2024-03-19',
  },
  {
    id: '6',
    firstName: 'Sophia',
    middleName: 'Marie',
    lastName: 'Martinez',
    age: 29,
    gender: 'Female',
    phone: '+1 234-567-8906',
    email: 'sophia.martinez@email.com',
    address: '987 Spruce Rd, City, State',
    lastVisit: '2024-03-20',
  },
  {
    id: '7',
    firstName: 'James',
    middleName: 'Edward',
    lastName: 'Lopez',
    age: 41,
    gender: 'Male',
    phone: '+1 234-567-8907',
    email: 'james.lopez@email.com',
    address: '159 Elm St, City, State',
    lastVisit: '2024-03-21',
  },
  {
    id: '8',
    firstName: 'Olivia',
    middleName: 'Rose',
    lastName: 'Wilson',
    age: 34,
    gender: 'Female',
    phone: '+1 234-567-8908',
    email: 'olivia.wilson@email.com',
    address: '753 Birch Blvd, City, State',
    lastVisit: '2024-03-22',
  },
];

const dummyAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    date: '2024-03-20',
    time: '09:00',
    type: 'Check-up',
    status: 'Scheduled',
    doctor: 'Dr. Wilson',
    notes: 'Regular check-up',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Johnson',
    date: '2024-03-20',
    time: '10:30',
    type: 'Consultation',
    status: 'Scheduled',
    doctor: 'Dr. Martinez',
    notes: 'Follow-up consultation',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    date: '2024-03-21',
    time: '14:00',
    type: 'Follow-up',
    status: 'Scheduled',
    doctor: 'Dr. Wilson',
    notes: 'Post-surgery follow-up',
  },
];

const dummyMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    date: '2024-03-15',
    reason: 'Hypertension',
    diagnosis: 'Hypertension',
    treatment: 'Lisinopril 10mg daily',
    doctor: 'Dr. Wilson',
    status: 'Active',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Johnson',
    date: '2024-03-10',
    reason: 'Type 2 Diabetes',
    diagnosis: 'Type 2 Diabetes',
    treatment: 'Metformin 500mg twice daily',
    doctor: 'Dr. Martinez',
    status: 'Active',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    date: '2024-03-05',
    reason: 'Acute Bronchitis',
    diagnosis: 'Acute Bronchitis',
    treatment: 'Azithromycin 500mg once daily',
    doctor: 'Dr. Wilson',
    status: 'Active',
  },
];

const dummyQueue: QueueItem[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Smith, John Robert',
    queueNumber: 1,
    status: 'Waiting',
    type: 'Check-up',
    doctor: 'Dr. Wilson',
    timestamp: `${today}T09:00:00`,
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Johnson, Sarah Elizabeth',
    queueNumber: 2,
    status: 'Waiting',
    type: 'Consultation',
    doctor: 'Dr. Martinez',
    timestamp: `${today}T09:15:00`,
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Brown, Michael David',
    queueNumber: 3,
    status: 'Waiting',
    type: 'Follow-up',
    doctor: 'Dr. Brown',
    timestamp: `${today}T09:30:00`,
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Davis, Emily Grace',
    queueNumber: 4,
    status: 'Waiting',
    type: 'Emergency',
    doctor: 'Dr. Wilson',
    timestamp: `${today}T09:45:00`,
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'Garcia, David Lee',
    queueNumber: 5,
    status: 'Waiting',
    type: 'Check-up',
    doctor: 'Dr. Martinez',
    timestamp: `${today}T10:00:00`,
  },
  {
    id: '6',
    patientId: '6',
    patientName: 'Martinez, Sophia Marie',
    queueNumber: 6,
    status: 'Waiting',
    type: 'Consultation',
    doctor: 'Dr. Brown',
    timestamp: `${today}T10:15:00`,
  },
  {
    id: '7',
    patientId: '7',
    patientName: 'Lopez, James Edward',
    queueNumber: 7,
    status: 'Waiting',
    type: 'Follow-up',
    doctor: 'Dr. Wilson',
    timestamp: `${today}T10:30:00`,
  },
  {
    id: '8',
    patientId: '8',
    patientName: 'Wilson, Olivia Rose',
    queueNumber: 8,
    status: 'Waiting',
    type: 'Emergency',
    doctor: 'Dr. Martinez',
    timestamp: `${today}T10:45:00`,
  },
];

const dummyDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    specialization: 'General Medicine',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    specialization: 'Pediatrics',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Dr. Michael Brown',
    specialization: 'Cardiology',
    isAvailable: false,
  },
  {
    id: '4',
    name: 'Dr. Emily Davis',
    specialization: 'Dermatology',
    isAvailable: true,
  },
];

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      patients: [],
      appointments: [],
      medicalRecords: [],
      queueItems: [],
      doctors: dummyDoctors,
      loading: false,
      error: null,

      addPatient: async (patient) => {
        try {
          if (!validatePatient(patient)) {
            throw new Error('Invalid patient data');
          }
          set(() => ({
            patients: [...get().patients, { ...patient, id: Date.now().toString() }],
            error: null,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to add patient',
          }));
          throw error;
        }
      },

      addAppointment: async (appointment) => {
        if (!validateAppointment(appointment)) {
          throw new Error('Invalid appointment data');
        }
        set(() => ({
          appointments: [...get().appointments, { ...appointment, id: Date.now().toString() }],
        }));
      },

      addMedicalRecord: async (record) => {
        if (!validateMedicalRecord(record)) {
          throw new Error('Invalid medical record data');
        }
        set(() => ({
          medicalRecords: [...get().medicalRecords, { ...record, id: Date.now().toString() }],
        }));
      },

      updatePatient: async (id, patient) => {
        if (!validatePatient(patient)) {
          throw new Error('Invalid patient data');
        }
        set(() => ({
          patients: get().patients.map((p) => (p.id === id ? { ...p, ...patient } : p)),
        }));
      },

      updateAppointment: async (id, appointment) => {
        if (!validateAppointment(appointment)) {
          throw new Error('Invalid appointment data');
        }
        set(() => ({
          appointments: get().appointments.map((a) => (a.id === id ? { ...a, ...appointment } : a)),
        }));
      },

      updateMedicalRecord: async (id, record) => {
        if (!validateMedicalRecord(record)) {
          throw new Error('Invalid medical record data');
        }
        set(() => ({
          medicalRecords: get().medicalRecords.map((r) => (r.id === id ? { ...r, ...record } : r)),
        }));
      },

      deletePatient: async (id, onConfirm) => {
        const store = get();
        // Check if patient has any associated records
        const hasAppointments = store.appointments.some(a => a.patientId === id);
        const hasMedicalRecords = store.medicalRecords.some(r => r.patientId === id);
        
        if (hasAppointments || hasMedicalRecords) {
          throw new Error('Cannot delete patient with associated records');
        }
        
        onConfirm();
        set(() => ({
          patients: get().patients.filter((p) => p.id !== id),
        }));
      },

      deleteAppointment: async (id, onConfirm) => {
        onConfirm();
        set(() => ({
          appointments: get().appointments.filter((a) => a.id !== id),
        }));
      },

      deleteMedicalRecord: async (id, onConfirm) => {
        onConfirm();
        set(() => ({
          medicalRecords: get().medicalRecords.filter((r) => r.id !== id),
        }));
      },

      addToQueue: async (item) => set(() => ({
        queueItems: [...get().queueItems, { 
          ...item, 
          id: Date.now().toString(),
          queueNumber: get().getNextQueueNumber(),
        }],
      })),

      updateQueueItem: async (id, item) => set(() => ({
        queueItems: get().queueItems.map((q) => (q.id === id ? { ...q, ...item } : q)),
      })),

      removeFromQueue: async (id, onConfirm) => {
        onConfirm();
        set(() => ({
          queueItems: get().queueItems.filter((q) => q.id !== id),
        }));
      },

      getNextQueueNumber: () => {
        const maxNumber = Math.max(...get().queueItems.map((q) => q.queueNumber), 0);
        return maxNumber + 1;
      },

      clearErrors: () => {
        set(() => ({
          error: null,
        }));
      },

      logout: () => {
        set({
          patients: dummyPatients,
          appointments: dummyAppointments,
          medicalRecords: dummyMedicalRecords,
          queueItems: dummyQueue,
          doctors: dummyDoctors,
          loading: false,
          error: null,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
      },
    }),
    {
      name: 'clinic-storage',
    }
  )
);

// Initialize store with dummy data if empty
const initializeStore = () => {
  const store = useClinicStore.getState();
  if (store.patients.length === 0) {
    useClinicStore.setState({
      patients: dummyPatients,
      appointments: dummyAppointments,
      medicalRecords: dummyMedicalRecords,
      queueItems: dummyQueue,
      doctors: dummyDoctors,
    });
  }
};

// Call initialization
initializeStore(); 