import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, MoreHoriz as MoreIcon } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTask, setProjectTask] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, []);

  const handleAddProject = () => {
    let token = localStorage.getItem("firebase_token");

    if (token) {
      setIsAddingProject(true);
      setCurrentIndex(-1); // Reset currentIndex to -1 for adding new projects
      setProjectName("");
      setProjectDescription("");
      setProjectTask("");
    } else {
      alert("Please! Sign in to add projects!");
      navigate("/signin");
    }
  };

  const handleSaveProject = () => {
    if (projectName && projectDescription && projectTask) {
      if (currentIndex === -1) {
        // Add new project
        const newProject = {
          name: projectName,
          description: projectDescription,
          task: projectTask,
          id: Date.now(),
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      } else {
        // Update existing project
        const updatedProjects = projects.map((project, index) =>
          index === currentIndex
            ? {
                ...project,
                name: projectName,
                description: projectDescription,
                task: projectTask,
              }
            : project
        );
        setProjects(updatedProjects);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      }

      setIsAddingProject(false);
      setCurrentIndex(-1);
      setProjectName("");
      setProjectDescription("");
      setProjectTask("");
    }
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleDeleteAllProjects = () => {
    setProjects([]);
    localStorage.removeItem("projects");
  };

  const handleEditProject = (index) => {
    setCurrentIndex(index);
    const project = projects[index];
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectTask(project.task);
    setIsAddingProject(true);
  };

  const handleMore = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Projects
      </Typography>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={handleAddProject}>
          Add Project
        </Button>
        {projects.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteAllProjects}
            style={{ marginLeft: "10px" }}
          >
            DELETE ALL
          </Button>
        )}
      </Box>

      {isAddingProject && (
        <Box mb={2}>
          <Typography variant="h6">Add / Edit Project</Typography>
          <TextField
            label="Project Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Project Description"
            fullWidth
            multiline
            minRows={3}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Project Task"
            fullWidth
            value={projectTask}
            onChange={(e) => setProjectTask(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProject}
            style={{ marginTop: "10px" }}
          >
            {currentIndex === -1 ? "Save" : "Update"}
          </Button>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Description</TableCell>
              <TableCell>Project Task</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.task}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditProject(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProject(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleMore(project.id)}>
                    <MoreIcon />
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

export default Home;
