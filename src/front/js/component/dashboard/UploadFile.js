import React, { useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";

export const UploadFile = ({ uploadUrl }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Selecciona un archivo antes de subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          // Si tu backend necesita autenticación, agrega aquí el token
          // "Authorization": `Bearer ${yourToken}`
        },
      });

      if (response.ok) {
        setMessage("Archivo subido correctamente 🎉");
      } else {
        setMessage("Error al subir el archivo ❌");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6">Subir Archivo</Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} sx={{ marginTop: 2 }}>
        Subir
      </Button>
      {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
      {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
};