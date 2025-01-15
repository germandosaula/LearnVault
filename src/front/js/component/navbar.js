import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="navbar">
			<div className="navbar-logo">
			<Link to="/" className="Home">
					LearnVault
				</Link>
			</div>
			<div className="navbar-search">
				<input type="text" placeholder="What are you studying today?" />
			</div>
			<button className="navbar-toggle" onClick={toggleMenu}>
				☰
			</button>
			<ul className={`navbar-links ${isOpen ? "open" : ""}`}>
				<li><a href="#">Prepare for your exams</a></li>
				<li><a href="#">Earn points</a></li>
				<li><a href="#">University Guidance</a></li>
				<li><a href="#">Sell on LearnVault</a></li>
			</ul>
			<div className="navbar-auth">
				<Link to="/login" className="login">
					Login
				</Link>
				<Link to="/register" className="register">
					SignUp
				</Link>
			</div>
		</nav>
	);
};