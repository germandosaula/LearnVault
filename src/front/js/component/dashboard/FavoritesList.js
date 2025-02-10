import React, { useEffect, useState, useCallback } from "react"
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Fade,
  Tooltip,
} from "@mui/material"
import { ArrowForwardIos, OpenInNew, Delete, Favorite } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(2),
  background: "transparent",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.02)",
  },
  transition: "all 0.3s ease-in-out",
}))

export const FavoritesList = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No hay token en localStorage.")
      const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`)
      const data = await response.json()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Error eliminando favorito")
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId))
    } catch (error) {
      console.error("Error eliminando favorito:", error)
      setError("Error al eliminar el favorito. Por favor, inténtalo de nuevo.")
    }
  }

  const handleOpenDocument = (src_url) => {
    if (src_url) {
      window.open(src_url, "_blank", "noopener,noreferrer")
    } else {
      setError("No se puede abrir el documento. URL no disponible.")
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box sx={{ position: "relative" }}>
      </Box>
      <StyledCard>
        <Box sx={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.primary.main, paddingTop: "24px" }}>
            Favorite Resources
          </Typography>
        </Box>
        <CardContent
          sx={{
            mb: 0,
            pb: 0,
            maxHeight: 400,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.light,
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : favorites.length === 0 ? (
            <Alert severity="info">You don't have any favorites yet.</Alert>
          ) : (
            <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: theme.shape.borderRadius }}>
              {favorites.map((fav, index) => (
                <React.Fragment key={fav.id}>
                  <StyledListItem
                    secondaryAction={
                      <>
                        <Tooltip title={fav.src_url ? "Open document" : "URL not available"}>
                          <span>
                            <IconButton
                              edge="end"
                              onClick={() => handleOpenDocument(fav.src_url)}
                              disabled={!fav.src_url}
                              sx={{ mr: 1 }}
                            >
                              <OpenInNew />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <IconButton edge="end" onClick={() => handleDeleteFavorite(fav.id)} sx={{ mr: 1 }}>
                          <Delete />
                        </IconButton>
                        <IconButton edge="end" onClick={() => navigate(`/dashboard/favorites/${fav.id}`)}>
                          <ArrowForwardIos />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={
                          fav.image_url ||
                          "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg"
                        }
                        sx={{ width: 48, height: 48, borderRadius: theme.shape.borderRadius }}
                        variant="rounded"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {fav.document_title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {fav.document_type}
                        </Typography>
                      }
                    />
                  </StyledListItem>
                  {index < favorites.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  )
}