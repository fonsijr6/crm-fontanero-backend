// server.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// ✅ 1. Conexión BD
connectDB();

// ✅ 2. CORS (actualizado con soportes para superadmin y API móvil)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://plumiks.com",
      "https://www.plumiks.com",
      "https://plumbflow-crm-fonsijr6s-projects.vercel.app"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ 3. Middlewares globales
app.use(express.json({ limit: "10mb" }));  // soporta imágenes pequeñas desde móvil
app.use(cookieParser());

// ✅ 4. Rutas de autenticación
app.use("/api/auth", require("./routes/company/auth"));

// ✅ 5. RUTAS SUPERADMIN (solo para ti)
app.use("/api/admin/companies", require("./routes/admin/company"));

// ✅ 6. RUTAS MULTI‑EMPRESA (todas requieren auth + companyId)
app.use("/api/company/users", require("./routes/company/user"));
app.use("/api/company/clients", require("./routes/company/client"));
app.use("/api/company/tasks", require("./routes/company/task"));
app.use("/api/company/products", require("./routes/company/product"));
app.use("/api/company/quotes", require("./routes/company/quote"));
app.use("/api/company/invoices", require("./routes/company/invoice"));
app.use("/api/company/stock", require("./routes/company/stock"));

// ✅ 7. Manejo de errores JSON
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ msg: "JSON inválido" });
  }
  next(err);
});

// ✅ 8. Servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor iniciado en puerto ${PORT}`);
});