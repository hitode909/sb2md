const { link, image } = require("./formats");

class Link {
  constructor(text) {
    this.text = text;
  }
  toMarkdown() {
    if (this.isRelativeLink()) {
      return this.toMarkdownRelativeLink();
    }
    if (this.isExternalLink()) {
      return this.toMarkdownExternalLink();
    }
    return link(this.text, `./${encodeURIComponent(this.text)}.md`);
  }
  isRelativeLink() {
    return this.text.charAt(0) === '/';
  }
  toMarkdownRelativeLink() {
    return link(this.text, 'https://scrapbox.io' + this.text);
  }
  isExternalLink() {
    const segments = this.text.split(/ /);
    return segments[0].match(/^http/i) || segments[segments.length - 1].match(/^http/i);
  }
  toMarkdownExternalLink() {
    const segments = this.text.split(/ /);
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

exports.Link = Link;
