import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Modal,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Context } from "../store/appContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!store.token || !store.user?.id) {
      console.error("No token or user ID found, redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for ID:", store.user.id);

        const response = await fetch(`${process.env.BACKEND_URL}/api/user/${store.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("User data received:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [store.token, store.user?.id, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!userData?.username || !userData?.email) {
      console.error("🚨 Username or email is missing.");
      return;
    }

    // Asegurarse de que se envían strings correctamente formateados
    const updatedData = {
      username: String(userData.username).trim(),
      email: String(userData.email).trim(),
    };

    console.log("📩 Sending updated user data:", updatedData); // Verificar qué se envía

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/user/${store.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`,
          },
          body: JSON.stringify(updatedData), // Convertir correctamente a JSON
        }
      );

      const result = await response.json();
      console.log("🔍 Server Response:", result); // Ver qué responde el servidor

      if (!response.ok) {
        console.error("❌ Failed to update user data:", result);
        return;
      }

      setUserData(result); // Guardar los datos actualizados
      handleCloseModal();
    } catch (error) {
      console.error("🔥 Error updating user data:", error);
    }
  };


  console.log("Current userData state:", userData);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac)",
      }}
    >
      {/* Botón para abrir/cerrar Sidebar */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "fixed",
          top: 20,
          left: isSidebarOpen ? 260 : 20,
          zIndex: 10,
          backgroundColor: "#1e1e2e",
          color: "white",
          borderRadius: "50%",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar con animación */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "250px",
          height: "100%",
          background: "#1e1e2e",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxShadow: "3px 0 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Perfil */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
          {loading ? (
            <CircularProgress color="inherit" />
          ) : error ? (
            <Typography variant="body1" color="error">
              Failed to load profile.
            </Typography>
          ) : (
            <>
              <Avatar
                src={userData?.avatar || "https://randomuser.me/api/portraits/men/45.jpg"}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6">{userData?.username || "No Name"}</Typography>
              <Typography variant="body2">{userData?.email || "No Email"}</Typography>
              <Button variant="outlined" sx={{ mt: 2, color: "white" }} onClick={handleOpenModal}>
                Edit Profile
              </Button>
            </>
          )}
        </Box>
      </motion.div>

      {/* Contenido del Dashboard */}
      <Box sx={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1" color="error">
            Could not load dashboard content.
          </Typography>
        ) : (
          <>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Welcome, {userData?.username || "Loading..."}!
            </Typography>

            {/* Tarjetas */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", flex: 1 }}>
                <Typography variant="h5">🎮 Gamification</Typography>
                <Typography variant="body2">
                  Level up by completing tasks and earning points!
                </Typography>
              </Box>

              <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", flex: 1 }}>
                <Typography variant="h5">🏆 Achievements</Typography>
                <Typography variant="body2">
                  Unlock achievements as you progress in learning!
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Modal para editar perfil */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 400,
            bgcolor: "white",
            p: 4,
            borderRadius: "10px",
            boxShadow: 24,
            mx: "auto",
            mt: "10%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>
          <TextField fullWidth label="Username" name="username" value={userData?.username || ""} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" name="email" value={userData?.email || ""} onChange={handleChange} sx={{ mb: 2 }} />
          <Button fullWidth variant="contained" onClick={handleUpdate} sx={{ background: "#ff6a88" }}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};
