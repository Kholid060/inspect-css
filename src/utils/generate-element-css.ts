import { ElementAppliedStyleRules } from './CSSRulesUtils';
import { wrapInParenthesis } from './helper';

function replaceAllStyleValue(
  css: string,
  value: string | ((match: string, ...rest: string[]) => string),
) {
  return css.replace(/:\s*([^;]+);/g, (match, ...rest) => {
    if (typeof value === 'function') return value(match, ...rest);

    return value;
  });
}

export function resetAppliedStyleValue(style: ElementAppliedStyleRules) {
  const copyStyle = structuredClone(style);
  const replaceValue = ': initial !important;';

  copyStyle.cssText = replaceAllStyleValue(copyStyle.cssText, replaceValue);
  copyStyle.media = copyStyle.media.map((media) => ({
    ...media,
    cssText: replaceAllStyleValue(media.cssText, replaceValue),
    pseudo: media.pseudo.map((pseudo) => ({
      ...pseudo,
      cssText: replaceAllStyleValue(pseudo.cssText, replaceValue),
    })),
  }));
  copyStyle.pseudo = copyStyle.pseudo.map((pseudo) => ({
    ...pseudo,
    cssText: replaceAllStyleValue(pseudo.cssText, replaceValue),
  }));

  return copyStyle;
}

export function generateElementCSS({
  style,
  selector,
  initialStyle,
}: {
  selector: string;
  style: ElementAppliedStyleRules;
  initialStyle: ElementAppliedStyleRules;
}) {
  let css = '';

  const addImportantRule = (cssStr: string) =>
    replaceAllStyleValue(cssStr, (match) => {
      if (match.includes('!important')) return match;

      return match.replace(/;$/, ' !important;');
    });

  css += `${selector} {
    ${initialStyle.cssText}\n\n
    ${addImportantRule(style.cssText)}
  }\n`;

  style.media.forEach((media, index) => {
    css += `@screen ${wrapInParenthesis(media.mediaCondition)} {
      ${selector} {
        ${initialStyle.media[index]?.cssText || ''}\n\n
        ${addImportantRule(media.cssText)}
      }
    }\n`;
  });

  return css;
}
