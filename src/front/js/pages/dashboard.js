import React, { useState, useContext, useEffect } from "react";
import { 
  Box, Typography, Avatar, Button, Modal, TextField, 
  IconButton, CircularProgress, Divider 
} from "@mui/material";
import { motion } from "framer-motion";
import { Context } from "../store/appContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DashboardIcon from "@mui/icons-material/Dashboard"; // 🏠 Icono de Dashboard
import { Search } from "../pages/Search";
// import { UploadResources } from "../component/dashboard/UploadResources";
import { FavoritesList } from "../component/dashboard/FavoritesList";
import { AchievementsSlider } from "../component/dashboard/ArchivementsSlider";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        const response = await fetch(`${process.env.BACKEND_URL}/api/user/${store.user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
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

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac)" }}>
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

      {/* Sidebar */}
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
        {/* Perfil del Usuario */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
          <Avatar src={userData?.avatar || "https://randomuser.me/api/portraits/men/45.jpg"} sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">{userData?.username || "No Name"}</Typography>
          <Typography variant="body2">{userData?.email || "No Email"}</Typography>
        </Box>

        {/* Separador */}
        <Divider sx={{ backgroundColor: "#444", my: 3 }} />

        {/* Botón para volver al Dashboard 🏠 */}
        <Button 
          startIcon={<DashboardIcon />} 
          onClick={() => navigate("/dashboard")} 
          sx={{ color: "white", justifyContent: "flex-start", mt: 1, fontWeight: "bold" }}
        >
          Back to Dashboard
        </Button>

        {/* Botones de Navegación */}
        <Button startIcon={<SearchIcon />} onClick={() => navigate("/dashboard/search")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Search Resources
        </Button>

        <Button startIcon={<UploadIcon />} onClick={() => navigate("/dashboard/upload")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Upload Resources
        </Button>

        <Button startIcon={<FavoriteIcon />} onClick={() => navigate("/dashboard/favorites")} sx={{ color: "white", justifyContent: "flex-start", mt: 1 }}>
          Favorites
        </Button>
      </motion.div>

      {/* Contenido Principal Dinámico */}
      <Box sx={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<AchievementsSlider />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="/upload" element={<UploadResources />} /> */}
          <Route path="/favorites" element={<FavoritesList />} />
        </Routes>
      </Box>
    </Box>
  );
};
