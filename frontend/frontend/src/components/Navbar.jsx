import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { School, Add, List } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <School sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}
          >
            Course Management System
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<List />}
              onClick={() => navigate('/courses')}
              sx={{
                bgcolor: isActive('/courses') || isActive('/') ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                borderRadius: 2,
                px: 3,
              }}
            >
              All Courses
            </Button>
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={() => navigate('/courses/new')}
              sx={{
                bgcolor: isActive('/courses/new') ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                borderRadius: 2,
                px: 3,
              }}
            >
              Add Course
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
