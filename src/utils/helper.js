export const generateGetBoundingClientRect = (x = 0, y = 0) => () => ({
  width: 0,
  height: 0,
  top: y,
  right: x,
  bottom: y,
  left: x,
});
