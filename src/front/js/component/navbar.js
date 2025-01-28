import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const isLoggedIn = !!store.token;
	const [anchorEl, setAnchorEl] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const navigate = useNavigate();

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const toggleDrawer = (open) => {
		setDrawerOpen(open);
	};

	const handleLogout = () => {
		actions.logout();
		navigate("/");
	};

	const handleScrollTo = (id) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const renderMenuItems = () => (
		<>
			<Button sx={{ color: "white" }} onClick={() => handleScrollTo("features")}>
				Features
			</Button>
			<Button
				sx={{ color: "white" }}
				onClick={() => handleScrollTo("experiences")}
			>
				Experiences
			</Button>
			{!isLoggedIn ? (
				<Button sx={{ color: "white" }} onClick={() => navigate("/login")}>
					Get Started
				</Button>
			) : (
				<>
					<Button sx={{ color: "white" }} onClick={handleLogout}>
						Logout
					</Button>
					<IconButton onClick={handleMenuOpen}>
						<Avatar sx={{ bgcolor: "#FFC3A0" }}>U</Avatar>
					</IconButton>
					<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
						<MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
						<MenuItem onClick={handleLogout}>Logout</MenuItem>
					</Menu>
				</>
			)}
		</>
	);

	return (
		<Box
			sx={{
				position: "absolute",
				top: "16px",
				left: "50%",
				transform: "translateX(-50%)",
				width: "90%",
				maxWidth: "1200px",
				background: "rgba(255, 255, 255, 0.4)",
				backdropFilter: "blur(10px)",
				borderRadius: "32px",
				boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
				zIndex: 1100,
				padding: "10px 20px",
			}}
		>
			<AppBar
				position="static"
				sx={{
					boxShadow: "none",
					background: "transparent",
				}}
			>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography
						variant="h6"
						component={Link}
						to="/"
						sx={{
							fontWeight: "bold",
							textDecoration: "none",
							color: "white",
							fontFamily: "'Poppins', 'Sans-serif'",
							"&:hover": {
								textDecoration: "none",
								color: "white",
							},
						}}
					>
						LearnVault
					</Typography>
					<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
						{renderMenuItems()}
					</Box>
					<IconButton
						sx={{ display: { xs: "block", md: "none" }, color: "white" }}
						onClick={() => toggleDrawer(true)}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
				<Box sx={{ width: 250, padding: 2 }}>
					<List>
						<ListItem button onClick={() => handleScrollTo("features")} sx={{ fontFamily: "'Poppins', 'Sans-serif'",}}>
							<ListItemText primary="Features" />
						</ListItem>
						<ListItem button onClick={() => handleScrollTo("experiences")} sx={{ fontFamily: "'Poppins', 'Sans-serif'",}}>
							<ListItemText primary="Experiences" />
						</ListItem>
						{!isLoggedIn ? (
							<ListItem button onClick={() => navigate("/login")} sx={{ fontFamily: "'Poppins', 'Sans-serif'",}}>
								<ListItemText primary="Login" />
							</ListItem>
						) : (
							<>
								<ListItem button onClick={() => navigate("/profile")} sx={{ fontFamily: "'Poppins', 'Sans-serif'",}}>
									<ListItemText primary="Profile" />
								</ListItem>
								<ListItem button onClick={handleLogout}>
									<ListItemText primary="Logout" />
								</ListItem>
							</>
						)}
					</List>
				</Box>
			</Drawer>
		</Box>
	);
};