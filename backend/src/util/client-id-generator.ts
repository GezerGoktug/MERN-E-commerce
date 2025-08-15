import { NextFunction, Request, Response } from "express";
import generateUUIDv4 from "./uuid";
import { ExtendedRequest } from "../types/types";
import { setCookie } from "./cookie";

const defineClientId = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.cookies.browserId) {
        const id = generateUUIDv4();
        setCookie("browserId", id, res, { maxAge: 1000 * 60 * 60 * 24 * 2 });
        req.browserId = id;
    } else {
        req.browserId = req.cookies.browserId;
    }
    next();
}


export default defineClientId;