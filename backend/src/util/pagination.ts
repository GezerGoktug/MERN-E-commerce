export const pageableToResponse = <T>(
  totalItems: number,
  page: number,
  data: T[]
) => {
  return {
    totalPage: Math.ceil(totalItems / 15),
    pageSize: data.length,
    current: page + 1,
    hasNext: !(page + 1 >= Math.ceil(totalItems / 15)),
    hasPrev: page !== 0,
    content: data,
  };
};
