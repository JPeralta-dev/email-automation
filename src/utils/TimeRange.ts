export function isWithinTimeRange(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const totalMinutes = hours * 60 + minutes;

  const morningStart = 9 * 60 + 50;
  const morningEnd = 10 * 60 + 50;

  const afternoonStart = 17 * 60 + 45;
  const afternoonEnd = 18 * 60 + 50;

  return (
    (totalMinutes >= morningStart && totalMinutes <= morningEnd) ||
    (totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd)
  );
}
