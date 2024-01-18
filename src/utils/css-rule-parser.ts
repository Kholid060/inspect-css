import * as specificity from 'specificity';
import { SetRequired } from 'type-fest';

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

const CSS_PSEUDO_REGEX = new RegExp(`:?(${CSS_PSEUDO.join('|')})$`);

export interface ElementStyleProperty {
  key: string;
  value: string;
  isImportant: boolean;
}

export interface ElementCSSRule {
  pseudo?: string;
  cssText: string;
  selector: string;
  specificity: number;
  properties: ElementStyleProperty[];
}

export interface ElementMediaCSSRule {
  rules: ElementCSSRule[];
  mediaCondition?: string;
}

export interface ElementAppliedCSS {
  cssText: string;
  mediaCondition?: string;
  pseudo: { cssText: string; pseudo: string }[];
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
  element: Element,
  rules: ElementCSSRule[],
  mediaCondition?: string,
): ElementAppliedCSS {
  const pseudo: ElementAppliedCSS['pseudo'] = [];

  type PropertyValue = {
    value: string;
    isImportant: boolean;
    specificity: number;
  };

  const mainProperties = new Map<string, PropertyValue>();
  const pseudoProperties = new Map<string, Record<string, PropertyValue>>();

  const handleMainProps = (rule: ElementCSSRule) => {
    for (const { isImportant, key, value } of rule.properties) {
      const property = mainProperties.get(key);
      if (!property) {
        mainProperties.set(key, {
          isImportant,
          value,
          specificity: rule.specificity,
        });
        continue;
      }

      if (
        isImportant ||
        (!isImportant &&
          !property.isImportant &&
          property.specificity === rule.specificity)
      ) {
        mainProperties.set(key, {
          value,
          isImportant,
          specificity: rule.specificity,
        });
      }
    }
  };
  const handlePseudoProps = (rule: SetRequired<ElementCSSRule, 'pseudo'>) => {
    const pseudoProps = pseudoProperties.get(rule.pseudo);
    if (!pseudoProps) {
      const objProps = rule.properties.reduce<Record<string, PropertyValue>>(
        (acc, curr) => {
          acc[curr.key] = {
            value: curr.value,
            isImportant: curr.isImportant,
            specificity: rule.specificity,
          };

          return acc;
        },
        {},
      );
      pseudoProperties.set(rule.pseudo, objProps);
      return;
    }

    for (const { key, value, isImportant } of rule.properties) {
      const property = pseudoProps[key];

      if (!property) {
        pseudoProps[key] = {
          value,
          isImportant,
          specificity: rule.specificity,
        };
        continue;
      }

      if (
        isImportant ||
        (!isImportant &&
          !property.isImportant &&
          property.specificity === rule.specificity)
      ) {
        pseudoProps[key] = {
          value,
          isImportant,
          specificity: rule.specificity,
        };
      }
    }

    pseudoProperties.set(rule.pseudo, pseudoProps);
  };

  for (const rule of rules) {
    if (rule.pseudo) {
      handlePseudoProps(rule as SetRequired<ElementCSSRule, 'pseudo'>);
    } else {
      handleMainProps(rule);
    }
  }

  const computedStyle = getComputedStyle(element);

  const mainCSSText = [...mainProperties.entries()].reduce<string>(
    (acc, [key, { value }]) => {
      let propertyValue = value;
      if (key.startsWith('--')) {
        propertyValue = computedStyle.getPropertyValue(key);
      }

      acc += `${key}:${propertyValue};\n`;

      return acc;
    },
    '',
  );

  pseudoProperties.forEach((props, key) => {
    let cssText = '';
    for (const key in props) {
      let propertyValue = props[key].value;
      if (key.startsWith('--')) {
        propertyValue = computedStyle.getPropertyValue(key);
      }

      cssText += `${key}:${propertyValue};\n`;
    }

    pseudo.push({ cssText: cssText.trim(), pseudo: key });
  });

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
    let pseudo: string | undefined;

    const selector = styleRule.selectorText.split(',').find((str) => {
      const normalizeSelector = str
        .trim()
        .replace(CSS_PSEUDO_REGEX, (match) => {
          pseudo = match;
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

    const weight = specificity.calculate(selector);
    const weightTotal = +(
      weight.A.toString() +
      weight.B.toString() +
      weight.C.toString()
    );

    result.rules.push({
      pseudo,
      specificity: weightTotal,
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
