import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useClinicStore } from '../store/clinicStore';

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  tags?: string[];
}

interface Test {
  name: string;
  date?: string;
  results?: string;
}

interface ImagingResult {
  type: string;
  date?: string;
  findings?: string;
}

interface Procedure {
  name: string;
  date?: string;
  doctor?: string;
}

interface ProgressNote {
  content: string;
  date?: string;
}

interface Referral {
  specialist: string;
  reason: string;
  date?: string;
}

interface ConsentForm {
  type: string;
  date?: string;
}

export default function PatientRecords() {
  const { patientId } = useParams();
  const { patients, medicalRecords, updatePatient } = useClinicStore();
  const theme = useTheme();
  const [patient, setPatient] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (patientId) {
      const foundPatient = patients.find(p => p.id === patientId);
      setPatient(foundPatient);
      // Load attachments from patient data or initialize empty array
      setAttachments(foundPatient?.attachments || []);
    }
  }, [patientId, patients]);

  const handleEditClick = (section: string) => {
    setEditingSection(section);
    setEditData(patient[section] || {});
  };

  const handleSaveEdit = async () => {
    if (!editingSection) return;

    const updatedPatient = {
      ...patient,
      [editingSection]: editData,
    };

    try {
      await updatePatient(patientId!, updatedPatient);
      setPatient(updatedPatient);
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditData({});
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleUploadAttachment = async () => {
    if (!selectedFile) return;

    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: selectedFile.type,
      url: URL.createObjectURL(selectedFile),
      uploadDate: new Date().toISOString(),
      tags: selectedTags,
    };

    setAttachments([...attachments, newAttachment]);
    setAttachmentDialogOpen(false);
    setSelectedFile(null);
    setSelectedTags([]);
    setTagInput('');

    const updatedPatient = {
      ...patient,
      attachments: [...attachments, newAttachment],
    };
    await updatePatient(patientId!, updatedPatient);
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    const updatedAttachments = attachments.filter(a => a.id !== attachmentId);
    setAttachments(updatedAttachments);

    const updatedPatient = {
      ...patient,
      attachments: updatedAttachments,
    };
    await updatePatient(patientId!, updatedPatient);
  };

  if (!patient) {
    return <Typography>Patient not found</Typography>;
  }

  const Section = ({ title, children, sectionKey }: { title: string; children: React.ReactNode; sectionKey: string }) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          {title}
        </Typography>
        {editingSection === sectionKey ? (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleSaveEdit} color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancelEdit} color="error">
              <CancelIcon />
            </IconButton>
          </Stack>
        ) : (
          <IconButton onClick={() => handleEditClick(sectionKey)} color="primary">
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Paper sx={{ p: 3 }}>
        {children}
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
          Patient Medical Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<AttachFileIcon />}
          onClick={() => setAttachmentDialogOpen(true)}
        >
          Add Attachment
        </Button>
      </Box>

      {/* Attachments Section */}
      <Section title="Attachments" sectionKey="attachments">
        <Grid container spacing={2}>
          {attachments.map((attachment) => (
            <Grid item xs={12} sm={6} md={4} key={attachment.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" noWrap>
                      {attachment.name}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded: {new Date(attachment.uploadDate).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    {attachment.tags?.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  <Button
                    size="small"
                    href={attachment.url}
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {attachments.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary">No attachments found</Typography>
            </Grid>
          )}
        </Grid>
      </Section>

      {/* 1. Patient Identification and Demographics */}
      <Section title="Patient Identification and Demographics" sectionKey="demographics">
        {editingSection === 'demographics' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editData.firstName || ''}
                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Middle Name"
                value={editData.middleName || ''}
                onChange={(e) => setEditData({ ...editData, middleName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editData.lastName || ''}
                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={editData.dateOfBirth || ''}
                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gender"
                value={editData.gender || ''}
                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Information"
                value={editData.address || ''}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={editData.phone || ''}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="National ID"
                value={editData.nationalId || ''}
                onChange={(e) => setEditData({ ...editData, nationalId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marital Status"
                value={editData.maritalStatus || ''}
                onChange={(e) => setEditData({ ...editData, maritalStatus: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={editData.occupation || ''}
                onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Full Name</Typography>
              <Typography>{`${patient.firstName} ${patient.middleName} ${patient.lastName}`}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Date of Birth</Typography>
              <Typography>{patient.dateOfBirth || 'Not specified'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Gender</Typography>
              <Typography>{patient.gender}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
              <Typography>Address: {patient.address}</Typography>
              <Typography>Phone: {patient.phone}</Typography>
              <Typography>Email: {patient.email}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>National ID</Typography>
              <Typography>{patient.nationalId || 'Not specified'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Marital Status</Typography>
              <Typography>{patient.maritalStatus || 'Not specified'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Occupation</Typography>
              <Typography>{patient.occupation || 'Not specified'}</Typography>
            </Grid>
          </Grid>
        )}
      </Section>

      {/* 2. Medical History */}
      <Section title="Medical History" sectionKey="medicalHistory">
        {editingSection === 'medicalHistory' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Past Medical Conditions"
                value={editData.medicalConditions?.join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, medicalConditions: e.target.value.split(',').map(c => c.trim()) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Surgical History"
                value={editData.surgicalHistory?.join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, surgicalHistory: e.target.value.split(',').map(s => s.trim()) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Family Medical History"
                value={editData.familyHistory?.join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, familyHistory: e.target.value.split(',').map(h => h.trim()) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Allergies"
                value={editData.allergies?.join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, allergies: e.target.value.split(',').map(a => a.trim()) })}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Past Medical Conditions</Typography>
              <List>
                {patient.medicalConditions?.map((condition: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={condition} />
                  </ListItem>
                )) || <Typography>No past conditions recorded</Typography>}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Surgical History</Typography>
              <List>
                {patient.surgicalHistory?.map((surgery: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={surgery} />
                  </ListItem>
                )) || <Typography>No surgical history recorded</Typography>}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Family Medical History</Typography>
              <List>
                {patient.familyHistory?.map((history: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={history} />
                  </ListItem>
                )) || <Typography>No family history recorded</Typography>}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Allergies</Typography>
              <List>
                {patient.allergies?.map((allergy: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={allergy} />
                  </ListItem>
                )) || <Typography>No allergies recorded</Typography>}
              </List>
            </Grid>
          </Grid>
        )}
      </Section>

      {/* 3. Visit/Encounter Records */}
      <Section title="Visit/Encounter Records" sectionKey="visitRecords">
        {editingSection === 'visitRecords' ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Reason for Visit</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Treatment</TableCell>
                  <TableCell>Doctor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editData.visitRecords?.map((record: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.reason}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.treatment}</TableCell>
                    <TableCell>{record.doctor}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No visit records recorded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Reason for Visit</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Treatment</TableCell>
                  <TableCell>Doctor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords
                  .filter(record => record.patientId === patientId)
                  .map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.reason}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Section>

      {/* 4. Diagnostic Records */}
      <Section title="Diagnostic Records" sectionKey="diagnosticRecords">
        {editingSection === 'diagnosticRecords' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Laboratory Tests"
                value={editData.labTests?.map((test: Test) => test.name).join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, labTests: e.target.value.split(',').map(n => ({ name: n.trim() })) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Imaging Results"
                value={editData.imagingResults?.map((result: ImagingResult) => result.type).join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, imagingResults: e.target.value.split(',').map(t => ({ type: t.trim() })) })}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Laboratory Tests</Typography>
              <List>
                {patient.labTests?.map((test: Test, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={test.name}
                      secondary={`Date: ${test.date}, Results: ${test.results}`}
                    />
                  </ListItem>
                )) || <Typography>No laboratory tests recorded</Typography>}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Imaging Results</Typography>
              <List>
                {patient.imagingResults?.map((result: ImagingResult, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={result.type}
                      secondary={`Date: ${result.date}, Findings: ${result.findings}`}
                    />
                  </ListItem>
                )) || <Typography>No imaging results recorded</Typography>}
              </List>
            </Grid>
          </Grid>
        )}
      </Section>

      {/* 5. Medications and Prescriptions */}
      <Section title="Medications and Prescriptions" sectionKey="medications">
        {editingSection === 'medications' ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Prescribing Doctor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editData.medications?.map((med: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{med.duration}</TableCell>
                    <TableCell>{med.doctor}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No medications recorded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Prescribing Doctor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.medications?.map((med: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{med.duration}</TableCell>
                    <TableCell>{med.doctor}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No medications recorded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Section>

      {/* 6. Procedures and Interventions */}
      <Section title="Procedures and Interventions" sectionKey="procedures">
        {editingSection === 'procedures' ? (
          <List>
            <TextField
              fullWidth
              label="Procedures"
              value={editData.procedures?.map((p: Procedure) => p.name).join(', ') || ''}
              onChange={(e) => setEditData({ ...editData, procedures: e.target.value.split(',').map(n => ({ name: n.trim() })) })}
            />
          </List>
        ) : (
          <List>
            {patient.procedures?.map((procedure: Procedure, index: number) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={procedure.name}
                  secondary={`Date: ${procedure.date}, Doctor: ${procedure.doctor}`}
                />
              </ListItem>
            )) || <Typography>No procedures recorded</Typography>}
          </List>
        )}
      </Section>

      {/* 7. Progress Notes */}
      <Section title="Progress Notes" sectionKey="progressNotes">
        {editingSection === 'progressNotes' ? (
          <List>
            <TextField
              fullWidth
              label="Progress Notes"
              value={editData.progressNotes?.map((n: ProgressNote) => n.content).join('\n') || ''}
              onChange={(e) => setEditData({ ...editData, progressNotes: e.target.value.split('\n').map(c => ({ content: c.trim() })) })}
            />
          </List>
        ) : (
          <List>
            {patient.progressNotes?.map((note: ProgressNote, index: number) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`Date: ${note.date}`}
                  secondary={note.content}
                />
              </ListItem>
            )) || <Typography>No progress notes recorded</Typography>}
          </List>
        )}
      </Section>

      {/* 8. Referral Information */}
      <Section title="Referral Information" sectionKey="referrals">
        {editingSection === 'referrals' ? (
          <List>
            <TextField
              fullWidth
              label="Referrals"
              value={editData.referrals?.map((r: Referral) => `${r.specialist} - ${r.reason}`).join('\n') || ''}
              onChange={(e) => setEditData({ ...editData, referrals: e.target.value.split('\n').map(r => ({
                specialist: r.split(' - ')[0].trim(),
                reason: r.split(' - ')[1].trim()
              })) })}
            />
          </List>
        ) : (
          <List>
            {patient.referrals?.map((referral: Referral, index: number) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`Referred to: ${referral.specialist}`}
                  secondary={`Date: ${referral.date}, Reason: ${referral.reason}`}
                />
              </ListItem>
            )) || <Typography>No referrals recorded</Typography>}
          </List>
        )}
      </Section>

      {/* 9. Administrative Information */}
      <Section title="Administrative Information" sectionKey="adminInfo">
        {editingSection === 'adminInfo' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Insurance Information"
                value={editData.insuranceInfo || ''}
                onChange={(e) => setEditData({ ...editData, insuranceInfo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consent Forms"
                value={editData.consentForms?.map((f: ConsentForm) => f.type).join(', ') || ''}
                onChange={(e) => setEditData({ ...editData, consentForms: e.target.value.split(',').map(t => ({ type: t.trim() })) })}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Insurance Information</Typography>
              <Typography>{patient.insuranceInfo || 'No insurance information recorded'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Consent Forms</Typography>
              <List>
                {patient.consentForms?.map((form: ConsentForm, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={form.type}
                      secondary={`Date: ${form.date}`}
                    />
                  </ListItem>
                )) || <Typography>No consent forms recorded</Typography>}
              </List>
            </Grid>
          </Grid>
        )}
      </Section>

      {/* 10. Vital Signs */}
      <Section title="Vital Signs and Measurements" sectionKey="vitalSigns">
        {editingSection === 'vitalSigns' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Blood Pressure"
                value={editData.bloodPressure || ''}
                onChange={(e) => setEditData({ ...editData, bloodPressure: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Heart Rate"
                value={editData.heartRate || ''}
                onChange={(e) => setEditData({ ...editData, heartRate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Temperature"
                value={editData.temperature || ''}
                onChange={(e) => setEditData({ ...editData, temperature: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Respiratory Rate"
                value={editData.respiratoryRate || ''}
                onChange={(e) => setEditData({ ...editData, respiratoryRate: e.target.value })}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Latest Measurements</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Blood Pressure"
                    secondary={patient.bloodPressure || 'Not recorded'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Heart Rate"
                    secondary={patient.heartRate || 'Not recorded'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Temperature"
                    secondary={patient.temperature || 'Not recorded'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Respiratory Rate"
                    secondary={patient.respiratoryRate || 'Not recorded'}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Body Measurements</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Weight"
                    secondary={patient.weight || 'Not recorded'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Height"
                    secondary={patient.height || 'Not recorded'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="BMI"
                    secondary={patient.bmi || 'Not recorded'}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        )}
      </Section>

      {/* File Upload Dialog */}
      <Dialog open={attachmentDialogOpen} onClose={() => setAttachmentDialogOpen(false)}>
        <DialogTitle>Upload Attachment</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AttachFileIcon />}
              sx={{ mt: 2 }}
            >
              Select File
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add Tags
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Type tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAttachmentDialogOpen(false);
            setSelectedFile(null);
            setSelectedTags([]);
            setTagInput('');
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleUploadAttachment}
            variant="contained"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 