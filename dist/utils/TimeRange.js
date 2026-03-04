export function isWithinTimeRange(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const morningStart = 9 * 60 + 50;
    const morningEnd = 10 * 60 + 50;
    const afternoonStart = 14 * 60 + 20;
    const afternoonEnd = 17 * 60 + 30;
    return ((totalMinutes >= morningStart && totalMinutes <= morningEnd) ||
        (totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd));
}
