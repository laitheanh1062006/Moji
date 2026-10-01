import test from 'node:test';
import assert from 'node:assert/strict';

import { validateMessagePayload } from '../src/utils/messageHelper.js';

test('accepts message with image even when content is empty', () => {
  assert.doesNotThrow(() => {
    validateMessagePayload({
      content: '',
      imgUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    });
  });
});

test('rejects empty message with no image', () => {
  assert.throws(() => {
    validateMessagePayload({ content: '   ', imgUrl: '' });
  }, /at least one/i);
});
