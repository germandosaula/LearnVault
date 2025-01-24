import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { OrganizationPlanning } from "../component/dashboard/OrganizationPlanning";
import { Gamification } from "../component/dashboard/Gamification";
import { Context } from "../store/appContext"; // <--- Importamos el contexto
import "../../styles/Dashboard/dashboard.css";

export const Dashboard = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  // Obtenemos el store y las acciones del contexto
  const { store, actions } = useContext(Context);

  // Manejo de apertura/cierre del modal de perfil
  const handleOpenProfile = () => setOpenProfileModal(true);
  const handleCloseProfile = () => setOpenProfileModal(false);

  useEffect(() => {
    // Al montar el componente, llamamos a las acciones que harán el fetch
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
          <OrganizationPlanning />
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