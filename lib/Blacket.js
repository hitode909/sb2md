const { link, image } = require("./formats");
class Blacket {
  constructor(chars) {
    this.chars = [chars.shift()];
  }
  static match(chars) {
    return chars[0] === '[';
  }
  canAccept(chars) {
    if (chars[0] === ']')
      return true;
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
    return link(keyword, `./${encodeURIComponent(keyword)}.md`);
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
    }
    else {
      uri = segments.pop();
    }
    const keyword = segments.join(' ');
    if (!keyword && uri.match(/\.(jpg|png|gif)$/i)) {
      return image(uri, uri);
    }
    return link(keyword, uri);
  }
}

exports.Blacket = Blacket;
