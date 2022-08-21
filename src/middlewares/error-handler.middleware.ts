import {StatusCodes} from 'http-status-codes'; 
import { Response, Request, NextFunction, json, response } from 'express';
import { CustomError } from '../errors';

const customErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof CustomError) {
    console.error(`[-] ${err.message}`); 
    let response = {
      success: false,
      message: err.message,
    }
    return res
      .status(err.status)
      .json(response); 
  }
  let jsonResponse = {
    success: false, 
    message: 'Unidentified Error',
  }; 
  return res
    .status(500)
    .json(jsonResponse);
}

export default customErrorHandler; 