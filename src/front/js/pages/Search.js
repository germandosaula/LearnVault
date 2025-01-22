import React, { useState } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Modal, Box, Pagination} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DownloadIcon from "@mui/icons-material/Download";
import { Document, Page, pdfjs } from "react-pdf";
import "../../styles/Dashboard/search.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

export const Search = () => {
  const [resources] = useState([
    {
      id: 1,
      title: "Introducción a React",
      description: "Una guía básica para aprender los fundamentos de React.",
      category: "Programación",
      date: "2025-01-15",
      imageUrl: "https://cdn.prod.website-files.com/5dbb30f00775d4350591a4e5/6335d12aa8bba4d2c450c8d7_react%20js%20introduction%20microverse%20(2).webp",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 2,
      title: "Diseño UX/UI para principiantes",
      description: "Explora los conceptos clave de diseño centrado en el usuario.",
      category: "Diseño",
      date: "2025-01-12",
      imageUrl: "https://www.uxdesigninstitute.com/blog/wp-content/uploads/2024/11/101_UX_vs_UI_illustration_blog-1.png",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 3,
      title: "Estrategias de Marketing Digital",
      description: "Consejos para mejorar tu presencia en redes sociales.",
      category: "Marketing",
      date: "2025-01-10",
      imageUrl: "https://www.hostingplus.com.es/wp-content/uploads/2020/04/marketing-digital-hm.jpg",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 4,
      title: "JavaScript Avanzado",
      description: "Profundiza en los conceptos avanzados de JavaScript.",
      category: "Programación",
      date: "2025-01-08",
      imageUrl: "https://quickops.pt/wp-content/uploads/2023/08/MicrosoftTeams-image-127.png",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 5,
      title: "Guía de Fotografía para Principiantes",
      description: "Aprende los fundamentos de la fotografía con esta guía.",
      category: "Fotografía",
      date: "2025-01-05",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6EiTgkH2hlVu40Tb8Cn_V0KYnCCBr-zbasA&s",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 6,
      title: "Curso de SEO Avanzado",
      description: "Mejora el posicionamiento de tu sitio web en motores de búsqueda.",
      category: "Marketing",
      date: "2025-01-03",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCG7h_AyLfJEPIby9QafLej8JA-l1qZEjFzg&s",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 7,
      title: "Cómo Crear Aplicaciones Móviles",
      description: "Una introducción al desarrollo de aplicaciones móviles.",
      category: "Programación",
      date: "2024-12-30",
      imageUrl: "https://www.techmango.net/wp-content/uploads/2022/04/mobile-app-development.png",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 8,
      title: "Gestión de Proyectos Ágiles",
      description: "Aprende a gestionar proyectos utilizando metodologías ágiles.",
      category: "Gestión",
      date: "2024-12-28",
      imageUrl: "https://soldevelo.com/wp-content/uploads/2020/12/Agile-software-dev-1.jpeg",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 9,
      title: "Fundamentos de la IA",
      description: "Descubre los conceptos básicos de la inteligencia artificial.",
      category: "Tecnología",
      date: "2024-12-25",
      imageUrl: "https://whitestack.com/wp-content/uploads/2023/11/AI-1.webp",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      id: 10,
      title: "Psicología del Usuario",
      description: "Comprende el comportamiento del usuario para diseñar mejores productos.",
      category: "Psicología",
      date: "2024-12-20",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRt38ckpYLYbRuEUiqjHv1ioXvsDEmehGZ3w&s",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [page, setPage] = useState(1);
  const resourcesPerPage = 6;

  const handleOpenModal = (resource) => {
    setSelectedResource(resource);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedResource(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastResource = page * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirstResource, indexOfLastResource);

  return (
    <Container className="container">
      <Typography className="main-title" variant="h4" sx={{ fontWeight: "bold", fontFamily: "'Poppins', sans-serif"}} gutterBottom>
        Resource List
      </Typography>

      <Grid container spacing={2} className="filter-grid">
        {currentResources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <Card className="card">
              <CardMedia
                component="img"
                height="140"
                image={resource.imageUrl}
                alt={resource.title}
              />
              <CardContent className="card-content">
                <Typography
                  variant="h6"
                  className="card-title"
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleOpenModal(resource)}
                >
                  {resource.title}
                </Typography>
                <Typography className="card-description">
                  {resource.description}
                </Typography>
                <Typography>Category: {resource.category}</Typography>
                <Typography>
                  Date: {new Date(resource.date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="pagination">
        <Pagination
          count={Math.ceil(resources.length / resourcesPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {selectedResource && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            zIndex: 1300,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {selectedResource.title}
            </Typography>

            <Box
              sx={{
                height: "400px",
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: 2,
                marginBottom: 2,
              }}
            >
              <Document
                file={selectedResource.pdfUrl}
                onLoadError={(error) => console.error("Error loading PDF:", error)}
              >
                <Page pageNumber={1} />
              </Document>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                startIcon={<FavoriteIcon />}
                onClick={() => alert("Added to favorites")}
              >
                Add to Favorites
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DownloadIcon />}
                href={selectedResource.pdfUrl}
                target="_blank"
              >
                Download
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Container>
  );
};