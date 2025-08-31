import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const { 
    createCourse, 
    updateCourse, 
    getCourseById, 
    loading, 
    error, 
    clearError 
  } = useCourse();

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    credits: '',
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      const course = await getCourseById(id);
      setFormData({
        code: course.code || '',
        title: course.title || '',
        description: course.description || '',
        credits: course.credits || '',
      });
    } catch (error) {
      console.error('Failed to load course:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Course code is required';
    } else if (formData.code.length < 2) {
      newErrors.code = 'Course code must be at least 2 characters';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Course title must be at least 3 characters';
    }

    if (formData.credits && (isNaN(formData.credits) || parseInt(formData.credits) < 1 || parseInt(formData.credits) > 10)) {
      newErrors.credits = 'Credits must be a number between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      const courseData = {
        code: formData.code.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        credits: formData.credits ? parseInt(formData.credits) : null,
      };

      if (isEdit) {
        await updateCourse(id, courseData);
      } else {
        await createCourse(courseData);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/courses');
      }, 1500);

    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const steps = ['Course Information', 'Course Details', 'Review'];
  const currentStep = 0; // For future enhancement

  if (submitSuccess) {
    return (
      <Fade in timeout={500}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <SchoolIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" color="success.main" gutterBottom>
            Course {isEdit ? 'Updated' : 'Created'} Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to course list...
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box>
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/courses')}
                sx={{ mr: 2 }}
              >
                Back to Courses
              </Button>
              <SchoolIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" color="primary">
                {isEdit ? 'Edit Course' : 'Add New Course'}
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {isEdit 
                ? 'Update the course information below.'
                : 'Fill in the information below to create a new course.'
              }
            </Typography>

            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', mb: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Course Code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      error={!!errors.code}
                      helperText={errors.code || 'e.g., CS101, MATH201'}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Credits"
                      name="credits"
                      type="number"
                      value={formData.credits}
                      onChange={handleChange}
                      error={!!errors.credits}
                      helperText={errors.credits || 'Number of credit hours (1-10)'}
                      inputProps={{ min: 1, max: 10 }}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title || 'Enter a descriptive course title'}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description || 'Provide a detailed description of the course content and objectives'}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/courses')}
                        disabled={loading}
                        size="large"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                        disabled={loading}
                        size="large"
                        sx={{ px: 4 }}
                      >
                        {loading 
                          ? (isEdit ? 'Updating...' : 'Creating...') 
                          : (isEdit ? 'Update Course' : 'Create Course')
                        }
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default CourseForm;
