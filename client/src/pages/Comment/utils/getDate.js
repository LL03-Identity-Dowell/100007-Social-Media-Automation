export function getDate(date) {
  const newDate = new Date(date);
  const newUpdatedLocalTime = newDate.toLocaleString();
  return newUpdatedLocalTime;
}
