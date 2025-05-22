// Mock data for the clinic management application
// This allows the application to function without a backend API

// Authentication mock data
export const authMockData = {
  user: {
    _id: 'mock-user-id-123',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true
  },
  token: 'mock-jwt-token-for-testing-purposes-only'
};

// Patients mock data
export const patientsMockData = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    dateOfBirth: '1985-05-15',
    address: '123 Main St, Anytown, US 12345',
    insuranceProvider: 'Health Plus',
    insuranceNumber: 'HP12345678',
    medicalHistory: 'Hypertension, Diabetes Type 2'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(234) 567-8901',
    dateOfBirth: '1990-08-22',
    address: '456 Oak Ave, Somewhere, US 67890',
    insuranceProvider: 'Medical Care',
    insuranceNumber: 'MC87654321',
    medicalHistory: 'Asthma, Allergies'
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '(345) 678-9012',
    dateOfBirth: '1978-12-10',
    address: '789 Pine St, Elsewhere, US 10112',
    insuranceProvider: 'United Health',
    insuranceNumber: 'UH11223344',
    medicalHistory: 'Arthritis'
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '(456) 789-0123',
    dateOfBirth: '1995-03-30',
    address: '101 Maple Dr, Nowhere, US 13141',
    insuranceProvider: 'Health Alliance',
    insuranceNumber: 'HA55667788',
    medicalHistory: 'None'
  },
  {
    id: 5,
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'michael.wilson@example.com',
    phone: '(567) 890-1234',
    dateOfBirth: '1980-07-05',
    address: '202 Cedar Ln, Anyplace, US 15161',
    insuranceProvider: 'Blue Cross',
    insuranceNumber: 'BC99887766',
    medicalHistory: 'High Cholesterol'
  }
];

// Medical records mock data
export const medicalRecordsMockData = [
  { id: 1, patientName: 'John Doe', recordType: 'Lab Results', date: '2025-05-01', status: 'Complete' },
  { id: 2, patientName: 'Jane Smith', recordType: 'Consultation', date: '2025-05-05', status: 'Pending Review' },
  { id: 3, patientName: 'Robert Johnson', recordType: 'X-Ray', date: '2025-05-10', status: 'Complete' },
  { id: 4, patientName: 'Emily Davis', recordType: 'Prescription', date: '2025-05-12', status: 'Active' },
  { id: 5, patientName: 'Michael Wilson', recordType: 'Surgery', date: '2025-05-15', status: 'Scheduled' }
];

// Prescriptions mock data
export const prescriptionsMockData = [
  { id: 1, patientName: 'John Doe', medication: 'Amoxicillin 500mg', dosage: '1 tablet TID', issueDate: '2025-05-01', expiryDate: '2025-06-01', status: 'Active' },
  { id: 2, patientName: 'Jane Smith', medication: 'Lisinopril 10mg', dosage: '1 tablet daily', issueDate: '2025-04-25', expiryDate: '2025-05-25', status: 'Active' },
  { id: 3, patientName: 'Robert Johnson', medication: 'Ibuprofen 400mg', dosage: '1 tablet Q6H PRN', issueDate: '2025-05-10', expiryDate: '2025-05-17', status: 'Active' },
  { id: 4, patientName: 'Emily Davis', medication: 'Loratadine 10mg', dosage: '1 tablet daily', issueDate: '2025-05-08', expiryDate: '2025-06-08', status: 'Active' },
  { id: 5, patientName: 'Michael Wilson', medication: 'Atorvastatin 20mg', dosage: '1 tablet daily at bedtime', issueDate: '2025-04-20', expiryDate: '2025-05-20', status: 'Expired' }
];

// Billing mock data
export const billingMockData = [
  { id: 1, patientName: 'John Doe', service: 'General Consultation', amount: 150.00, date: '2025-05-01', status: 'Paid' },
  { id: 2, patientName: 'Jane Smith', service: 'Lab Tests', amount: 275.50, date: '2025-05-05', status: 'Pending' },
  { id: 3, patientName: 'Robert Johnson', service: 'X-Ray', amount: 320.00, date: '2025-05-10', status: 'Insurance Claimed' },
  { id: 4, patientName: 'Emily Davis', service: 'Prescription Refill', amount: 75.00, date: '2025-05-12', status: 'Paid' },
  { id: 5, patientName: 'Michael Wilson', service: 'Surgery Consultation', amount: 200.00, date: '2025-05-15', status: 'Pending' }
];

