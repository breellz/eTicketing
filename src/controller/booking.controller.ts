import { Response, NextFunction } from "express";
import { CustomRequest } from "../middleware/auth";
import AppError from "../utils/helpers/errorHandler";
import { sendErrorResponse, sendSuccessResponse } from "../utils/helpers/responseHandler";
import { bookEventValidation } from "../utils/helpers/validators/event-validators";
import EventServices from "../services"
import logger from "../utils/helpers/logger";

export const bookEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { eventId } = req.params;
  try {

    const { error } = bookEventValidation({ eventId });

    if (error) {
      return sendErrorResponse(res, error.message, 400);
    }

    const event = await EventServices.getEventById(Number(eventId));
    if (!event) {
      return sendErrorResponse(res, "Event not found", 404);
    }

    // Check if event is already booked by user
    const isBooked = await EventServices.isEventBookedByUser(req.user!.id, Number(eventId));
    if (isBooked) {
      logger.info(`User ${req.user!.username} (ID: ${req.user!.id}) tried to book event ${event.title} (ID: ${event.id}) again`);
      return sendErrorResponse(res, "Event already booked by user", 400);
    }

    //Add to waitlist if no available tickets
    if (event.availableTickets === 0) {

      const response = await EventServices.addToWaitList(req.user!.id, Number(eventId));
      //create a log
      logger.info(`User ${req.user!.username} (ID: ${req.user!.id}) added to waitlist for event ${event.title} (ID: ${event.id})`);
      return sendSuccessResponse(res, response.message, 200);
    }

    // Book event
    const response = await EventServices.bookEvent(req.user!.id, Number(eventId));
    //create a log

    logger.info(`User ${req.user!.username} (ID: ${req.user!.id}) booked event ${event.title} (ID: ${event.id})`);
    return sendSuccessResponse(res, response.message, 200);
  } catch (error) {
    console.log(error)
    next(new AppError('Failed to book event', 500));
  }
}

export const cancelBooking = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { eventId } = req.params;
  try {
    const { error } = bookEventValidation({ eventId });
    if (error) {
      return sendErrorResponse(res, error.message, 400);
    }

    const event = await EventServices.getEventById(Number(eventId));
    if (!event) {
      return sendErrorResponse(res, "Event not found", 404);
    }

    // Check if event is already booked by user
    const isBooked = await EventServices.isEventBookedByUser(req.user!.id, Number(eventId));
    if (!isBooked) {
      //create a log
      logger.info(`User ${req.user!.username} (ID: ${req.user!.id}) tried to cancel booking for event ${event.title} (ID: ${event.id}) which is not booked`);
      return sendErrorResponse(res, "Event not booked by user", 400);
    }

    const response = await EventServices.cancelBooking(req.user!.id, Number(eventId));

    //create a log
    logger.info(`User ${req.user!.username} (ID: ${req.user!.id}) cancelled booking for event ${event.title} (ID: ${event.id})`);
    return sendSuccessResponse(res, response.message, 200);

  } catch (error) {
    console.log(error)
    next(new AppError('Failed to cancel booking', 500));
  }
}