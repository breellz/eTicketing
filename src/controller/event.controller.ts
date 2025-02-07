import { NextFunction, Request, Response } from 'express';
import { bookEventValidation, createEventValidation } from '../utils/helpers/validators/event-validators';
import AppError from '../utils/helpers/errorHandler';
import { sendErrorResponse, sendSuccessResponse } from '../utils/helpers/responseHandler';
import EventServices from "../services"
import logger from '../utils/helpers/logger';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {

  const { title, description, date, location, availableTickets } = req.body;

  const { error } = createEventValidation({ title, description, date, location, availableTickets });

  if (error) {

    return sendErrorResponse(res, error.message, 400);
  }
  try {

    const event = await EventServices.createEvent({ title, description, date, location, availableTickets });
    //create a log
    logger.info(`Event created: ${event.title} (ID: ${event.id})`);
    return sendSuccessResponse(res, 'Event created successfully', 201, event);
  } catch (error) {
    next(new AppError('Failed to create event', 500));
  }
}

export const getEventStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { eventId } = req.params;
  try {
    const { error } = bookEventValidation({ eventId });

    if (error) {
      return sendErrorResponse(res, error.message, 400);
    }

    const event = await EventServices.getEventById(Number(eventId));
    if (!event) {
      //create a log
      logger.error(`Event not found: ${eventId}`);
      return sendErrorResponse(res, "Event not found", 404);
    }

    //create a log
    logger.info(`Event status retrieved: ${event.title} (ID: ${event.id})`);
    return sendSuccessResponse(res, 'Event status retrieved successfully', 200, { availableTickets: event.availableTickets, waitingListCount: event?.waitlists.length ?? 0 });

  } catch (error) {
    console.log(error);
    next(new AppError('Failed to get event status', 500));
  }
}