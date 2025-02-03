import React, { useContext, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";
import injectContext from "./store/appContext";
import { Box } from "@mui/material";

import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { LoginSignUp } from "./pages/login-signup";
import { GamificationHub } from "./component/dashboard/GamificationHub";
import { UploadFile } from "./component/dashboard/UploadFile";
import { Search } from "./pages/Search";
import { FavoritesList } from "./component/dashboard/FavoritesList";
import { KanbanBoard } from "./component/dashboard/KanbanBoard";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
  const { store } = useContext(Context);
  const isLoggedIn = !!store.token;

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <BrowserRouter>
      <ScrollToTop>
        <ConditionalNavbar isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignUp />} />

          {/* 🔥 Dashboard ahora maneja sus subrutas correctamente */}
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="" element={
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
                      padding: "24px",
                      borderRadius: "16px",
                      flex: 1,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <GamificationHub />
                  </Box>

                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
                      padding: "24px",
                      borderRadius: "16px",
                      flex: 1,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <FavoritesList />
                  </Box>
                </Box>
                <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", width: "100%", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", }}>
                  <KanbanBoard />
                </Box>
              </Box>
            } />
            <Route path="search" element={<Search />} />
            <Route path="upload" element={<UploadFile />} />
            <Route path="favorites" element={<FavoritesList />} />

          </Route>

          {/* Página 404 */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>

        <Footer />
      </ScrollToTop>
    </BrowserRouter>
  );
};

const ConditionalNavbar = ({ isLoggedIn }) => {
  const location = useLocation();
  return !isLoggedIn && location.pathname !== "/dashboard" ? <Navbar /> : null;
};

export default injectContext(Layout);
