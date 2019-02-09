const { Document } = require("./Document");

const sb2md = (source) => {
  const lines = source.split(/\n/);
  const document = new Document;
  document.accept(lines);
  return document.toMarkdown();
}

exports.sb2md = sb2md;
