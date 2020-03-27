const { Hashtag } = require("./Hashtag");
const { Link } = require("./Link");

class Bracket {
  constructor(chars) {
    this.chars = [chars.shift()];
    this.symbols = [];
  }
  static match(chars) {
    return chars[0] === '[';
  }
  parse(chars) {
    if (chars.length <= 0) {
      // `[` at the end of line
      return;
    }
    if (chars[0] === ']') {
      // `[]`
      this.chars.push(chars.shift());
      return;
    }
    if (chars[0] === '[') {
      // `[[bold text]]`
      this.bold = true;
      this.chars.push(chars.shift());

      // parse bracket content
      const res = parseSymbols(chars.join(''), ']');
      if (!res) {
        // closing `]` not found
        this.chars.push(...chars.splice(0, chars.length));
        this.bold = false;
        this.symbols.splice(0, this.symbols.length);
        return;
      }
      this.symbols.push(...res.symbols);
      this.chars.push(...chars.splice(0, chars.length - res.left));

      // `]]`
      this.chars.push(chars.shift());
      this.chars.push(chars.shift());
      return;
    }
    if (!/^[*-_]+/.test(chars.join(''))) {
      // `[link text]`
      this.link = true;
      while (chars.length > 0 && chars[0] !== ']') {
        const c = chars.shift();
        this.chars.push(c);
        this.symbols.push(c);
      }
      if (chars.length <= 0) {
        this.link = false;
        this.symbols.splice(0, this.symbols.length);
        return;
      }
      this.chars.push(chars.shift());
      return;
    }

    // check control char
    const c = chars.shift();
    switch (c) {
      case '*':
        // `[* bold text]`
        this.bold = true;
        break;
      case '-':
        // `[- strike text]`
        this.del = true;
        break;
      case '_':
        // `[_ underline text]`
        this.u = true;
        break;
    }
    while (chars[0] === c) {
      this.chars.push(chars.shift());
    }

    // remove spaces
    const numSpaces = chars.join('').match(/^\s+/)[0].length;
    this.chars.push(c, ...chars.splice(0, numSpaces));

    // parse bracket content
    const res = parseSymbols(chars.join(''), ']');
    if (!res) {
      // closing `]` not found
      this.chars.push(...chars.splice(0, chars.length));
      this.bold = this.del = this.u = false;
      this.symbols.splice(0, this.symbols.length);
      return;
    }
    this.symbols.push(...res.symbols);
    this.chars.push(...chars.splice(0, chars.length - res.left + 1));
  }
  toMarkdown() {
    if (this.symbols.length > 0) {
      if (this.link) {
        const text = s2md(this.symbols);
        return new Link(text).toMarkdown();
        // return `[${text}](./${encodeURIComponent(text)}.md)`;
      }
      if (this.bold) {
        return `<b>${s2md(this.symbols)}</b>`;
      }
      if (this.del) {
        return `<del>${s2md(this.symbols)}</del>`;
      }
      if (this.u) {
        return `<u>${s2md(this.symbols)}</u>`;
      }
    }
    // `[`, `[]`, and other unsupported brackets
    return this.chars.join('');
  }
}

function parseSymbols(content, delimiter) {
  const symbols = [];
  const chars = content.split('');
  while (chars.length > 0) {
    if (Hashtag.match(chars)) {
      // push a hashtag object
      const hashtag = new Hashtag(chars);
      while (hashtag.canAccept(chars)) {
        hashtag.accept(chars);
      }
      symbols.push(hashtag);
    }
    else if (Bracket.match(chars)) {
      // push a bracket symbol
      const bracket = new Bracket(chars);
      bracket.parse(chars);
      symbols.push(bracket);
    }
    else if (chars[0] === delimiter) {
      // delimiter found
      return { symbols, left: chars.length };
    }
    else {
      // push a raw char
      symbols.push(chars.shift());
    }
  }
  if (delimiter) {
    // delimiter not found
    return null;
  }

  // end of line
  return { symbols, left: 0 };
}

function s2md(symbols) {
  return symbols.map(s => s.toMarkdown ? s.toMarkdown() : s).join('');
}

exports.Bracket = Bracket;
exports.parseSymbols = parseSymbols;
exports.s2md = s2md;
