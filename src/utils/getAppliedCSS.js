const getNumber = text => +text.replace(/\D/g, '');
const addNewLine = cssText => cssText.replace(/;\s|;/g, ';\n');

function extractCSS(rules) {
  const result = { css: '', hover: '' };

  rules.forEach(({ selectorText, style }) => {
    if (/\:\:before|\:\:after|\*/g.test(selectorText)) return;
    if (/\:hover/g.test(selectorText)) {
      result.hover += style.cssText;

      return;
    }

    result.css += style.cssText;
  });

  return result;
}

function removeDuplicateCSS(css) {
  const seen = new Set();
  const cssArray = css.split(';');
  const filteredCssArray = cssArray.filter(property => {
    if (property === '') return;

    const [key] = property.split(':');
    const duplicate = seen.has(key.trim());

    seen.add(key.trim());

    return !duplicate;
  });

  return filteredCssArray.map(css => css.trim()).join(';\n');
}

function getInlineCSS(el) {
  const styleAttribute = el.getAttribute('style');

  if (!styleAttribute) return '';

  return styleAttribute.endsWith(';') ? styleAttribute : styleAttribute + ';';
}

function getCSSFromMediaQuery(el, rules) {
  const mediaQueries = rules.filter(({ conditionText, media }) => {
    return media && window.matchMedia(conditionText).matches && getNumber(conditionText);
  });
  const mediaQueriesSorted = mediaQueries.sort((a, b) => {
    const aMedia = getNumber(a.conditionText);
    const bMedia = getNumber(b.conditionText);

    if (aMedia > bMedia) return -1;
    else if (bMedia > aMedia) return 1;

    return 0;
  });
  const cssRules = mediaQueriesSorted.reduce(
    (result, media) => {
      if (media.cssRules) {
        const filteredRules = Array.from(media.cssRules).filter(rule => {
          return el.matches(rule.selectorText);
        });
        const { css, hover } = extractCSS(filteredRules);

        result.css += css;
        result.hover += hover;

        return result;
      }

      return result;
    },
    { css: '', hover: '' }
  );

  return cssRules;
}

function getCSS(el, rules) {
  const filteredRules = rules.filter(rule => el.matches(rule.selectorText));
  const result = extractCSS(filteredRules);

  return result;
}

function getAllCSS(el, rules) {
  const { css: mediaCSS, hover: mediaHover } = getCSSFromMediaQuery(el, rules);
  const { css, hover } = getCSS(el, rules);
  const inlineCSS = getInlineCSS(el);

  return {
    css: inlineCSS + mediaCSS + css,
    hover: mediaHover + hover,
  };
}

export default function(el) {
  el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;

  const slice = Function.call.bind(Array.prototype.slice);
  const rules = Array.from(document.styleSheets).reduce((rules, sheet) => {
    try {
      if (sheet.cssRules) {
        return rules.concat(slice(sheet.cssRules));
      }
    } catch (err) {
      return rules;
    }
  }, []);

  const { css, hover } = getAllCSS(el, rules);

  const result = {
    css: removeDuplicateCSS(css),
    hover: removeDuplicateCSS(hover),
  };

  return result;
}
