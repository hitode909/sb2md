const { Document } = require("./Document");

// todo: parse `[]`
// todo: handle .icon
// todo: handle# in url

const sb2md = (source) => {
  const lines = source.split(/\n/);
  const document = new Document;
  document.accept(lines);
  return document.toMarkdown();
}

exports.sb2md = sb2md;
