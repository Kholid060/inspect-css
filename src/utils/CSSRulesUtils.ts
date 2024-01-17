import * as specificity from 'specificity';
import {
  ElementAppliedCSS,
  ElementCSSRule,
  ElementMediaCSSRule,
  getAppliedCSSProperties,
  parseCSSStyleRule,
} from './css-rule-parser';
import type { SetRequired } from 'type-fest';

const MAX_RULES_CACHE_MS = 60_000; // 1 minute

export interface ElementAppliedStyleRules extends ElementAppliedCSS {
  media: SetRequired<ElementAppliedCSS, 'mediaCondition'>[];
}

class CSSRulesUtils {
  private lastRetrievedRules: null | number = null;
  private _rules: (CSSMediaRule | CSSStyleRule)[] = [];

  constructor() {}

  get rules() {
    if (
      !this.lastRetrievedRules ||
      Date.now() - this.lastRetrievedRules < MAX_RULES_CACHE_MS
    ) {
      this._rules = [];

      for (const styleSheet of document.styleSheets) {
        try {
          if (
            styleSheet.disabled ||
            (styleSheet.ownerNode instanceof HTMLElement &&
              styleSheet.ownerNode.id === 'inspect-css-style')
          )
            continue;

          for (const rule of styleSheet.cssRules) {
            if (!(rule instanceof CSSStyleRule || rule instanceof CSSMediaRule))
              continue;

            this._rules.push(rule);
          }
        } catch (error) {
          // 3rd-party CSS;
          console.error(error);
        }
      }

      this.lastRetrievedRules = Date.now();
    }

    return this._rules;
  }

  getAppliedRules(element: Element): ElementAppliedStyleRules {
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
      media: appliedMediaCSS.reverse(),
    };
  }

  destroy() {
    this._rules = [];
  }
}

export default CSSRulesUtils;
