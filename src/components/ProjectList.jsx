import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ProjectList = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = storedProjects.find(project => project.id === Number(id));
    if (project) {
      setTasks(project.tasks || []);
    }
  }, [id]);

  const handleAddTask = () => {
    if (task && description) {
      const newTask = { task, description };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      updateProjectTasks(updatedTasks);
      setTask('');
      setDescription('');
    }
  };

  const handleDeleteTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    updateProjectTasks(newTasks);
  };

  const handleUpdateTask = () => {
    if (currentIndex >= 0 && task && description) {
      const updatedTasks = tasks.map((item, index) =>
        index === currentIndex ? { task, description } : item
      );
      setTasks(updatedTasks);
      updateProjectTasks(updatedTasks);
      setTask('');
      setDescription('');
      setCurrentIndex(-1);
    }
  };

  const handleEditTask = index => {
    setTask(tasks[index].task);
    setDescription(tasks[index].description);
    setCurrentIndex(index);
  };

  const handleDeleteAllTasks = () => {
    setTasks([]);
    updateProjectTasks([]);
  };

  const updateProjectTasks = updatedTasks => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = storedProjects.map(project =>
      project.id === Number(id) ? { ...project, tasks: updatedTasks } : project
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Project Details
      </Typography>
      <Box mb={2}>
        <TextField
          label="Project's Associated Task"
          fullWidth
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Enter Your Task"
          margin="normal"
        />
        <TextField
          label="Project Task Description"
          fullWidth
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter the description"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={currentIndex === -1 ? handleAddTask : handleUpdateTask}
          disabled={!(task && description)}
          style={{ marginLeft: '10px' }}
        >
          {currentIndex === -1 ? 'Add Task' : 'Update Task'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteAllTasks}
          style={{ marginLeft: '10px' }}
        >
          Delete All Tasks
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.task}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditTask(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProjectList;
