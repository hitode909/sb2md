import test from 'ava';
const { sb2md } = require('../lib/sb2md');

test('indent', t => {
    t.is(sb2md(' a'), '  - a');
});

test('link', t => {
  t.is(sb2md('[日本語]'), '[日本語](./%E6%97%A5%E6%9C%AC%E8%AA%9E.md)');
});
