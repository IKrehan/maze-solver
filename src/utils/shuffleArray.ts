export default (array: any[]) =>
  array.sort(() => (Math.random() > .5) ? 1 : -1);
