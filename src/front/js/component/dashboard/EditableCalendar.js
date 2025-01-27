import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

  const groupedTasks = tasks.reduce((acc, task) => {
    const date = dayjs(task.dueDate).format("YYYY-MM-DD");
    acc[date] = acc[date] || [];
    acc[date].push(task);
    return acc;
  }, {});

  const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 1000, margin: "auto", padding: 2 }}>
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
            <Grid container spacing={2}>
              {daysInWeek.map((day, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{day}</Typography>
                      <Divider sx={{ marginY: 1 }} />
                      {Object.keys(groupedTasks).map((date) => {
                        const tasksForDay = groupedTasks[date];
                        if (dayjs(date).day() === index + 1) {
                          return tasksForDay.map((task, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 1,
                              }}
                            >
                              <Typography variant="body1">{task.name}</Typography>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => removeTask(tasks.indexOf(task))}
                              >
                                Eliminar
                              </Button>
                            </Box>
                          ));
                        }
                        return null;
                      })}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};