export const isISOString = (val: string) => {
  const d = new Date(val);
  // Check if date is valid AND if the original string matches the standard toISOString() output
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};