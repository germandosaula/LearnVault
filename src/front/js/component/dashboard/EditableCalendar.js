import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, Box, Divider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const EditableCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(null);

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

  const calculateTimeLeft = (date) => {
    const now = dayjs();
    const endDate = dayjs(date);
    const diff = endDate.diff(now);

    if (diff <= 0) return "Tiempo terminado";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} días, ${hours} horas, ${minutes} minutos`;
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Calendario Editable
          </Typography>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <TextField
              label="Nombre de la tarea"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              fullWidth
            />
            <DatePicker
              label="Fecha de entrega"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          <Button variant="contained" onClick={addTask} fullWidth>
            Añadir Tarea
          </Button>
          <Divider sx={{ marginY: 2 }} />
          {tasks.length === 0 ? (
            <Typography variant="body1">No hay tareas aún.</Typography>
          ) : (
            tasks.map((task, index) => (
              <Card key={index} sx={{ marginBottom: 1 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">{task.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calculateTimeLeft(task.dueDate)}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => removeTask(index)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
    </LocalizationProvider>
  );
};