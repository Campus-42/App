export const DateFuncs = {
  getToday: function () {
    const date = new Date();
    const today = date;

    return today;
  },
  getFutureDateInMonths: function (step = Number) {
    const date = new Date();
    const current = date.getMonth();
    date.setMonth(current + step);

    return date;
  },
  getMonthName: function (monthNum = Number) {
    return months[monthNum];
  },
  getTimeInterval: function (start = new Date(), end = new Date()) {
    const sHr = ('0' + start.getHours()).slice(-2);
    const sMin = ('0' + start.getMinutes()).slice(-2);
    const eHr = ('0' + end.getHours()).slice(-2);
    const eMin = ('0' + end.getMinutes()).slice(-2);

    return `${sHr}:${sMin} - ${eHr}:${eMin}`;
  },
  getFutureDateMSInMinutes: async function (
    minutes = 15,
    startDate = new Date(),
  ) {
    const date = new Date(startDate);
    date.setMinutes(date.getMinutes() + minutes);
    return date.getTime();
  },
  getFutureDateMSInDays: async function (days = 14, date = new Date()) {
    date.setDate(date.getDate() + days);
    return date.getTime();
  },
  getWeekday: async function (date) {
    return new Date(date).toString().substring(0, 3);
  },
  getEventDateString: async function (eventDate) {
    const date = new Date(eventDate);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const twoDays = new Date();
    twoDays.setDate(twoDays.getDate() + 2);
    twoDays.setHours(0, 0, 0, 0);

    if (date.getTime() < tomorrow.getTime()) return 'Today';
    else if (date.getTime() < twoDays.getTime()) return 'Tomorrow';
    else return "Don't know";
  },
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
