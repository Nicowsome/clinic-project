import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  authMockData,
  patientsMockData,
  medicalRecordsMockData,
  prescriptionsMockData,
  billingMockData,
  inventoryMockData,
  staffMockData,
  reportsMockData,
  notificationsMockData
} from './mockData';

// Create axios instance
const api = axios.create();

// Create mock adapter
const mock = new MockAdapter(api, { delayResponse: 500 }); // 500ms delay to simulate network

// Auth endpoints
mock.onPost('/api/v1/auth/login').reply(200, {
  status: 'success',
  token: authMockData.token,
  data: { user: authMockData.user }
});

mock.onGet('/api/v1/auth/profile').reply(config => {
  // Check for Authorization header
  const token = config.headers?.Authorization;
  if (token) {
    return [200, {
      status: 'success',
      data: { user: authMockData.user }
    }];
  }
  return [401, { status: 'error', message: 'Not authenticated' }];
});

// Patients endpoints
mock.onGet('/api/v1/patients').reply(200, {
  status: 'success',
  data: { patients: patientsMockData }
});

mock.onGet(new RegExp('/api/v1/patients/\\d+')).reply(config => {
  const id = parseInt(config.url?.split('/').pop() || '0');
  const patient = patientsMockData.find(p => p.id === id);
  
  if (patient) {
    return [200, { status: 'success', data: { patient } }];
  }
  return [404, { status: 'error', message: 'Patient not found' }];
});

// Medical Records endpoints
mock.onGet('/api/v1/medical-records').reply(200, {
  status: 'success',
  data: { records: medicalRecordsMockData }
});

// Prescriptions endpoints
mock.onGet('/api/v1/prescriptions').reply(200, {
  status: 'success',
  data: { prescriptions: prescriptionsMockData }
});

// Billing endpoints
mock.onGet('/api/v1/billing').reply(200, {
  status: 'success',
  data: { bills: billingMockData }
});

// Inventory endpoints
mock.onGet('/api/v1/inventory').reply(200, {
  status: 'success',
  data: { items: inventoryMockData }
});

// Staff endpoints
mock.onGet('/api/v1/staff').reply(200, {
  status: 'success',
  data: { staff: staffMockData }
});

// Reports endpoints
mock.onGet('/api/v1/reports/summary').reply(200, {
  status: 'success',
  data: reportsMockData
});

// Notifications endpoints
mock.onGet('/api/v1/notifications').reply(200, {
  status: 'success',
  data: { notifications: notificationsMockData }
});

mock.onPut(new RegExp('/api/v1/notifications/\\w+/read')).reply(config => {
  const id = config.url?.split('/')[3];
  return [200, { status: 'success', message: `Notification ${id} marked as read` }];
});

mock.onDelete(new RegExp('/api/v1/notifications/\\w+')).reply(config => {
  const id = config.url?.split('/')[3];
  return [200, { status: 'success', message: `Notification ${id} deleted` }];
});

// For any unhandled requests
mock.onAny().reply(404, {
  status: 'error',
  message: 'API endpoint not found'
});

export default api;
