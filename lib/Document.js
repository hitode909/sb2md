const { Line } = require("./Line");
const { CodeBlock } = require("./CodeBlock");
// todo: parse `[]`
// todo: handle .icon
// todo: handle# in url
class Document {
  constructor() {
    this.contents = [];
  }
  accept(lines) {
    while (lines.length > 0) {
      if (CodeBlock.match(lines)) {
        const code = new CodeBlock(lines);
        while (code.canAccept(lines)) {
          code.accept(lines);
        }
        this.contents.push(code);
      }
      else {
        this.contents.push(new Line(lines));
      }
    }
  }
  toMarkdown() {
    return this.contents.map(content => content.toMarkdown()).join("  \n");
  }
}
exports.Document = Document;
