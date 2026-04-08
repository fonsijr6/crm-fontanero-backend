require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
connectDB();
/* ============================
   🔴 CORS – DEBE IR PRIMERO
   ============================ */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://plumbflow-8pjpp1eym-fonsijr6s-projects.vercel.app",
    "https://plumiks.com",
    "https://www.plumiks.com"
  ],
  credentials: true
}));

/* ============================
   Middleware estándar
   ============================ */

app.use(express.json());
app.use(cookieParser());

/* ============================
   RUTAS
   ============================ */
app.use("/api/auth", require("./routes/auth.routes"));
// Solo desarrollo
app.use("/api/setup", require("./routes/setup.routes"));

// ✅ Rutas multiempresa
app.use("/api/company/users", require("./routes/company/users.routes"));
app.use("/api/company/clients", require("./routes/company/clients.routes"));
app.use("/api/company/tasks", require("./routes/company/tasks.routes"));
app.use("/api/company/products", require("./routes/company/products.routes"));
app.use("/api/company/quotes", require("./routes/company/quotes.routes"));
app.use("/api/company/invoices", require("./routes/company/invoices.routes"));
app.use("/api/company/stock", require("./routes/company/stock.routes"));

/* ============================ */


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("✅ Backend corriendo en puerto", PORT);
});
