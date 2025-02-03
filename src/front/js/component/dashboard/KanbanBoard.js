import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://super-couscous-wr94q9xj47xgcgg9v-3001.app.github.dev/api";

const initialColumns = {
  tasks: { id: "tasks", title: "Tasks", tasks: [] },
  tomorrow: { id: "tomorrow", title: "Tomorrow", tasks: [] },
  thisWeek: { id: "thisWeek", title: "This Week", tasks: [] },
  nextWeek: { id: "nextWeek", title: "Next Week", tasks: [] },
  thisMonth: { id: "thisMonth", title: "This Month", tasks: [] },
};

export const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
  
      const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch tasks");
      }
  
      const tasks = await response.json();
  
      console.log("📌 Tareas obtenidas del backend:", tasks); // Debug
  
      // Crear un nuevo objeto para actualizar el estado
      const updatedColumns = {
        tasks: { id: "tasks", title: "Tasks", tasks: [] },
        tomorrow: { id: "tomorrow", title: "Tomorrow", tasks: [] },
        thisWeek: { id: "thisWeek", title: "This Week", tasks: [] },
        nextWeek: { id: "nextWeek", title: "Next Week", tasks: [] },
        thisMonth: { id: "thisMonth", title: "This Month", tasks: [] },
      };
  
      // Asignar tareas a las columnas correctas
      tasks.forEach((task) => {
        const columnId = task.status; // Ya viene con el status correcto del backend
  
        if (updatedColumns[columnId]) {
          updatedColumns[columnId].tasks.push(task);
        } else {
          console.warn(`⚠️ Columna desconocida: ${columnId}. Se asignará a "tasks"`);
          updatedColumns["tasks"].tasks.push(task);
        }
      });
  
      console.log("✅ Columnas actualizadas antes de renderizar:", updatedColumns);
  
      setColumns(updatedColumns);
    } catch (err) {
      console.error("❌ Error loading tasks:", err);
      setError(err.message || "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskOrder = async (tasks) => {
    try {
      const response = await fetch(`${API_URL}/tasks/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(
          tasks.map((task, index) => ({ id: task.id, order: index }))
        ),
      });
  
      if (!response.ok) throw new Error("Failed to update task order");
  
    } catch (err) {
      console.error("Error updating task order:", err);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
  
    // 🟢 Mismo grupo → Solo reordenar las tareas dentro de la misma columna
    if (source.droppableId === destination.droppableId) {
      const updatedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, movedTask);
  
      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: { ...sourceColumn, tasks: updatedTasks },
      }));
  
      // Opcional: Guardar el nuevo orden en la base de datos
      updateTaskOrder(updatedTasks);
  
      return;
    }
  
    // 🔵 Movimiento entre columnas
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];
  
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destTasks.splice(destination.index, 0, movedTask);
  
    setColumns((prevColumns) => ({
      ...prevColumns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    }));
  
    updateTaskStatus(movedTask.id, destination.droppableId);
  };  

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      console.log(`🔄 Actualizando tarea ${taskId} a la columna: ${newStatus}`); // Debug
  
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error en la API:", errorData);
        throw new Error("Failed to update task status");
      }
  
      console.log(`✅ Tarea ${taskId} movida a ${newStatus}`);
  
    } catch (err) {
      console.error("❌ Error actualizando tarea:", err);
      setError("Failed to update task status. Please try again.");
    }
  };
  

  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: newTask,
          description: "",
          due_date: new Date().toISOString().split("T")[0],
          status: "tasks",
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const createdTask = await response.json();
      setColumns({
        ...columns,
        tasks: {
          ...columns.tasks,
          tasks: [...columns.tasks.tasks, createdTask],
        },
      });
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message || "Failed to add task. Please try again.");
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
  
      // Actualizar el estado correctamente
      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };
        updatedColumns[columnId].tasks = updatedColumns[columnId].tasks.filter(
          (task) => task.id !== taskId
        );
        return updatedColumns;
      });
  
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };  

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Kanban Board
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: "flex", mb: 2, justifyContent: "center" }}>
        <TextField value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task" size="small" />
        <Button variant="contained" startIcon={<AddIcon />} onClick={addTask}>
          Add Task
        </Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, overflowX: "auto" }}>
          {Object.values(columns).map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minWidth: 250, p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="h6">{column.title}</Typography>
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, mb: 1, bgcolor: "white", borderRadius: 1, boxShadow: 1 }}
                        >
                          <Typography>{task.name}</Typography>
                          <IconButton size="small" onClick={() => handleDeleteTask(column.id, task.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};
