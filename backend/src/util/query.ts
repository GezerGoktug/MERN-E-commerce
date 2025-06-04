import { Request } from "express";

const filterQuery = (
  req: Request,
  keys: string[],
  initialState: Record<string, string[] | string>
) => {
  const obj: Record<string, string[] | string> = {};

  keys.forEach((key) => {
    if (Array.isArray(req.query[key]) || typeof req.query[key] === "string")
      obj[key] = req.query[key] as string | string[];
    else obj[key] = initialState[key];
  });

  return obj;
};

export default filterQuery;
