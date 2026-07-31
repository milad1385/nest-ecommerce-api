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
