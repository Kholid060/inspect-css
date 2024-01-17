const CSS_PSEUDO = [
  ':active',
  ':checked',
  ':disabled',
  ':empty',
  ':enabled',
  ':focus',
  ':hover',
  ':invalid',
  ':valid',
  ':visited',
  ':first-letter',
  ':first-line',
  ':marker',
  ':selection',
] as const;

const CSS_PSEUDO_REGEX = new RegExp(':?' + CSS_PSEUDO.join('|'));

export interface ElementStyleProperty {
  key: string;
  value: string;
  isImportant: boolean;
}

export interface ElementCSSRule {
  cssText: string;
  selector: string;
  isPseudo: boolean;
  properties: ElementStyleProperty[];
}

export interface ElementMediaCSSRule {
  rules: ElementCSSRule[];
  mediaCondition?: string;
}

export interface ElementAppliedCSS {
  cssText: string;
  mediaCondition?: string;
  pseudo: { selector: string; cssText: string }[];
}

const extractCSSText = (cssText: string) =>
  cssText.slice(cssText.indexOf('{') + 1, -1).trim();

function cssTextToObject(cssText: string) {
  const properties: ElementStyleProperty[] = [];

  for (const property of cssText.split(';')) {
    const trimmedProperty = property.trim();
    if (!trimmedProperty) continue;

    const [key, value] = trimmedProperty.split(/:(.*)/s);

    properties.push({
      key,
      value,
      isImportant: value.trim().endsWith('!important'),
    });
  }

  return properties;
}

export function getAppliedCSSProperties(
  rules: ElementCSSRule[],
  mediaCondition?: string,
): ElementAppliedCSS {
  const pseudo: ElementAppliedCSS['pseudo'] = [];
  const mainProperties = new Map<
    string,
    { value: string; isImportant: boolean }
  >();

  for (const rule of rules) {
    if (rule.isPseudo) {
      pseudo.push({ cssText: rule.cssText, selector: rule.selector });
      continue;
    }

    for (const { isImportant, key, value } of rule.properties) {
      const property = mainProperties.get(key);
      if (property) {
        if (isImportant) {
          mainProperties.set(key, { isImportant, value });
        }

        continue;
      }

      mainProperties.set(key, { isImportant, value });
    }
  }

  const mainCSSText = [...mainProperties.entries()].reduce<string>(
    (acc, [key, { value }]) => {
      acc += `${key}:${value};\n`;

      return acc;
    },
    '',
  );

  return {
    pseudo,
    mediaCondition,
    cssText: mainCSSText.trim(),
  };
}

export function parseCSSStyleRule(
  element: Element,
  rule: CSSMediaRule | CSSStyleRule,
) {
  const result: ElementMediaCSSRule = {
    rules: [],
  };

  const pushRule = (
    styleRule: CSSStyleRule,
    mediaCondition: string | null = null,
  ) => {
    let isPseudo = false;

    const selector = styleRule.selectorText.split(',').find((str) => {
      const normalizeSelector = str.trim().replace(CSS_PSEUDO_REGEX, () => {
        isPseudo = true;
        return '';
      });

      try {
        return element.matches(normalizeSelector);
      } catch (error) {
        return false;
      }
    });

    if (!selector || (mediaCondition && !window.matchMedia(mediaCondition)))
      return;

    const extractedCSSText = extractCSSText(styleRule.cssText).trim();

    result.rules.push({
      isPseudo,
      selector: selector.trim(),
      cssText: extractedCSSText,
      properties: cssTextToObject(extractedCSSText),
    });
  };

  if (rule instanceof CSSStyleRule) {
    pushRule(rule);
  } else {
    [...rule.cssRules].forEach((styleRule) => {
      if (!(styleRule instanceof CSSStyleRule)) return;

      pushRule(styleRule, rule.conditionText);
    });
    result.mediaCondition = rule.conditionText;
  }

  return result;
}
