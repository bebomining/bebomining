export const formatNumber = (number, decimal = 2) => {
  const decimalMultiplier = `1e${decimal}`;
  const val = (
    Math.round(number * decimalMultiplier) / decimalMultiplier
  ).toFixed(decimal);
  return number === 0 ? 0 : val;
};
