import { Response } from 'express';

export const sendSuccessResponse = (res: Response, message: string = 'Success', statusCode: number = 200, data?: any,) => {
  res.status(statusCode).json({
    status: 'success',
    statusCode,
    message,
    data,
  });
};

export const sendErrorResponse = (res: Response, message: string, statusCode: number = 400) => {
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
