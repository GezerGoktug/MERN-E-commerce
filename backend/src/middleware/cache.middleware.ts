import { NextFunction, Request, Response } from "express";

import ResponseHandler from "../util/response";
import CacheManager from "../cache/cache";

type VariablesKeysType = "params" | "query" | "body";

//! Create cache key use to dynamic variables (params , body data , queries)

const generateCacheKey = (
  req: Request,
  variablesMap: Map<VariablesKeysType, string[][]>
) => {
  const variablesKeys = ["params", "query", "body"] as VariablesKeysType[];

  const dynamicParams = variablesKeys
    .map((key: VariablesKeysType, i) => {
      const arr: (string | null)[] = [];
      variablesMap.get(key)?.forEach(([pathKey, value]) => {
        arr.push(req[key][pathKey] ? `${value}_${req[key][pathKey]}` : null);
      });
      return arr;
    })
    .flat(1)
    .filter((item) => item !== null);

  const dynamicKey = dynamicParams.join(":");

  return dynamicKey;
};



export const createDynamicVariables = (
  params: (string[] | string)[] = [],
  query: (string[] | string)[] = [],
  body: (string[] | string)[] = []
) => {
  const variablesMap = new Map<VariablesKeysType, string[][]>();

  variablesMap.set(
    "params",
    params.map((param) => (typeof param === "string" ? [param, param] : param))
  );
  variablesMap.set(
    "query",
    query.map((qry) => (typeof qry === "string" ? [qry, qry] : qry))
  );
  variablesMap.set(
    "body",
    body.map((bdy) => (typeof bdy === "string" ? [bdy, bdy] : bdy))
  );

  return variablesMap;
};

//! GET CACHE MIDDLEWARE

export const cacheable = (
  cacheKey: string,
  dynamicKeys: Map<VariablesKeysType, string[][]>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cached = await CacheManager.get(
      `${cacheKey}:${generateCacheKey(req, dynamicKeys)}`
    );

    if (cached) {
      ResponseHandler.success(res, 200, cached);
      return;
    }
    next();
  };
};

//! DELETE , UPDATE ,SET CACHE UTILS FUNCTIONS

export const setCache = async <T>(
  req: Request,
  cacheKey: string,
  data: T,
  dynamicKeys: Map<VariablesKeysType, string[][]>,
  ttl?: number
) => {
  const key = `${cacheKey}:${generateCacheKey(req, dynamicKeys)}`;

  await CacheManager.set(key, data, ttl);
};

export const cacheEvict = async <T>(
  req: Request,
  cacheKey: string,
  dynamicKeys: Map<VariablesKeysType, string[][]>
) => {
  const key = `${cacheKey}:${generateCacheKey(req, dynamicKeys)}`;

  await CacheManager.del(key);
};

export const updateCache = async <T>(
  req: Request,
  cacheKey: string,
  newData: T,
  dynamicKeys: Map<VariablesKeysType, string[][]>,
  ttl?: number
) => {
  const key = `${cacheKey}:${generateCacheKey(req, dynamicKeys)}`;

  const cached = await CacheManager.get(key);

  await CacheManager.set(key, { ...cached, ...newData }, ttl);
};
