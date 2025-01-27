import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import "../../styles/Home/loginsignup.css";
import { Context } from "../store/appContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

export const LoginSignUp = () => {
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    const success = await actions.login(formData.email, formData.password);
  
    if (!success) {
      setErrorMessage(store.errorMessage || "Error logging in.");
      return;
    }
  
    navigate("/dashboard");
  };
  

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

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  return (
    <Box className="new-login">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* Sign-Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={(e) => e.preventDefault()}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Box
              className="social-icons"
              sx={{ display: "flex", gap: 1, marginBottom: 2 }}
            >
              <Button
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
              >
                SignUp with Google
              </Button>
            </Box>
            <Typography variant="body2" gutterBottom>
              or use your email for registration
            </Typography>
            <TextField
              fullWidth
              placeholder="Name"
              margin="normal"
              name="name"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              placeholder="Email"
              margin="normal"
              name="email"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              margin="normal"
              name="password"
              onChange={handleChange}
            />
            <Button variant="contained" fullWidth sx={{ marginTop: 2 }}>
              Sign Up
            </Button>
          </form>
        </div>

        {/* Sign-In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <Typography variant="h4" component="h1" gutterBottom>
              Sign In
            </Typography>
            <Box
              className="social-icons"
              sx={{ display: "flex", marginBottom: 2 }}
            >
              <Button
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                fullWidth
                sx={{ marginTop: "15px" }}
              >
                Sign in with Google
              </Button>
            </Box>
            <Typography variant="body2" gutterBottom>
              or use your email and password
            </Typography>
            <TextField
              fullWidth
              placeholder="Email"
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              margin="normal"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <a href="#">Forget Your Password?</a>
            <Button variant="contained" fullWidth sx={{ marginTop: 2 }} type="submit">
              Sign In
            </Button>
          </form>
          {errorMessage && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </div>

        {/* Toggle Panel */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <Typography variant="h5" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Enter your personal details to use all of the site features
              </Typography>
              <Button
                className="hidden"
                onClick={handleLoginClick}
                variant="contained"
              >
                Sign In
              </Button>
            </div>
            <div className="toggle-panel toggle-right">
              <Typography variant="h5" gutterBottom>
                Hello, Friend!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Register with your personal details to use all of the site features
              </Typography>
              <Button
                className="hidden"
                onClick={handleRegisterClick}
                variant="contained"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};