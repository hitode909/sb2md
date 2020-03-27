const { parseSymbols } = require("./Bracket");

class Line {
  constructor(lines) {
    this.rawContent = lines.shift();
  }
  toMarkdown() {
    return this.indentPart() + this.bodyPart();
  }
  indentPart() {
    const indentLevel = this.rawContent.match(/^\s*/)[0].length;
    if (indentLevel > 0) {
      return '  '.repeat(indentLevel) + '- ';
    }
    else {
      return '';
    }
  }
  bodyPart() {
    const { symbols } = parseSymbols(this.rawContent.trim());
    return symbols.map(s => s.toMarkdown ? s.toMarkdown() : s).join('');
  }
}

exports.Line = Line;
