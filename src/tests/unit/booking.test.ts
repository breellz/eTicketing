import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../../middleware/auth';
import { bookEvent, cancelBooking } from '../../controller/booking.controller';
import EventServices from '../../services';
import { sendErrorResponse, sendSuccessResponse } from '../../utils/helpers/responseHandler';

//mocking frunctions in the event service so they are not actually called, 
// because I want to test in isolation
jest.mock('../../services', () => ({
  getEventById: jest.fn(),
  isEventBookedByUser: jest.fn(),
  addToWaitList: jest.fn(),
  bookEvent: jest.fn(),
  cancelBooking: jest.fn(),
}));

jest.mock('../../utils/helpers/responseHandler', () => ({
  sendErrorResponse: jest.fn(),
  sendSuccessResponse: jest.fn(),
}));

describe('Create Booking test', () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;
  // I'm creating my own request and response objects to test the controller functions
  beforeEach(() => {
    req = {
      params: {
        eventId: "1",
      },
      user: {
        id: 1,
        username: '',
        password: '',
        bookings: [],
        waitlists: [],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.resetAllMocks()
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should book a new event successfully', async () => {

    (sendSuccessResponse as jest.Mock).mockImplementation((res, message, statusCode, data) => {
      res.status(statusCode)
    });

    (EventServices.getEventById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Test Event',
      description: 'This is a test event',
      date: '2025-11-02',
      location: 'Test Location',
      availableTickets: 100,
    });

    (EventServices.isEventBookedByUser as jest.Mock).mockResolvedValue(false);

    (EventServices.bookEvent as jest.Mock).mockResolvedValue({ message: 'Event booked successfully' });
    await bookEvent(req as Request, res as Response, next as NextFunction);

    expect(EventServices.bookEvent).toHaveBeenCalledWith(req.user!.id, Number(req.params!.eventId));
    expect(sendSuccessResponse).toHaveBeenCalled();
  });

  it("should return an error if eventId is invalid", async () => {
    req.params!.eventId = "invalid";
    await bookEvent(req as Request, res as Response, next as NextFunction);

    expect(sendErrorResponse).toHaveBeenCalled();

  })

  it("should return an error if event is not found", async () => {
    (EventServices.getEventById as jest.Mock).mockResolvedValue(null);
    await bookEvent(req as Request, res as Response, next as NextFunction);

    expect(sendErrorResponse).toHaveBeenCalled();
  })

  it("should return an error if event is already booked by user", async () => {
    (EventServices.getEventById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Test Event',
      description: 'This is a test event',
      date: '2025-11-02',
      location: 'Test Location',
      availableTickets: 100,
    });

    (EventServices.isEventBookedByUser as jest.Mock).mockResolvedValue(true);
    await bookEvent(req as Request, res as Response, next as NextFunction);

    expect(sendErrorResponse).toHaveBeenCalled();
  })

  it("should add to waitlist if no available tickets", async () => {

    (EventServices.getEventById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Test Event',
      description: 'This is a test event',
      date: '2025-11-02',
      location: 'Test Location',
      availableTickets: 0,
    });

    (EventServices.addToWaitList as jest.Mock).mockResolvedValue({ message: "Added to waitlist" });
    await bookEvent(req as Request, res as Response, next as NextFunction);

    expect(EventServices.addToWaitList).toHaveBeenCalled();
  })

  describe("Booking cancellation test", () => {
    it("should successfully cancel a booking", async () => {
      (sendSuccessResponse as jest.Mock).mockImplementation((res, message, statusCode, data) => {
        res.status(statusCode)
      });

      (EventServices.getEventById as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'Test Event',
        description: 'This is a test event',
        date: '2025-11-02',
        location: 'Test Location',
        availableTickets: 100,
      });

      (EventServices.isEventBookedByUser as jest.Mock).mockResolvedValue(true);

      (EventServices.cancelBooking as jest.Mock).mockResolvedValue({ message: 'Booking cancelled successfully' });
      await cancelBooking(req as Request, res as Response, next as NextFunction);

      expect(EventServices.cancelBooking).toHaveBeenCalled();
      expect(sendSuccessResponse).toHaveBeenCalled();
    })

    it("should return an error if eventId is invalid", async () => {
      req.params!.eventId = "invalid";
      await cancelBooking(req as Request, res as Response, next as NextFunction);

      expect(sendErrorResponse).toHaveBeenCalled();

    })

    it("should return an error if event is not found", async () => {
      (EventServices.getEventById as jest.Mock).mockResolvedValue(null);
      await cancelBooking(req as Request, res as Response, next as NextFunction);

      expect(sendErrorResponse).toHaveBeenCalled();
    })

    it("should return an error if event is not booked by user", async () => {
      (EventServices.getEventById as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'Test Event',
        description: 'This is a test event',
        date: '2025-11-02',
        location: 'Test Location',
        availableTickets: 100,
      });

      (EventServices.isEventBookedByUser as jest.Mock).mockResolvedValue(false);
      await cancelBooking(req as Request, res as Response, next as NextFunction);

      expect(sendErrorResponse).toHaveBeenCalled();
    })
  })
});