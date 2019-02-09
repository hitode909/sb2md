import test from 'ava';
import { sb2md } from 'lib/sb2md';

test('indent', t => {
    t.is(sb2md(' a'), '  - a');
});
