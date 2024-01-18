import { ElementAppliedStyleRules } from './CSSRulesUtils';
import { wrapInParenthesis } from './helper';

function replaceAllStyleValue(
  css: string,
  replacement: string | ((key: string, value: string) => string),
) {
  let updatedCSS = '';

  for (const property of css.split(';')) {
    if (!property.trim()) continue;

    const [key, value] = property.split(/:\s*([^;]+)/);
    const newProperty =
      typeof replacement === 'string'
        ? replacement
        : replacement(key.trim(), value);
    if (!newProperty) continue;

    updatedCSS += newProperty + '\n';
  }

  return updatedCSS;
}

export function resetAppliedStyleValue(style: ElementAppliedStyleRules) {
  const copyStyle = structuredClone(style);
  const replaceValue = (key: string) => {
    if (key.startsWith('--')) return '';

    return `${key}: initial !important;`;
  };

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

  const addImportantRule = (cssStr: string) => {
    return replaceAllStyleValue(cssStr, (key, value) => {
      if (!key || !value) return `${key || ''}${value || ''}`;
      if (value.includes('!important') || key.startsWith('--'))
        return `${key}: ${value};`;

      return `${key}: ${value} !important;`;
    });
  };

  css += `${selector} {
    ${initialStyle.cssText}

    ${addImportantRule(style.cssText)}
  }\n`;

  style.media.forEach((media, index) => {
    const pseudoMediaCSS = media.pseudo
      .map(
        (pseudo, pseudoIdx) =>
          `${selector}${pseudo.pseudo} {
            ${initialStyle.media[index]?.pseudo[pseudoIdx]?.cssText || ''}
            ${addImportantRule(pseudo.cssText)}
        }`,
      )
      .join('\n');

    css += `@media ${wrapInParenthesis(media.mediaCondition)} {
      ${selector} {
        ${initialStyle.media[index]?.cssText || ''}

        ${addImportantRule(media.cssText)}
        
        ${pseudoMediaCSS}
      }
    }\n`;
  });

  css += style.pseudo
    .map(
      (pseudo, pseudoIdx) =>
        `${selector}${pseudo.pseudo} {
        ${initialStyle.pseudo[pseudoIdx]?.cssText || ''}
        ${addImportantRule(pseudo.cssText)}
    }`,
    )
    .join('\n');

  return css;
}
