const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// ✅ Conexión MongoDB
connectDB();

// ✅ Lista de orígenes permitidos
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://plumbflow-crm-fonsijr6s-projects.vercel.app"
];

// ✅ Middleware CORS COMPLETAMENTE MANUAL
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // ✅ Responder preflight correctamente
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Body + cookies SIEMPRE DESPUÉS DE CORS
app.use(express.json());
app.use(cookieParser());

// ✅ Rutas API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clients", require("./routes/client"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/tasks", require("./routes/task"));

// ✅ Manejo de JSON inválido
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ msg: "JSON inválido" });
  }
  next(err);
});

// ✅ Puerto Railway
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log("✅ Servidor funcionando en puerto", PORT)
);