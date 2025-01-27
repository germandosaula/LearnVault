import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Box, Divider, Grid, IconButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

export const EditableCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const addTask = () => {
    if (taskName && dueDate) {
      setTasks([...tasks, { name: taskName, dueDate }]);
      setTaskName("");
      setDueDate(null);
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const date = dayjs(task.dueDate).format("YYYY-MM-DD");
    acc[date] = acc[date] || [];
    acc[date].push(task);
    return acc;
  }, {});

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const days = [];

    for (let day = startOfMonth; day.isBefore(endOfMonth) || day.isSame(endOfMonth); day = day.add(1, "day")) {
      days.push(day);
    }

    return days;
  };

  const daysInMonth = getDaysInMonth();

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <IconButton onClick={handlePreviousMonth}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            {currentMonth.format("MMMM YYYY")}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ArrowForward />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
          <TextField
            label="Nombre de la tarea"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
          />
          <TextField
            type="date"
            label=""
            value={dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setDueDate(dayjs(e.target.value))}
            fullWidth
          />
          <Button variant="contained" onClick={addTask}>
            Añadir Tarea
          </Button>
        </Box>
        <Grid container spacing={2} columns={7} sx={{ textAlign: "center" }}>
          {daysInMonth.map((day) => (
            <Grid item xs={1} key={day.format("YYYY-MM-DD")}>              
              <Card sx={{ minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f9f9f9" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    {day.format("dddd")}
                  </Typography>
                  <Typography variant="h6">
                    {day.format("D")}
                  </Typography>
                  <Divider sx={{ marginY: 1 }} />
                  {(groupedTasks[day.format("YYYY-MM-DD")] || []).map((task, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 1,
                      }}
                    >
                      <Typography variant="body2">{task.name}</Typography>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => removeTask(tasks.indexOf(task))}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};