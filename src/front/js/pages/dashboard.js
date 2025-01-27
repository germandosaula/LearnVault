import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { EditableCalendar } from "../component/dashboard/EditableCalendar";
import { Gamification } from "../component/dashboard/Gamification";
import { Context } from "../store/appContext";
import "../../styles/Dashboard/dashboard.css";

export const Dashboard = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const { store, actions } = useContext(Context);

  const handleOpenProfile = () => setOpenProfileModal(true);
  const handleCloseProfile = () => setOpenProfileModal(false);

  useEffect(() => {
    actions.getDashboardData();
    actions.getSearchData();
  }, []);


  return (
    <Box className="dashboard-container">
      <header className="dashboard-header">
        <h1>LearnVault</h1>
        <nav className="navbar-links">
          <a href="#features">FEATURES</a>
          <a href="#experiences">EXPERIENCES</a>
          <Button variant="contained" onClick={handleOpenProfile}>
            PERFIL
          </Button>
        </nav>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <h2>Organización y Planificación</h2>
          <EditableCalendar />
        </section>

        <section className="dashboard-section">
          <h2>Gamificación y Logros</h2>
          <Gamification />
        </section>

        <section className="dashboard-section">
          <h2>Favoritos</h2>
          <div className="favorites-container">
            <p>Aquí estarán tus recursos favoritos.</p>
          </div>
        </section>
      </main>

      <Modal open={openProfileModal} onClose={handleCloseProfile}>
        <Box className="modal-profile">
          <Typography variant="h6">Perfil de Usuario</Typography>
          <Typography variant="body1">Nombre: Usuario</Typography>
          <Typography variant="body1">Email: usuario@learnvault.com</Typography>
          <Button variant="outlined" onClick={handleCloseProfile}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};