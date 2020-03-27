import test from 'ava';
const { sb2md } = require('../lib/sb2md');

test('indent', t => {
    t.is(sb2md(' a'), '  - a');
});

test('single', t => {
  t.is(sb2md("[* 強調]"), '<b>強調</b>');
});

test('triple', t => {
  t.is(sb2md("[*** 強調]"), '<b style="font-size:1.4em;" class="level-3">強調</b>');
});

test('link', t => {
  t.is(sb2md('[日本語]'), '[日本語](./%E6%97%A5%E6%9C%AC%E8%AA%9E.md)');
});

test('hashtag', t => {
  t.is(sb2md('#日本語'), '[#日本語](./%E6%97%A5%E6%9C%AC%E8%AA%9E.md)');
});

test('space', t => {
  t.is(sb2md(' [日本語] [* hoge]'), '  - [日本語](./%E6%97%A5%E6%9C%AC%E8%AA%9E.md) <b>hoge</b>');
});

test('nested', t => {
  t.is(sb2md('[* [日本語]]'), '<b>[日本語](./%E6%97%A5%E6%9C%AC%E8%AA%9E.md)</b>');
});

test('complex', t => {
  t.is(sb2md("\t[- [日本語]][[テスト]] #English"), '  - <del>[日本語](./%E6%97%A5%E6%9C%AC%E8%AA%9E.md)</del><b>テスト</b> [#English](./English.md)');
});

// // FIXME closing `]` not found
// test('error', t => {
//   t.is(sb2md('[* [日本語]'), '<b>[日本語</b>');
// });

test('image', t => {
  t.is(sb2md('[https://gyazo.com/b50a9bd54b16d3b1924043648ddca7d2]'), '[![https://gyazo.com/b50a9bd54b16d3b1924043648ddca7d2/thumb/250](https://gyazo.com/b50a9bd54b16d3b1924043648ddca7d2/thumb/250)](https://gyazo.com/b50a9bd54b16d3b1924043648ddca7d2)');
});
