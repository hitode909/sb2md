import test from 'ava';
import { convert } from 'lib/convert';

test('indent', t => {
    t.is(convert(' a'), '  - a');
});
