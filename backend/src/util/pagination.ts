import { Request } from "express";
import { paginationRequestSchema } from "../validations/schema";

export const pageableToResponse = <T>(
  totalItems: number,
  page: number,
  pageSize: number,
  data: T[]
) => {
  return {
    totalPage: Math.ceil(totalItems / pageSize),
    pageSize: data.length,
    current: page + 1,
    hasNext: !(page + 1 >= Math.ceil(totalItems / pageSize)),
    hasPrev: page !== 0,
    content: data,
  };
};

const defaultPaginationFieldNames: Record<PaginationFieldNameType, string> = {
  pageNumber: "page",
  pageSize: "pageSize",
  sortType: "sortType",
  sortField: "sortField",
};

type PaginationFieldNameType =
  | "pageNumber"
  | "pageSize"
  | "sortType"
  | "sortField";

type SortType = "asc" | "desc" | "default";

interface IPaginationRequest {
  pageNumber: number;
  pageSize: number;
  sortType: SortType;
  sortField: string | null;
}

export const PaginationRequest = (
  req: Request,
  defaultPageSize: number = 15
): IPaginationRequest => {
  const validated = paginationRequestSchema.parse({
    page: Number(req.query[defaultPaginationFieldNames.pageNumber]) || 0,
    pageSize:
      Number(req.query[defaultPaginationFieldNames.pageSize]) ||
      defaultPageSize,
    sortType: req.query[defaultPaginationFieldNames.sortType] || "default",
    sortField: req.query[defaultPaginationFieldNames.sortField] || null,
  });

  return {
    pageNumber: validated.page,
    pageSize: validated.pageSize,
    sortType: validated.sortType,
    sortField: validated.sortField,
  };
};
