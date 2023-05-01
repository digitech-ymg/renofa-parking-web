export const isOffSeason = (today: Date, nextGameDay: Date): boolean => {
  const diff = nextGameDay.getTime() - today.getTime();
  const diffInDays = diff / (1000 * 60 * 60 * 24);

  return diffInDays < 0 || 30 <= diffInDays;
};
