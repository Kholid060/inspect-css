import { StyleDataItem } from '../pages/content/ui/app-plugin';
import { ElementAppliedCSS, ElementAppliedPseudoCSS } from './css-rule-parser';
import { AnimationKeyframeRule } from './CSSRulesUtils';

function applyRulesWhitespace(cssText: string, space = '  ') {
  return cssText
    .split('\n')
    .map((line) => `${space}${line}`)
    .join('\n');
}

function extractPseudoCSS(
  selector: string,
  style: ElementAppliedPseudoCSS[],
  space = '  ',
) {
  let cssText = '';
  const baseSpace = space.slice(2);

  style.forEach((item) => {
    if (!item.isDirty) return;

    cssText += `${baseSpace}${selector}${item.pseudo} {\n${applyRulesWhitespace(
      item.cssText,
      space,
    )}\n${baseSpace}}\n`;
  });

  return cssText;
}
function extractAnimationCSS(
  animations: AnimationKeyframeRule[],
  space = '  ',
) {
  const animation = animations.reduce<AnimationKeyframeRule | null>(
    (acc, curr) => {
      return curr.isDirty ? curr : acc;
    },
    null,
  );
  if (!animation) return '';

  const baseSpace = space.slice(2);

  return `${baseSpace}@keyframes zoomInDown {\n${applyRulesWhitespace(
    animation.cssText,
    space,
  )}\n${baseSpace}}`;
}

function extractAppliedCSS(
  selector: string,
  style: ElementAppliedCSS,
  space = '  ',
) {
  const baseSpace = space.slice(2);
  return {
    main: style.isDirty
      ? `${baseSpace}${selector} {\n${applyRulesWhitespace(
          style.cssText,
          space,
        )}\n${baseSpace}}\n`
      : '',
    pseudo: extractPseudoCSS(selector, style.pseudo, space + '  '),
    animation: extractAnimationCSS(style.animation, space + '  '),
  };
}

export function getAppliedCSS(items: StyleDataItem[]) {
  let mainCssText = '';
  let mediaCssText = '';

  const mediaRules: Record<
    string,
    (ElementAppliedCSS & { selector: string })[]
  > = {};

  for (const item of items) {
    item.currentProps.media.forEach((mediaRule) => {
      if (!mediaRules[mediaRule.mediaCondition]) {
        mediaRules[mediaRule.mediaCondition] = [];
      }

      mediaRules[mediaRule.mediaCondition].push({
        ...mediaRule,
        selector: item.elSelector,
      });
    });

    const extractedCSS = extractAppliedCSS(item.elSelector, item.currentProps);
    mainCssText +=
      extractedCSS.main + extractedCSS.pseudo + extractedCSS.animation;
  }

  for (const rule in mediaRules) {
    const cssText = mediaRules[rule].reduce((acc, curr) => {
      const extractedCSS = extractAppliedCSS(curr.selector, curr, '    ');
      acc += extractedCSS.main + extractedCSS.pseudo + extractedCSS.animation;

      return acc;
    }, '');
    if (!cssText.trim()) continue;

    mediaCssText += `@media ${rule} {\n${cssText.trimEnd()}\n}\n`;
  }

  return `${mainCssText}\n\n${mediaCssText}`;
}
