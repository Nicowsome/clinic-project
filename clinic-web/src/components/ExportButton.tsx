import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from '@mui/icons-material';
import { exportData } from '../utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  type: 'patients' | 'appointments' | 'medicalRecords' | 'queue' | 'generic';
  headers?: string[];
  filename?: string;
  buttonText?: string;
  buttonVariant?: 'text' | 'outlined' | 'contained';
  buttonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  buttonSize?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  type,
  headers = [],
  filename = 'export',
  buttonText = 'Export',
  buttonVariant = 'contained',
  buttonColor = 'primary',
  buttonSize = 'medium',
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    handleClose();

    if (type === 'generic' && headers.length > 0) {
      exportData.generic(data, headers, filename, format);
    } else if (type === 'patients') {
      exportData.patients(data, format);
    } else if (type === 'appointments') {
      exportData.appointments(data, format);
    } else if (type === 'medicalRecords') {
      exportData.medicalRecords(data, format);
    } else if (type === 'queue') {
      exportData.queue(data, format);
    }
  };

  return (
    <>
      <Tooltip title="Export data">
        <span>
          <Button
            variant={buttonVariant}
            color={buttonColor}
            onClick={handleClick}
            disabled={disabled || data.length === 0}
            startIcon={<FileDownloadIcon />}
            size={buttonSize}
          >
            {buttonText}
          </Button>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;
