import React, { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Paper,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material"
import { OpenInNew, Delete, Favorite } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(2),
  background: "transparent",
  boxShadow: "none",
}))

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2, 2, 2),
  position: "relative",
  "& .MuiCardHeader-title": {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  background: "transparent",
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) throw new Error("No hay token en localStorage.")

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`)

        const data = await response.json()
        console.log("Respuesta API:", data)

        setFavorites(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error obteniendo favoritos:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Error eliminando favorito")

      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId))
    } catch (error) {
      console.error("Error eliminando favorito:", error)
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <StyledCard>
        <Favorite
          sx={{
            position: "absolute",
            top: -35,
            left: -15,
            fontSize: 90,
            color: "#ff6a88",
            transform: "rotate(-20deg)",
            zIndex: 1000,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(0deg) scale(1.05)",
              color: "#ff9a8b",
            },
          }}
        />
        <Box sx={{ position: "relative" }}>

          <StyledCardHeader title="Favorite Resources" />
        </Box>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : favorites.length === 0 ? (
            <Alert severity="info">You don't have any favorites yet.</Alert>
          ) : (
            <StyledTableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      <Typography variant="subtitle1">
                        <strong>Title</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="subtitle1">
                        <strong>Type</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="subtitle1">
                        <strong>Actions</strong>
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favorites.map((fav) => (
                    <TableRow key={fav.id}>
                      <StyledTableCell>{fav.document_title}</StyledTableCell>
                      <StyledTableCell>{fav.document_type}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Tooltip title="Open document">
                          <Button
                            variant="contained"
                            size="small"
                            href={`/document/${fav.document_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<OpenInNew />}
                            sx={{
                              marginRight: "8px",
                              backgroundColor: "#ff6a88",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#ff99ac",
                                color: "white", // Esto mantendrá el texto blanco al hacer hover
                              },
                            }}
                          >
                            Open
                          </Button>
                        </Tooltip>
                        <Tooltip title="Remove from favorites">
                          <IconButton color="error" onClick={() => handleDeleteFavorite(fav.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  )
}