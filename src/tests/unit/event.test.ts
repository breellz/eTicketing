import { Request, Response, NextFunction } from 'express';
import { createEvent, getEventStatus } from '../../controller/event.controller';
import { createEventValidation } from '../../utils/helpers/validators/event-validators';
import EventServices from '../../services/event';
import { sendErrorResponse, sendSuccessResponse } from '../../utils/helpers/responseHandler';
import AppError from '../../utils/helpers/errorHandler';

jest.mock('../../services/event', () => ({
  createEvent: jest.fn(),
  getEventById: jest.fn(),
}));

jest.mock('../../utils/helpers/responseHandler', () => ({
  sendErrorResponse: jest.fn(),
  sendSuccessResponse: jest.fn(),
}));

describe('Create Event test', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    req = {
      params: {
        eventId: "1",
      },
      body: {
        title: 'Test Event',
        description: 'This is a test event',
        date: '2025-11-02',
        location: 'Test Location',
        availableTickets: 100,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should create a new event successfully', async () => {
    const mockEvent = { id: 1, ...req.body };

    (EventServices.createEvent as jest.Mock).mockResolvedValue(mockEvent);

    (sendSuccessResponse as jest.Mock).mockImplementation((res, message, statusCode, data) => {
      res.status(statusCode).send({ status: 'success', statusCode, message, data });
    });

    await createEvent(req as Request, res as Response, next as NextFunction);

    expect(EventServices.createEvent).toHaveBeenCalledWith(req.body);
    expect(sendSuccessResponse).toHaveBeenCalled();
  });

  it('should return validation error if input is invalid', async () => {
    req.body.title = '';
    const validationError = createEventValidation(req.body).error;
    (sendErrorResponse as jest.Mock).mockImplementation((res, message, statusCode) => {
      res.status(statusCode).send({ error: message });
    });

    await createEvent(req as Request, res as Response, next as NextFunction);

    expect(sendErrorResponse).toHaveBeenCalledWith(res, validationError?.message, 400);
  });

  it('should handle service errors', async () => {
    const serviceError = new Error('Service error');
    (EventServices.createEvent as jest.Mock).mockRejectedValue(serviceError);

    await createEvent(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(new AppError('Failed to create event', 500));
  });

  it("should get event status", async () => {

    (sendSuccessResponse as jest.Mock).mockImplementation((res, message, statusCode, data) => {
      res.status(statusCode).send({ status: 'success', statusCode, message, data });
    });

    await getEventStatus(req as Request, res as Response, next as NextFunction);

    expect(EventServices.getEventById).toHaveBeenCalledWith(Number(req.params!.eventId));
    expect(sendSuccessResponse).toHaveBeenCalled();
  })
});