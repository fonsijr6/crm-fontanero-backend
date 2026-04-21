require("dotenv").config();
const mongoose = require("mongoose");

const Task = require("../models/Task");
const Quote = require("../models/Quote");
const Invoice = require("../models/Invoice");

async function migrateCollection(Model, name) {
  const result = await Model.updateMany(
    {
      client: { $exists: false },
      clientId: { $exists: true },
    },
    [
      { $set: { client: "$clientId" } },
      { $unset: "clientId" },
    ],
    {
      updatePipeline: true, // ✅ ESTA ES LA CLAVE
    }
  );

  console.log(
    `✅ ${name}: ${result.modifiedCount ?? result.nModified ?? 0} documentos migrados`
  );
}

async function run() {
  try {
    await mongoose.connect(process.env.DB_MONGO);

    console.log("🚀 Migrando clientId → client...\n");

    await migrateCollection(Task, "Tasks");
    await migrateCollection(Quote, "Quotes");
    await migrateCollection(Invoice, "Invoices");

    console.log("\n✅ Migración completada con éxito");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error durante la migración:", err);
    process.exit(1);
  }
}

run();