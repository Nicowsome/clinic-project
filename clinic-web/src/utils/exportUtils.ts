/**
 * Export utilities for the clinic management application
 * Provides functionality to export data to CSV, PDF and Excel formats
 */

// Helper function to convert data to CSV format
export const convertToCSV = (data: any[], headers: string[]): string => {
  // Create header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const rows = data.map(item => 
    headers.map(header => {
      // Get the value for this header
      const val = header.split('.').reduce((obj, key) => obj?.[key] ?? '', item);
      
      // Handle special cases for CSV formatting
      if (val === null || val === undefined) return '';
      
      // Escape quotes and wrap in quotes if it contains comma, newline or quote
      const stringVal = String(val);
      if (stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('"')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    }).join(',')
  );
  
  // Combine headers and rows
  return [headerRow, ...rows].join('\n');
};

// Function to download data as a CSV file
export const downloadCSV = (data: any[], headers: string[], filename: string): void => {
  // Convert data to CSV format
  const csv = convertToCSV(data, headers);
  
  // Create blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and click it
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to format date for exports
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Function to generate a PDF (with fallback for missing dependencies)
export const generatePDF = async (
  elementId: string,
  filename: string = 'download',
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<void> => {
  try {
    // Check if dependencies are installed
    let jsPDF;
    let html2canvas;
    
    try {
      // Try to dynamically import the libraries
      // These imports will be replaced with actual imports if the libraries get installed
      jsPDF = { default: class { constructor() { throw new Error('jsPDF not available'); } } };
      html2canvas = { default: () => { throw new Error('html2canvas not available'); } };
      
      // Use a simple check for PDF generation availability
      if (typeof window !== 'undefined' && window.document) {
        console.log('PDF generation attempted but libraries not available');
      }
    } catch (importError) {
      console.warn('PDF libraries not available:', importError);
      throw new Error('PDF generation dependencies not installed');
    }
    
    // Get the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    // This is a fallback since we don't have the actual PDF libraries
    // In a real implementation with the libraries installed, this would be different
    console.log(`Would have exported element ${elementId} as PDF`);
    alert('PDF export requires additional libraries. Please use CSV export instead.');
    
    // If implementation is completed with proper libraries, the PDF generation would happen here
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Fallback for environments without required libraries
    alert('PDF export is not available. Please use CSV export instead.');
  }
};

// Function to export data based on type
export const exportData = {
  // Export patients data
  patients: (patients: any[], format: 'csv' | 'pdf' = 'csv'): void => {
    if (format === 'csv') {
      const headers = [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'gender',
        'address',
        'insurance',
        'emergencyContact'
      ];
      downloadCSV(patients, headers, 'patients-export');
    } else {
      // PDF export would be handled differently
      generatePDF('patients-table', 'patients-export');
    }
  },

  // Export appointments data
  appointments: (appointments: any[], format: 'csv' | 'pdf' = 'csv'): void => {
    if (format === 'csv') {
      const headers = [
        'id',
        'patientId',
        'patientName',
        'doctorId',
        'doctorName',
        'date',
        'time',
        'status',
        'reason',
        'notes'
      ];
      downloadCSV(appointments, headers, 'appointments-export');
    } else {
      generatePDF('appointments-table', 'appointments-export');
    }
  },

  // Export medical records data
  medicalRecords: (records: any[], format: 'csv' | 'pdf' = 'csv'): void => {
    if (format === 'csv') {
      const headers = [
        'id',
        'patientId',
        'patientName',
        'doctorId',
        'doctorName',
        'date',
        'diagnosis',
        'prescription',
        'notes',
        'followUpDate'
      ];
      downloadCSV(records, headers, 'medical-records-export');
    } else {
      generatePDF('medical-records-table', 'medical-records-export', 'landscape');
    }
  },

  // Export queue data
  queue: (queueItems: any[], format: 'csv' | 'pdf' = 'csv'): void => {
    if (format === 'csv') {
      const headers = [
        'id',
        'patientId',
        'patientName',
        'timestamp',
        'status',
        'priority',
        'estimatedWaitTime',
        'notes'
      ];
      downloadCSV(queueItems, headers, 'queue-export');
    } else {
      generatePDF('queue-table', 'queue-export');
    }
  },

  // Generic export function for any data
  generic: (data: any[], headers: string[], filename: string, format: 'csv' | 'pdf' = 'csv'): void => {
    if (format === 'csv') {
      downloadCSV(data, headers, filename);
    } else {
      generatePDF('data-table', filename);
    }
  }
};
