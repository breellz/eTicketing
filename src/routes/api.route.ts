import { Router } from "express";
import { bookEvent, cancelBooking } from "../controller/booking.controller";
import { createEvent, getEventStatus } from "../controller/event.controller";
import { auth } from "../middleware/auth";

export const apiRouter = Router();

apiRouter.post("/initialize", createEvent);
apiRouter.post("/book/:eventId", auth, bookEvent);
apiRouter.post("/cancel/:eventId", auth, cancelBooking);
apiRouter.get("/status/:eventId", getEventStatus);
