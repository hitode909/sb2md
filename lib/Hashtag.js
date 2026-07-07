const { link } = require("./formats");
class Hashtag {
  constructor(chars) {
    this.chars = [chars.shift()];
  }
  static match(chars, prevChar) {
    if (prevChar !== undefined && !prevChar.match(/\s/)) {
      // hashtag is valid only at the beginning of line or after a space (e.g. not `#` in url)
      return false;
    }
    return chars[0] === '#' && !!chars[1] && !!chars[1].match(/\S/);
  }
  canAccept(chars) {
    return chars[0] && chars[0].match(/\S/);
  }
  accept(chars) {
    this.chars.push(chars.shift());
  }
  toMarkdown() {
    return link(`#${this.keyword()}`, `./${encodeURIComponent(this.keyword())}.md`);
  }
  keyword() {
    return this.chars.slice(1).join('');
  }
}

exports.Hashtag = Hashtag;