// Inventory mock data
export const inventoryMockData = [
  { id: 1, name: 'Disposable Gloves (Box)', category: 'Equipment', quantity: 25, threshold: 10, unitPrice: 12.50, lastRestocked: '2025-05-01' },
  { id: 2, name: 'Ibuprofen 200mg', category: 'Medication', quantity: 150, threshold: 50, unitPrice: 0.75, lastRestocked: '2025-04-15' },
  { id: 3, name: 'Surgical Masks (Box)', category: 'Equipment', quantity: 8, threshold: 10, unitPrice: 18.99, lastRestocked: '2025-04-20' },
  { id: 4, name: 'Amoxicillin 500mg', category: 'Medication', quantity: 80, threshold: 30, unitPrice: 1.25, lastRestocked: '2025-05-05' },
  { id: 5, name: 'Blood Pressure Cuffs', category: 'Equipment', quantity: 5, threshold: 3, unitPrice: 45.00, lastRestocked: '2025-03-10' },
  { id: 6, name: 'Glucose Test Strips (Box)', category: 'Supplies', quantity: 12, threshold: 5, unitPrice: 29.99, lastRestocked: '2025-04-28' },
  { id: 7, name: 'Alcohol Wipes (Pack)', category: 'Supplies', quantity: 40, threshold: 15, unitPrice: 5.50, lastRestocked: '2025-05-10' },
  { id: 8, name: 'Antibacterial Solution (500ml)', category: 'Supplies', quantity: 7, threshold: 5, unitPrice: 8.75, lastRestocked: '2025-04-22' }
];

// Staff mock data
export const staffMockData = [
  { id: 1, firstName: 'Sarah', lastName: 'Johnson', role: 'Doctor', specialization: 'General Medicine', email: 'sarah.johnson@example.com', phone: '(123) 456-7890', status: 'Active' },
  { id: 2, firstName: 'David', lastName: 'Smith', role: 'Doctor', specialization: 'Pediatrics', email: 'david.smith@example.com', phone: '(234) 567-8901', status: 'Active' },
  { id: 3, firstName: 'Jessica', lastName: 'Brown', role: 'Nurse', specialization: 'General Care', email: 'jessica.brown@example.com', phone: '(345) 678-9012', status: 'Active' },
  { id: 4, firstName: 'Michael', lastName: 'Davis', role: 'Admin', specialization: 'Office Management', email: 'michael.davis@example.com', phone: '(456) 789-0123', status: 'Active' },
  { id: 5, firstName: 'Lisa', lastName: 'Wilson', role: 'Nurse', specialization: 'Pediatric Care', email: 'lisa.wilson@example.com', phone: '(567) 890-1234', status: 'On Leave' },
  { id: 6, firstName: 'Robert', lastName: 'Taylor', role: 'Doctor', specialization: 'Cardiology', email: 'robert.taylor@example.com', phone: '(678) 901-2345', status: 'Active' }
];

// Reports mock data
export const reportsMockData = {
  patientVisits: [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 49 },
    { month: 'Apr', count: 63 },
    { month: 'May', count: 58 }
  ],
  revenue: [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 15000 },
    { month: 'Mar', amount: 14200 },
    { month: 'Apr', amount: 16800 },
    { month: 'May', amount: 15700 }
  ],
  inventoryStatus: [
    { category: 'Medication', count: 12 },
    { category: 'Equipment', count: 8 },
    { category: 'Supplies', count: 15 }
  ],
  staffPerformance: [
    { name: 'Dr. Johnson', patients: 28 },
    { name: 'Dr. Smith', patients: 22 },
    { name: 'Dr. Taylor', patients: 25 }
  ]
};

// Notifications mock data
export const notificationsMockData = [
  { id: '1', type: 'info', title: 'Appointment Reminder', message: 'You have 3 appointments scheduled for tomorrow', read: false, createdAt: new Date('2025-05-21T09:00:00') },
  { id: '2', type: 'warning', title: 'Inventory Alert', message: 'Surgical Masks (Box) is below threshold level', read: false, createdAt: new Date('2025-05-21T10:30:00') },
  { id: '3', type: 'success', title: 'Payment Received', message: 'Payment of $150.00 received from John Doe', read: true, createdAt: new Date('2025-05-20T14:15:00') },
  { id: '4', type: 'error', title: 'System Error', message: 'Database backup failed. Please contact IT support.', read: true, createdAt: new Date('2025-05-19T23:45:00') },
  { id: '5', type: 'info', title: 'Staff Meeting', message: 'Monthly staff meeting scheduled for May 25th at 9:00 AM', read: false, createdAt: new Date('2025-05-18T11:20:00') }
];
