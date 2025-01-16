import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, Grid, Avatar, Link } from '@mui/material';
import "../../styles/login.css"

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // To handle error or validation messages
  const [errorMessage, setErrorMessage] = useState('');
  // Update state as the user types in the inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Basic validations and form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple client-side validation
    if (!formData.email || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }

    // TODO: Implement API call for user login
    // Example:
    // try {
    //   const response = await fetch('YOUR_LOGIN_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email: formData.email,
    //       password: formData.password,
    //     }),
    //   });
    //
    //   const data = await response.json();
    //
    //   if (!response.ok) {
    //     setErrorMessage(data.message || 'Error logging in.');
    //     return;
    //   }
    //
    //   // Save token and redirect
    //   localStorage.setItem('token', data.token);
    //   navigate('/dashboard');
    // } catch (error) {
    //   console.error('Error connecting to the server:', error);
    //   setErrorMessage('Could not connect to the server.');
    // }

    // Placeholder for future implementation
    console.log('Login form submitted:', formData);
    // You can remove the above line when implementing the API call
  };

  return (
    <Grid
      container
      className="login-container"
    >
      <Grid
        item
        xs={12}
        md={6}
        className="login-left"
      >
        <Typography
          variant="h3"
          className="login-title"
        >
          LearnVault
        </Typography>
        <Box>
          <Typography className="login-text">
            <strong>Adaptable performance</strong>
            <br />
            Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.
          </Typography>

          <Typography className="login-text">
            <strong>Built to last</strong>
            <br />
            Experience unmatched durability that goes above and beyond with a lasting investment.
          </Typography>

          <Typography className="login-text">
            <strong>Great user experience</strong>
            <br />
            Integrate our product into your routine with an intuitive and easy-to-use interface.
          </Typography>

          <Typography className="login-text">
            <strong>Innovative functionality</strong>
            <br />
            Stay ahead with features that set new standards, addressing your evolving needs better than the rest.
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        className="login-right"
      >
        <Box className="login-card">
          <Typography
            variant="h5"
            className="login-card-title"
          >
            Sign in
          </Typography>

          <form>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              className="login-input"
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              className="login-input"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
            >
              Sign in
            </Button>
            <Typography
              variant="body2"
              className="login-footer"
            >
              Don’t have an account?{" "}
              <Link
                onClick={() => navigate("/register")}
                className="login-link"
              >
                Sign up
              </Link>
            </Typography>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};