/* Hand-written tokenizers for CSS tokens that can't be
   expressed by Lezer's built-in tokenizer. */

import { ExternalTokenizer } from '@lezer/lr';
import {
  callee,
  identifier,
  VariableName,
  descendantOp,
  Unit,
} from './parser.terms.js';

const space = [
  9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
  8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
];
const colon = 58,
  parenL = 40,
  underscore = 95,
  bracketL = 91,
  dash = 45,
  period = 46,
  hash = 35,
  percent = 37,
  ampersand = 38,
  backslash = 92,
  newline = 10;

function isAlpha(ch) {
  return (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || ch >= 161;
}

function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}

export const identifiers = new ExternalTokenizer((input, stack) => {
  for (let inside = false, dashes = 0, i = 0; ; i++) {
    let { next } = input;
    if (
      isAlpha(next) ||
      next == dash ||
      next == underscore ||
      (inside && isDigit(next))
    ) {
      if (!inside && (next != dash || i > 0)) inside = true;
      if (dashes === i && next == dash) dashes++;
      input.advance();
    } else if (next == backslash && input.peek(1) != newline) {
      input.advance();
      if (input.next > -1) input.advance();
      inside = true;
    } else {
      if (inside)
        input.acceptToken(
          next == parenL
            ? callee
            : dashes == 2 && stack.canShift(VariableName)
              ? VariableName
              : identifier,
        );
      break;
    }
  }
});

export const descendant = new ExternalTokenizer((input) => {
  if (space.includes(input.peek(-1))) {
    let { next } = input;
    if (
      isAlpha(next) ||
      next == underscore ||
      next == hash ||
      next == period ||
      next == bracketL ||
      (next == colon && isAlpha(input.peek(1))) ||
      next == dash ||
      next == ampersand
    )
      input.acceptToken(descendantOp);
  }
});

export const unitToken = new ExternalTokenizer((input) => {
  if (!space.includes(input.peek(-1))) {
    let { next } = input;
    if (next == percent) {
      input.advance();
      input.acceptToken(Unit);
    }
    if (isAlpha(next)) {
      do {
        input.advance();
      } while (isAlpha(input.next));
      input.acceptToken(Unit);
    }
  }
});
