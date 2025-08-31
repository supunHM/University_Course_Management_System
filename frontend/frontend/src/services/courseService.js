import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },

  // Get course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course');
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create course');
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update course');
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete course');
    }
  },

  // Get course by code
  getCourseByCode: async (code) => {
    try {
      const response = await api.get(`/courses/code/${code}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course by code');
    }
  },
};

export default courseService;
