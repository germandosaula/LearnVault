import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Link
} from '@mui/material';
import "../../styles/Home/login.css";


import { Context } from "../store/appContext";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "../Firebase/Firebase"; 

export const Login = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }

    const success = await actions.login(formData.email, formData.password);

    if (!success) {
      setErrorMessage(store.errorMessage || 'Error logging in.');
      return;
    }

    navigate('/dashboard');
  };

  // 3. Función para iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

    
      console.log("Usuario de Google:", result.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setErrorMessage("Error logging in with Google");
    }
  };

  return (
    <Grid
      container
      className="login-container"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #c9c9f5, #ffc3a0, #ffe6e6)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Grid item>
        <Box
          className="login-card"
          sx={{
            width: "100%",
            maxWidth: "400px",
            padding: "2.5rem",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <Typography variant="h5" className="login-card-title">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              sx={{ marginBottom: "20px" }}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
              sx={{ marginBottom: "20px" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
              sx={{
                padding: "10px",
                fontSize: "16px",
                marginBottom: "15px",
              }}
            >
              Sign in
            </Button>
            {errorMessage && (
              <Typography color="error" sx={{ marginBottom: "15px" }}>
                {errorMessage}
              </Typography>
            )}
            <Typography variant="body2" className="login-footer">
              Don’t have an account?{" "}
              <Link onClick={() => navigate("/register")} className="login-link">
                Sign up
              </Link>
            </Typography>
          </form>

          {/* 4. Botón para iniciar sesión con Google */}
          <Button
            variant="outlined"
            onClick={handleGoogleLogin}
            fullWidth
            sx={{ marginTop: "15px" }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
