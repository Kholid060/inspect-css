import { ElementAppliedStyleRules } from './CSSRulesUtils';
import { wrapInParenthesis } from './helper';

function replaceAllStyleValue(
  css: string,
  replacement: string | ((key: string, value: string) => string),
) {
  return css.replace(/\s*([a-zA-Z-]+)\s*:\s*([^;]+)\s*;/g, (match) => {
    const [key, value] = match.split(/:\s*([^;]+)/);
    const newProperty =
      typeof replacement === 'string'
        ? replacement
        : replacement(key.trim(), value);

    return newProperty;
  });
}

export function resetAppliedStyleValue(style: ElementAppliedStyleRules) {
  const copyStyle = structuredClone(style);
  const replaceValue = (key: string) => {
    if (key.startsWith('--')) return '';

    return `${key}: initial !important;\n`;
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
  copyStyle.animation = copyStyle.animation.map((animation) => ({
    ...animation,
    cssText: replaceAllStyleValue(
      animation.cssText,
      (key) => `${key}: initial;\n`,
    ),
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
  const addImportantRule = (cssStr: string) => {
    return replaceAllStyleValue(cssStr, (key, value) => {
      if (!key || !value) return `${key || ''}${value || ''}`;
      if (value.includes('!important') || key.startsWith('--'))
        return `${key}: ${value};\n`;

      return `${key}: ${value} !important;\n`;
    });
  };

  let css = `${selector} {
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

    const mediaCss = `@media ${wrapInParenthesis(media.mediaCondition)} {
      ${selector} {
        ${initialStyle.media[index]?.cssText || ''}

        ${addImportantRule(media.cssText)}
        
        ${pseudoMediaCSS}
      }
    }\n`;

    css = `${css}\n${mediaCss}`;
  });

  const pseudoCSS = style.pseudo
    .map(
      (pseudo, pseudoIdx) =>
        `${selector}${pseudo.pseudo} {
        ${initialStyle.pseudo[pseudoIdx]?.cssText || ''}
        ${addImportantRule(pseudo.cssText)}
    }`,
    )
    .join('\n');
  css = `${css}\n${pseudoCSS}`;

  const animationCSS = style.animation
    .map(
      (animation, index) =>
        `@keyframes ${animation.name} {
          ${initialStyle.animation[index]?.cssText ?? ''}
          
          ${animation.cssText}
        }`,
    )
    .join('\n');
  css = `${css}\n${animationCSS}`;

  return css;
}
