/**
 * ✅ Script profesional para reinicializar la base de datos
 * Ejecuta:  node resetDatabase.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function resetDB() {
  try {
    console.log("⏳ Conectando a MongoDB...");

    await mongoose.connect(process.env.DB_MONGO);

    console.log("✅ Conexión establecida");

    // ✅ Eliminar TODAS las colecciones actuales
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.drop().catch(() => {});
      console.log(`🗑️ Eliminada colección: ${collection.collectionName}`);
    }

    console.log("✅ Base de datos limpiada completamente\n");

    // ✅ Crear SUPERADMIN
    console.log("👑 Creando SUPERADMIN...");

    const hashed = await bcrypt.hash("SuperAdmin123!", 10);

    const User = require("./models/User");

    const superadmin = await User.create({
      name: "Super Admin",
      email: "plumikscrm@gmail.com",
      password: hashed,
      role: "superadmin",
      isActive: true,
      mustChangePassword: false,
      permissions: {}, // superadmin no necesita permisos
    });

    console.log("✅ SUPERADMIN creado:");
    console.log({
      email: superadmin.email,
      password: "SuperAdmin123!",
    });

    console.log("\n🎉 Base de datos reinicializada correctamente.");
    process.exit();
  } catch (error) {
    console.error("❌ Error al reinicializar la base de datos:", error);
    process.exit(1);
  }
}

resetDB();