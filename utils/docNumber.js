exports.generateDocumentNumber = (prefix, counter) => {
  const year = new Date().getFullYear();
  const padded = String(counter).padStart(3, "0");
  return `${prefix}${year}-${padded}`;
};