export const timeConvert = (n) => {
  const num = Number(n);
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours} hour(s) and ${rminutes} minute(s).`;
};

export const timeConvert2Deci = (n) => {
  const num = Number(n);
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours}.${rminutes}`;
};
