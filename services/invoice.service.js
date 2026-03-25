
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");


exports.findAll = () => Invoice.find().sort({ createdAt: -1 });

exports.findById = (id) => Invoice.findById(id);

exports.findByClient = (clientId) =>
  Invoice.find({ clientId }).sort({ createdAt: -1 });

exports.create = (data) => {
  const invoice = new Invoice(data);
  return invoice.save();
};

exports.update = (id, data) =>
  Invoice.findByIdAndUpdate(id, data, { new: true });

exports.remove = (id) => Invoice.findByIdAndDelete(id);


exports.generatePdf = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];
      
      doc.on("data", (chunk) => chunks.push(chunk));
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
      if (invoice.dueDate) doc.text(`Vencimiento: ${new Date(invoice.dueDate).toLocaleDateString("es-ES")}`);
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

      // Cabecera
      doc.font("Helvetica-Bold");
      doc.text("Descripción", itemX, tableTop);
      doc.text("Cant.", qtyX, tableTop);
      doc.text("Precio", priceX, tableTop);
      doc.text("IVA", taxX, tableTop);
      doc.text("Importe", totalX, tableTop);

      doc.font("Helvetica");
      let position = tableTop + 20;

      invoice.lines.forEach((l) => {
        doc.text(l.description, itemX, position);
        doc.text(l.quantity.toString(), qtyX, position);
        doc.text(`${l.unitPrice.toFixed(2)}€`, priceX, position);
        doc.text(`${l.taxRate}%`, taxX, position);
        doc.text(`${(l.unitPrice * l.quantity).toFixed(2)}€`, totalX, position);
        position += 20;
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

/* ----------- ENVÍO DE EMAIL ----------- */
exports.sendEmail = async ({ to, replyTo, subject, pdfBuffer, filename }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // TU NUEVO GMAIL
      pass: process.env.EMAIL_PASS,   // CONTRASEÑA DE APLICACIÓN
    },
  });

  return transporter.sendMail({
    from: `Plumiks CRM <${process.env.EMAIL_USER}>`,
    to,              // correo del cliente
    replyTo,         // correo del autónomo
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
