class CodeBlock {
  constructor(lines) {
    this.header = lines.shift();
    this.lines = [];
  }
  static match(lines) {
    return lines[0].match(/^code:/);
  }
  canAccept(lines) {
    return lines[0] && lines[0].match(/^\s+/);
  }
  accept(lines) {
    this.lines.push(lines.shift());
  }
  toMarkdown() {
    const headerPart = this.header.split(':')[1].replace(/^.+\./, '');
    return "```" + headerPart + "\n" + this.lines.join("\n") + "\n```";
  }
}

exports.CodeBlock = CodeBlock;
