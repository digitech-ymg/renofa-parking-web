export const isOffSeason = (today: Date, nextGameDay: Date): boolean => {
  // 年月日だけを参照して、日時はそろえる
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const gameDate = new Date(
    nextGameDay.getFullYear(),
    nextGameDay.getMonth(),
    nextGameDay.getDate()
  );
  const diff = gameDate.getTime() - todayDate.getTime();
  const diffInDays = diff / (1000 * 60 * 60 * 24);

  return diffInDays < 0 || 30 <= diffInDays;
};
