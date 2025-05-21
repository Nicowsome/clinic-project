import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'record';
  title: string;
  subtitle: string;
  details?: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: string[]) => void;
  results: SearchResult[];
  loading?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  results = [],
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, selectedFilters);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('', selectedFilters);
  };

  const filterOptions = [
    { label: 'Patients', value: 'patient' },
    { label: 'Appointments', value: 'appointment' },
    { label: 'Medical Records', value: 'record' },
    { label: 'Recent', value: 'recent' },
    { label: 'High Priority', value: 'priority' },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'patient':
        return <PersonIcon color="primary" />;
      case 'appointment':
        return <EventIcon color="secondary" />;
      case 'record':
        return <DescriptionIcon color="info" />;
      default:
        return <DescriptionIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        component="form"
        elevation={3}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
        }}
        onSubmit={handleSearch}
      >
        <TextField
          fullWidth
          placeholder="Search patients, appointments, medical records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton
                    aria-label="clear search"
                    onClick={clearSearch}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton
                  aria-label="filter search"
                  onClick={() => setShowFilters(!showFilters)}
                  edge="end"
                >
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
        />

        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by:
            </Typography>
            <Autocomplete
              multiple
              options={filterOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select filters"
                  size="small"
                />
              )}
              onChange={(_, newValue) =>
                setSelectedFilters(newValue.map((item) => item.value))
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
            />
          </Box>
        )}
      </Paper>

      {results.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            borderRadius: 2,
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          <List>
            {results.map((result) => (
              <React.Fragment key={result.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{getIconForType(result.type)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="span">
                        {result.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          component="span"
                        >
                          {result.subtitle}
                        </Typography>
                        {result.details && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="div"
                            sx={{ mt: 0.5 }}
                          >
                            {result.details}
                          </Typography>
                        )}
                        <Chip
                          label={result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          size="small"
                          sx={{ mt: 0.5, mr: 0.5 }}
                          color={
                            result.type === 'patient'
                              ? 'primary'
                              : result.type === 'appointment'
                              ? 'secondary'
                              : 'info'
                          }
                        />
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            p: 2,
          }}
        >
          <Typography>Searching...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdvancedSearch;
