const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1377147466088185968/uFS0VOvBxh8T4-xR41ewWCWlEcnX04pngO9G_O3UGDdCQAAE-00r1s9dzrdnwaXemkCu'; 


app.post('/send-discord', async (req, res) => {
  const { mensaje } = req.body;

  console.log("Mensaje recibido del cliente:", mensaje);

  if (!mensaje || mensaje.trim() === "") {
    return res.status(400).json({ success: false, message: "El mensaje no puede estar vacío." });
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: mensaje })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Error desconocido al enviar a Discord" };
      }
      return res.status(response.status).json({ success: false, message: errorData.message });
    }

    res.json({ success: true, message: 'Mensaje enviado exitosamente.' });
  } catch (error) {
  console.error("❌ Error en la petición al webhook:", error); 
  res.status(500).json({
    success: false,
    message: "Error al conectar con Discord.",
    error: error.message
  });
}
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
