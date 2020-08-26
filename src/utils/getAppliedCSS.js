const extractCSS = (cssText) => {
  const stylesArr = cssText.split(';').map((str) => {
    if (str === '') return;
    const [key, value] = str.split(':');
    
    return {
      key: key.trim(),
      value: value.trim(),
    };
  });
  stylesArr.pop();
  
  return stylesArr;
};

const removeDuplicate = arr => {
  const seen = new Set();

  return arr.filter(({ key }) => {
    const duplicate = seen.has(key);
    seen.add(key);

    return !duplicate;
  });
};

const extractInlineStyles = el => {
  const removeWhitespace = (str) => str && str.replace(/\s/g, '');
  const styleAttribute = el.getAttribute('style');

  if (!styleAttribute) return [];

  const styles = styleAttribute.split(';').map(str => {
    const [key, value] = str.split(':');

    return {
      key: removeWhitespace(key),
      value: removeWhitespace(value),
    };
  });

  return styles.filter(({ key, value }) => key !== '' && value !== '');
};

export default function(el) {
  const sheets = Array.from(document.styleSheets);
  const result = { css: [], hover: [] };

  el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;

  sheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.rules || sheet.cssRules);
      const filteredRules = rules.filter(rule => el.matches(rule.selectorText));

      filteredRules.forEach(({ style, selectorText }) => {
        if (/\:\:before|\:\:after|\*/g.test(selectorText)) return;
        if (/\:hover/g.test(selectorText)) {
          result.hover = result.hover.concat(extractCSS(style.cssText));

          return;
        }

        result.css = result.css.concat(extractCSS(style.cssText));
      });
    } catch (err) {
      // Do nothing
    }
  });

  result.css = extractInlineStyles(el).concat(result.css);

  return {
    css: removeDuplicate(result.css),
    hover: removeDuplicate(result.hover),
  };
}
