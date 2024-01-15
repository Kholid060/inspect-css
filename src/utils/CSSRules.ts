import * as specificity from 'specificity';
import {
  ElementAppliedCSS,
  ElementCSSRule,
  ElementMediaCSSRule,
  getAppliedCSSProperties,
  parseCSSStyleRule,
} from './css-rule-parser';
import type { SetRequired } from 'type-fest';

class CSSRules {
  private initialized = false;

  rules: (CSSMediaRule | CSSStyleRule)[];

  constructor() {
    this.rules = [];
  }

  init() {
    if (this.initialized) return;

    for (const styleSheet of document.styleSheets) {
      try {
        if (styleSheet.disabled) continue;

        for (const rule of styleSheet.cssRules) {
          if (!(rule instanceof CSSStyleRule || rule instanceof CSSMediaRule))
            continue;

          this.rules.push(rule);
        }
      } catch (error) {
        // 3rd-party CSS;
        console.error(error);
      }
    }

    this.initialized = true;
  }

  getElementRules(element: Element) {
    const rules: ElementCSSRule[] = [];

    const mediaRules: ElementMediaCSSRule[] = [];
    const mediaIndexMap = new Map<string, number>();

    for (const rule of this.rules) {
      const result = parseCSSStyleRule(element, rule);

      if (result.mediaCondition) {
        if (result.rules.length <= 0) continue;

        const mediaIndex = mediaIndexMap.get(result.mediaCondition);
        if (typeof mediaIndex === 'number') {
          mediaRules[mediaIndex].rules.push(...result.rules);
        } else {
          mediaRules.push(result);
        }

        mediaIndexMap.set(result.mediaCondition, mediaRules.length - 1);
      } else {
        rules.push(...result.rules);
      }
    }

    const sortedRules = rules.sort((a, b) =>
      specificity.compareDesc(
        specificity.calculate(a.selector),
        specificity.calculate(b.selector),
      ),
    );
    const mainRules = getAppliedCSSProperties(sortedRules);

    const appliedMediaCSS = mediaRules.map((mediaRule) => {
      const sortedMediaRules = mediaRule.rules.sort((a, b) =>
        specificity.compareDesc(
          specificity.calculate(a.selector),
          specificity.calculate(b.selector),
        ),
      );

      return getAppliedCSSProperties(
        sortedMediaRules,
        mediaRule.mediaCondition,
      ) as SetRequired<ElementAppliedCSS, 'mediaCondition'>;
    });

    return {
      ...mainRules,
      media: appliedMediaCSS,
    };
  }
}

export default CSSRules;
