const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// ✅ Conexión BD
connectDB();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://plumiks.com",
    "https://www.plumiks.com",
    "https://plumbflow-crm-fonsijr6s-projects.vercel.app"
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clients", require("./routes/client"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/invoices", require("./routes/invoice"));

// ✅ Manejo JSON inválido
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed")
    return res.status(400).json({ msg: "JSON inválido" });
  next(err);
});

// ✅ 🚨 AQUÍ EL FIX REAL
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor funcionando en puerto ${PORT}`);
});
