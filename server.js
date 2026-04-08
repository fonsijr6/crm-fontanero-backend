require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();


const allowedOrigins = [
  "http://localhost:5173",
  "https://plumbflow-8pjpp1eym-fonsijr6s-projects.vercel.app",
  "https://plumiks.com",
  "https://www.plumiks.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests sin origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 🔴 IMPORTANTE: NO lanzar error
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


app.use(express.json());
app.use(cookieParser());

// ✅ Auth
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

app.listen(4000, () => console.log("✅ Backend iniciado en 4000"));