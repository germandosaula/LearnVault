import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

const getToken = () => {
  return localStorage.getItem('token');
};

const API_URL =
  "https://super-couscous-wr94q9xj47xgcgg9v-3001.app.github.dev/api";

const initialColumns = [
  { id: "tasks", title: "Tasks", tasks: [] },
  { id: "tomorrow", title: "Tomorrow", tasks: [] },
  { id: "thisWeek", title: "This Week", tasks: [] },
  { id: "nextWeek", title: "Next Week", tasks: [] },
  { id: "thisMonth", title: "This Month", tasks: [] },
];

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
      const token = getToken();
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch tasks');
      }

      const tasks = await response.json();
      const updatedColumns = initialColumns.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.status === column.id),
      }));
      setColumns(updatedColumns);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (sourceColumn && destColumn) {
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, tasks: sourceTasks };
          }
          if (col.id === destination.droppableId) {
            return { ...col, tasks: destTasks };
          }
          return col;
        })
      );

      updateTaskStatus(removed.id, destination.droppableId);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
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
        throw new Error("Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status. Please try again.");
    }
  };

  // At the top of your component, add this function
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Modify the addTask function
  const addTask = async () => {
    if (newTask.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !userData) {
          setError('Authentication information missing. Please log in again.');
          return;
        }
  
        console.log('Sending request with token:', token);
        console.log('User data:', userData);
  
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            name: newTask,
            description: '',
            due_date: new Date().toISOString().split('T')[0],
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          
          // If token is expired or invalid, redirect to login
          if (response.status === 401) {
            localStorage.clear(); // Clear stored data
            window.location.href = '/login'; // Redirect to login page
            return;
          }
          
          throw new Error(errorData.msg || 'Failed to create task');
        }
  
        const createdTask = await response.json();
        const updatedColumns = [...columns];
        const tasksColumn = updatedColumns.find(col => col.id === 'tasks');
        if (tasksColumn) {
          tasksColumn.tasks.push(createdTask);
          setColumns(updatedColumns);
        }
        setNewTask('');
      } catch (err) {
        console.error('Error adding task:', err);
        setError(err.message || 'Failed to add task. Please try again.');
      }
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
      setColumns(
        columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== taskId),
            };
          }
          return col;
        })
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center' }}>
        Kanban Board
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', mb: 2, justifyContent: 'center' }}>
        <TextField
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          variant="outlined"
          size="small"
          sx={{ mr: 1, flexGrow: 1, maxWidth: '400px' }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addTask}
        >
          Add Task
        </Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexGrow: 1,
            gap: 2,
            overflowX: isMobile ? 'hidden' : 'auto',
            overflowY: isMobile ? 'auto' : 'hidden',
            height: isMobile ? 'auto' : '100%',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence>
            {columns.map(column => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: isMobile ? '100%' : 250,
                    minWidth: isMobile ? '100%' : 250,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 3,
                    mb: isMobile ? 2 : 0,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 'medium', textAlign: 'center' }}>
                    {column.title}
                  </Typography>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                          flexGrow: 1,
                          minHeight: 100,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          p: 1,
                          overflowY: 'auto',
                          maxHeight: isMobile ? 300 : 'calc(100vh - 250px)',
                        }}
                      >
                        <AnimatePresence>
                          {column.tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Box
                                    sx={{
                                      p: 2,
                                      mb: 1,
                                      minHeight: '50px',
                                      bgcolor: 'white',
                                      borderRadius: 1,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      boxShadow: 1,
                                      '&:hover': {
                                        boxShadow: 3,
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s',
                                      },
                                    }}
                                  >
                                    <Typography sx={{ wordBreak: 'break-word', mr: 1 }}>{task.name}</Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteTask(column.id, task.id)}
                                      sx={{ color: 'error.main' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </DragDropContext>
    </Box>
  );
}