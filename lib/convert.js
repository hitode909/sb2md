const url = require('url');

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
      } else {
        this.contents.push(new Line(lines));
      }
    }
  }

  toMarkdown() {
    return this.contents.map(content => content.toMarkdown()).join("  \n");
  }
}

const link = (content, href) => {
  const parsed = url.parse(href);
  if (parsed.host && (parsed.host.match(/^gyazo\.com$/i) || parsed.host.match(/\.gyazo\.com$/i))) {
    return image(`${href}/thumb/250`, href);
  }
  return `[${content}](${href})`;
}

const image = (src, href) => {
  return `[![${src}](${src})](${href})`;
}

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
    } else {
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
      } else if (Blacket.match(chars)) {
        const blacket = new Blacket(chars);
        while (blacket.canAccept(chars)) {
          blacket.accept(chars);
        }
        symbols.push(blacket);
      } else {
        symbols.push(chars.shift());
      }
    }
    return symbols;
  }
}

class Hashtag {
  constructor(chars) {
    this.chars = [chars.shift()];
  }

  static match(chars) {
    return chars[0] === '#';
  }

  canAccept(chars) {
    return chars[0] && chars[0].match(/\S/);
  }

  accept(chars) {
    this.chars.push(chars.shift());
  }

  toMarkdown() {
    return link(`#${this.keyword()}`, `./${this.keyword()}.md`);
  }

  keyword() {
    return this.chars.slice(1).join('');
  }
}

class Blacket {
  constructor(chars) {
    this.chars = [chars.shift()];
  }

  static match(chars) {
    return chars[0] === '[';
  }

  canAccept(chars) {
    if (chars[0] === ']') return true;
    return this.chars[this.chars.length - 1] !== ']';
  }

  accept(chars) {
    this.chars.push(chars.shift());
  }

  toMarkdown() {
    const keyword = this.keyword();
    if (this.isEmphasis()) {
      return this.toMarkdownEmphasis();
    }
    if (this.isRelativeLink()) {
      return this.toMarkdownRelativeLink();
    }
    if (this.isExternalLink()) {
      return this.toMarkdownExternalLink();
    }
    return link(keyword, `./${keyword}.md`);
  }

  keyword() {
    return this.chars.slice(1, -1).join('');
  }

  isEmphasis() {
    return this.chars[1] === '*' || this.chars[1] === '[';
  }

  toMarkdownEmphasis() {
    const keyword = this.keyword().replace(/^\[+/, '').replace(/\]+$/, '').replace(/\*+/, '');
    return `<b>${keyword}</b>`;
  }

  isRelativeLink() {
    return this.chars[1] === '/';
  }

  toMarkdownRelativeLink() {
    return link(this.keyword(), 'https://scrapbox.io' + this.keyword());
  }

  isExternalLink() {
    const segments = this.keyword().split(/ /);
    return segments[0].match(/^http/i) || segments[segments.length - 1].match(/^http/i);
  }

  toMarkdownExternalLink() {
    const segments = this.keyword().split(/ /);
    let uri;
    if (segments[0].match(/^http/i)) {
      uri = segments.shift();
    } else {
      uri = segments.pop();
    }
    const keyword = segments.join(' ');
    if (!keyword && uri.match(/\.(jpg|png|gif)$/i)) {
      return image(uri, uri);
    }
    return link(keyword, uri);
  }
}

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

const convert = (source) => {
  const lines = source.split(/\n/);
  const document = new Document;
  document.accept(lines);
  return document.toMarkdown();
}

exports.convert = convert;
