import ColorThief, { RGBColor } from 'colorthief';

/* eslint-disable radix */
function getTextColor(rgb: RGBColor) {
  const brightness = Math.round(
    (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000,
  );
  const textColor = brightness > 125 ? 'black' : 'white';

  return textColor;
}
function convertToHex(rgb: RGBColor) {
  const color = rgb
    .map((num) => {
      const hex = num.toString(16);

      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join('');

  return `#${color}`;
}

export default async function (image: HTMLImageElement) {
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
