export const createPagination = (
  page: number,
  limit: number,
  totalCount: number,
  resourceName: string,
) => {
  return {
    currentPage: page,
    limit,
    totalPage: Math.ceil(totalCount / limit),
    ['total' + resourceName]: totalCount,
    hasNext: page < Math.ceil(Math.ceil(totalCount / limit) / limit),
    hasPrevious: page > 1,
  };
};

export function toJalaliDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tehran',
  }).format(date);
}
