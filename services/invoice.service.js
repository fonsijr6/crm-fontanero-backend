const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");

/* ✅ GET ALL POR USUARIO */
exports.findAll = (userId) => {
  return Invoice.find({ userId }).sort({ createdAt: -1 });
};

/* ✅ GET POR ID (limitado al usuario) */
exports.findById = (userId, id) => {
  return Invoice.findOne({ _id: id, userId });
};

/* ✅ GET POR CLIENTE (limitado al usuario) */
exports.findByClient = (userId, clientId) => {
  return Invoice.find({ userId, clientId }).sort({ createdAt: -1 });
};

/* ✅ CREATE CON userId */
exports.create = (userId, data) => {
  return Invoice.create({ userId, ...data });
};

/* ✅ UPDATE SOLO SI ES DEL USUARIO */
exports.update = (userId, id, data) => {
  return Invoice.findOneAndUpdate(
    { _id: id, userId },
    { ...data },
    { new: true }
  );
};

/* ✅ DELETE SOLO DEL USUARIO */
exports.remove = (userId, id) => {
  return Invoice.findOneAndDelete({ _id: id, userId });
};

/* ✅ Generación PDF COMPLETA (igual que tu versión original) */
exports.generatePdf = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];

      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // ✅ TÍTULO
      doc.fontSize(20).text(`Factura ${invoice.invoiceNumber}`, { align: "left" });
      doc.moveDown();

      // ✅ EMISOR
      doc.fontSize(12).text(`Emisor: ${invoice.issuerName}`);
      if (invoice.issuerNif) doc.text(`NIF: ${invoice.issuerNif}`);
      if (invoice.issuerAddress) doc.text(invoice.issuerAddress);
      doc.moveDown();

      // ✅ CLIENTE
      doc.fontSize(12).text(`Cliente: ${invoice.clientName}`);
      if (invoice.clientNif) doc.text(`NIF: ${invoice.clientNif}`);
      if (invoice.clientAddress) doc.text(invoice.clientAddress);
      doc.moveDown();

      // ✅ FECHAS
      doc.text(`Fecha emisión: ${new Date(invoice.date).toLocaleDateString("es-ES")}`);
      if (invoice.dueDate) {
        doc.text(
          `Vencimiento: ${new Date(invoice.dueDate).toLocaleDateString("es-ES")}`
        );
      }
      doc.moveDown();

      // ✅ TABLA – LÍNEAS
      doc.fontSize(12).text("Conceptos:");
      doc.moveDown();

      const tableTop = doc.y;
      const itemX = 50;
      const qtyX = 250;
      const priceX = 330;
      const taxX = 400;
      const totalX = 470;

      doc.font("Helvetica-Bold");
      doc.text("Descripción", itemX, tableTop);
      doc.text("Cant.", qtyX, tableTop);
      doc.text("Precio", priceX, tableTop);
      doc.text("IVA", taxX, tableTop);
      doc.text("Importe", totalX, tableTop);

      doc.font("Helvetica");
      let pos = tableTop + 20;

      invoice.lines.forEach((l) => {
        doc.text(l.description, itemX, pos);
        doc.text(l.quantity.toString(), qtyX, pos);
        doc.text(`${l.unitPrice.toFixed(2)}€`, priceX, pos);
        doc.text(`${l.taxRate}%`, taxX, pos);
        doc.text(`${(l.unitPrice * l.quantity).toFixed(2)}€`, totalX, pos);
        pos += 20;
      });

      doc.moveDown().moveDown();

      // ✅ TOTALES
      doc.fontSize(12)
        .text(`Subtotal: ${invoice.subtotal.toFixed(2)} €`, { align: "right" })
        .text(`IVA: ${invoice.taxTotal.toFixed(2)} €`, { align: "right" })
        .text(`Total: ${invoice.total.toFixed(2)} €`, { align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/* ✅ ENVÍO DE EMAIL COMPLETO (igual que el original) */
exports.sendEmail = async ({ to, replyTo, subject, pdfBuffer, filename }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // ✅ Gmail del autónomo
      pass: process.env.EMAIL_PASS,   // ✅ Contraseña de aplicación
    },
  });

  return transporter.sendMail({
    from: `Plumiks CRM <${process.env.EMAIL_USER}>`,
    to,
    replyTo,
    subject,
    text: "Adjuntamos su factura.",
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });
};