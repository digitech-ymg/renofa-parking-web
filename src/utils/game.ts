export const isOffSeason = (date1: Date, date2: Date): boolean => {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  const diffInDays = diff / (1000 * 60 * 60 * 24);

  if (diffInDays >= 30) {
    return true;
  }
  return false;
};
