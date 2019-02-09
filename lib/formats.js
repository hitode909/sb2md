const url = require('url');

const link = (content, href) => {
  const parsed = url.parse(href);
  if (parsed.host && (parsed.host.match(/^gyazo\.com$/i) || parsed.host.match(/\.gyazo\.com$/i))) {
    return image(`${href}/thumb/250`, href);
  }
  return `[${content}](${href})`;
};

const image = (src, href) => {
  return `[![${src}](${src})](${href})`;
};

exports.link = link;
exports.image = image;
