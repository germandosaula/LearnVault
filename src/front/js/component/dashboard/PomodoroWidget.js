import React from "react";
import { usePomodoro } from "./PomodoroContext";
import { Box, Typography, IconButton } from "@mui/material";
import { Timer, Pause } from "@mui/icons-material";

export const PomodoroWidget = () => {
    const { timeLeft, isRunning, setIsRunning, mode } = usePomodoro();

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: mode === "focus" ? "#ff6a88" : mode === "shortBreak" ? "#ff9a8b" : "#64B5F6",
            color: "#fff",
            padding: "10px",
            borderRadius: "12px",
            marginTop: "16px"
        }}>
            <Typography variant="h6">
                {formatTime(timeLeft)}
            </Typography>
            <IconButton onClick={() => setIsRunning(!isRunning)} sx={{ color: "#fff" }}>
                {isRunning ? <Pause /> : <Timer />}
            </IconButton>
        </Box>
    );
};