const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// ✅ Conexión a MongoDB
connectDB();

// ✅ CORS para permitir Vercel + cookies httpOnly
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://plumbflow-crm-fonsijr6s-projects.vercel.app",
];

app.use((req, res, next) => {
  // Permitir credenciales
  res.header("Access-Control-Allow-Credentials", "true");

  // Permitir origen dinámicamente
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  // Headers permitidos
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Métodos permitidos
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Body parser + cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Rutas backend
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clients", require("./routes/client"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/tasks", require("./routes/task"));

// ✅ Manejo de errores JSON
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ msg: "JSON inválido" });
  }
  next(err);
});

// ✅ Puerto dinámico (Railway) + fallback local
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("✅ Servidor corriendo en el puerto", PORT);
});