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

  return filteredCssArray.map(cssStr => cssStr.trim()).join(';\n');
}

function getNumber(text) {
  const number = +text.replace(/\D/g, '');

  return number;
}

function filterRules(element, rules) {
  const filteredRules = rules.filter(({ selectorText }) => element.matches(selectorText));

  return filteredRules;
}

class GetAppliedCSS {
  constructor(el) {
    el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
    this.element = el;
  }

  get rules() {
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

    return rules;
  }

  all() {
    const { css: mediaCSS, hover: mediaHover } = this.mediaQueryCSS();
    const { css: styleCSS, hover: styleHover } = this.css();
    const inlineCSS = this.inlineCSS();

    const css = removeDuplicateCSS(inlineCSS + mediaCSS + styleCSS);
    const hover = removeDuplicateCSS(mediaHover + styleHover);

    return { css, hover };
  }

  inlineCSS() {
    const styleAttribute = this.element.getAttribute('style');

    if (!styleAttribute) return '';

    return styleAttribute.endsWith(';') ? styleAttribute : `${styleAttribute};`;
  }

  mediaQueryCSS() {
    const mediaQueries = this.rules.filter(({ conditionText, media }) => {
      return media && window.matchMedia(conditionText).matches && getNumber(conditionText);
    });
    const mediaQueriesSorted = mediaQueries.sort((a, b) => {
      const aMedia = getNumber(a.conditionText);
      const bMedia = getNumber(b.conditionText);

      if (aMedia > bMedia) return -1;
      if (bMedia > aMedia) return 1;

      return 0;
    });

    const cssRules = mediaQueriesSorted.reduce(
      (result, media) => {
        if (media.cssRules) {
          const filteredRules = filterRules(this.element, Array.from(media.cssRules));
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

  css() {
    const filteredRules = filterRules(this.element, this.rules);
    const result = extractCSS(filteredRules);

    return result;
  }
}

export default GetAppliedCSS;
