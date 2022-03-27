export default (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (1 + max - min));
};
