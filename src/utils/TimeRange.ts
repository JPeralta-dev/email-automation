export function isWithinTimeRange(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const totalMinutes = hours * 60 + minutes;

  const morningStart = 5 * 60 + 45;
  const morningEnd = 8 * 60 + 50;

  const afternoonStart = 16 * 60 + 20;
  const afternoonEnd = 18 * 60 + 50;

  return (
    (totalMinutes >= morningStart && totalMinutes <= morningEnd) ||
    (totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd)
  );
}
