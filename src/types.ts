import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

export default interface ICustomRequest extends Request {
  io?: Server;
}

export type ExpressHandler = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;
