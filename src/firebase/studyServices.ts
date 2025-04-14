export function calculateStudyProgress(minsStudied: number, totalMins: number): number {
  return Math.round((minsStudied / totalMins) * 100);
}
