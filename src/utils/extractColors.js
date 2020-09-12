import html2canvas from 'html2canvas';
import * as Vibrant from 'node-vibrant';

export default async function() {
  try {
    const paletteFromSession = JSON.parse(sessionStorage.getItem('color-palettes'));

    if (paletteFromSession) return paletteFromSession || [];

    const canvas = await html2canvas(document.body, { scale: 0.5 });
    const base64Img = canvas.toDataURL();
    const image = new Image(canvas.width, canvas.height);
    image.src = base64Img;

    const vibrant = new Vibrant(image);
    const palette = await vibrant.getPalette();
    const values = Object.values(palette);
    const colors = values.map(({ hex, titleTextColor }) => ({
      hex,
      title: titleTextColor,
    }));

    sessionStorage.setItem('color-palettes', JSON.stringify(colors));

    return colors;
  } catch (err) {
    // Do nothing
  }
}
