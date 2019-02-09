const { link } = require("./formats");
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

exports.Hashtag = Hashtag;
