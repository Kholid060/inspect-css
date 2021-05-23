import ColorThief from 'colorthief';

/* eslint-disable radix */
function getTextColor(rgb) {
  const brightness = Math.round(((parseInt(rgb[0]) * 299)
    + (parseInt(rgb[1]) * 587)
    + (parseInt(rgb[2]) * 114)) / 1000);
  const textColor = (brightness > 125) ? 'black' : 'white';

  return textColor;
}
function convertToHex(rgb) {
  const color = rgb.map((num) => {
    const hex = num.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
  }).join('');

  return `#${color}`;
}

export default async function (image) {
  try {
    const colorThief = new ColorThief();
    const palette = await colorThief.getPalette(image);
    const colors = palette.map((rgb) => ({
      hex: convertToHex(rgb),
      title: getTextColor(rgb),
    }));

    sessionStorage.setItem('color-palettes', JSON.stringify(colors));

    return colors;
  } catch (err) {
    console.error(err);
  }
}
