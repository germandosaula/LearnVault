import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Paper,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";

export const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", severity: "info" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Manejar selección de archivo
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Manejar la subida del archivo
  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: "Por favor selecciona un archivo.", severity: "warning" });
      setOpenSnackbar(true);
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `uploads/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Archivo subido con éxito:", downloadURL);
      setMessage({ text: "Archivo subido con éxito.", severity: "success" });
      setFile(null);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage({ text: "Error al subir el archivo.", severity: "error" });
    } finally {
      setUploading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper elevation={4} sx={{ width: "100%", maxWidth: 500, padding: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
          📁 Subir Documento
        </Typography>
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
          <CardContent>
            <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                type="file"
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file || uploading}
                fullWidth
              >
                {uploading ? <CircularProgress size={24} /> : "Subir Archivo"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* Notificación Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={message.severity} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};