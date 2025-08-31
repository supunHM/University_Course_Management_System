import React, { createContext, useContext, useReducer } from 'react';
import { courseService } from '../services/courseService';

const CourseContext = createContext();

const initialState = {
  courses: [],
  loading: false,
  error: null,
  selectedCourse: null,
};

const courseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_COURSES':
      return { ...state, courses: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, action.payload] };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.id ? action.payload : course
        ),
      };
    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload),
      };
    case 'SET_SELECTED_COURSE':
      return { ...state, selectedCourse: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),

    // Fetch all courses
    fetchCourses: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const courses = await courseService.getAllCourses();
        dispatch({ type: 'SET_COURSES', payload: courses });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    },

    // Create a new course
    createCourse: async (courseData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newCourse = await courseService.createCourse(courseData);
        dispatch({ type: 'ADD_COURSE', payload: newCourse });
        return newCourse;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    // Update a course
    updateCourse: async (id, courseData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const updatedCourse = await courseService.updateCourse(id, courseData);
        dispatch({ type: 'UPDATE_COURSE', payload: updatedCourse });
        return updatedCourse;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    // Delete a course
    deleteCourse: async (id) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await courseService.deleteCourse(id);
        dispatch({ type: 'DELETE_COURSE', payload: id });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    // Get course by ID
    getCourseById: async (id) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const course = await courseService.getCourseById(id);
        dispatch({ type: 'SET_SELECTED_COURSE', payload: course });
        return course;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
  };

  return (
    <CourseContext.Provider value={{ ...state, ...actions }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
