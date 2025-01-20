import React, { useState, useEffect } from "react";
import {Container, Grid, Card, CardContent, Typography, TextField, MenuItem, Button, CircularProgress, Pagination} from "@mui/material";
import "../../styles/Dashboard/ResourceList.css";

export const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    keyword: "",
    date: "",
  });
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Error al cargar las categorías.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: filters.category,
        keyword: filters.keyword,
        date: filters.date,
        page,
      }).toString();

      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Error al obtener recursos.");
      const data = await response.json();
      setResources(data.resources);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom>
        Lista de Recursos
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} className="filter-grid">
        <Grid item xs={12} sm={4}>
          <TextField
            className="filter-input"
            label="Categoría"
            name="category"
            select
            value={filters.category}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            className="filter-input"
            label="Palabra clave"
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            className="filter-input"
            label="Fecha"
            name="date"
            type="date"
            value={filters.date}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        className="filter-button"
        onClick={fetchResources}
      >
        Aplicar Filtros
      </Button>

      {/* Lista de Recursos */}
      {loading ? (
        <CircularProgress className="loading" />
      ) : resources.length > 0 ? (
        <Grid container spacing={2} marginTop={2}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card className="card">
                <CardContent className="card-content">
                  <Typography className="card-title">{resource.title}</Typography>
                  <Typography className="card-description">
                    {resource.description}
                  </Typography>
                  <Typography>
                    Categoría: {resource.category}
                  </Typography>
                  <Typography>
                    Fecha: {new Date(resource.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className="no-results">
          No se encontraron resultados para los filtros aplicados.
        </Typography>
      )}

      {/* Paginación */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        className="pagination"
      />
    </Container>
  );
};