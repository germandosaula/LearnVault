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
                            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                                <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", flex: 1 }}>
                                    <GamificationHub />
                                </Box>
                                <Box sx={{ background: "#fff", padding: "20px", borderRadius: "12px", flex: 1 }}>
                                    <FavoritesList />
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
