import { parser } from './lang-css';
import {
  LRLanguage,
  continuedIndent,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  LanguageSupport,
} from '@codemirror/language';
import { cssCompletionSource } from '@codemirror/lang-css';

/// A language provider based on the [Lezer CSS
/// parser](https://github.com/lezer-parser/css), extended with
/// highlighting and indentation information.
export const cssLanguage = LRLanguage.define({
  name: 'css',
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Declaration: continuedIndent(),
      }),
      foldNodeProp.add({
        'Block KeyframeList': foldInside,
      }),
    ],
  }),
  languageData: {
    commentTokens: { block: { open: '/*', close: '*/' } },
    indentOnInput: /^\s*\}$/,
    wordChars: '-',
  },
});

/// Language support for CSS.
export function css() {
  return new LanguageSupport(
    cssLanguage,
    cssLanguage.data.of({ autocomplete: cssCompletionSource }),
  );
}
