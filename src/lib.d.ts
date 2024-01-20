declare module 'colorthief' {
  export type RGBColor = [number, number, number];

  export default class ColorThief {
    getColor: (img: HTMLImageElement, quality?: number) => Promise<RGBColor>;
    getPalette: (
      img: HTMLImageElement,
      colorCount?: number,
      quality?: number,
    ) => Promise<RGBColor[]>;
  }
}
