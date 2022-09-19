import { NextFunction, Request, Response, Router } from "express";

export interface IServerController {
    router: Router;
}