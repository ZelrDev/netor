function combineDateWithTime(d: Date, t: Date) {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    t.getHours(),
    t.getMinutes(),
    t.getSeconds(),
    t.getMilliseconds()
  );
}

export const calculatePunishmentButtonsTimeout = (
  activeTab: number,
  customDate?: Date,
  customTime?: Date
) => {
  let punishmentMS = Date.now();

  switch (activeTab) {
    case 0:
      punishmentMS = Date.now() + 60000;
      break;
    case 1:
      punishmentMS = Date.now() + 300000;
      break;
    case 2:
      punishmentMS = Date.now() + 600000;
      break;
    case 3:
      punishmentMS = Date.now() + 3.6e6;
      break;
    case 4:
      punishmentMS = Date.now() + 8.64e7;
      break;
    case 5:
      punishmentMS = Date.now() + 6.048e8;
      break;
    case 6:
      const date = combineDateWithTime(customDate!, customTime!);
      punishmentMS = date.valueOf();
      break;
    default:
      punishmentMS = Date.now();
  }
  return punishmentMS;
};
