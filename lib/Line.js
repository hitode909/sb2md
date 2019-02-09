const { Hashtag } = require("./Hashtag");
const { Blacket } = require("./Blacket");

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
    const symbols = this.parseSymbols(this.rawContent.trim());
    return symbols.map(s => s.toMarkdown ? s.toMarkdown() : s).join('');
  }
  parseSymbols(content) {
    const symbols = [];
    const chars = content.split('');
    while (chars.length > 0) {
      if (Hashtag.match(chars)) {
        const hashtag = new Hashtag(chars);
        while (hashtag.canAccept(chars)) {
          hashtag.accept(chars);
        }
        symbols.push(hashtag);
      }
      else if (Blacket.match(chars)) {
        const blacket = new Blacket(chars);
        while (blacket.canAccept(chars)) {
          blacket.accept(chars);
        }
        symbols.push(blacket);
      }
      else {
        symbols.push(chars.shift());
      }
    }
    return symbols;
  }
}

exports.Line = Line;
