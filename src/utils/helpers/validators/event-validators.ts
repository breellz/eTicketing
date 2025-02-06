import Joi from "joi";


export interface ICreateEventData {
  title: string;
  description?: string;
  date: Date;
  location: string;
  availableTickets: number;
}

const createEventValidation = (data: ICreateEventData) => {
  const schema = Joi.object({
    title: Joi.string().required().max(30),
    description: Joi.string().allow("").optional(),
    date: Joi.date().required().custom((value, helpers) => {
      if (new Date(value) < new Date()) {
        throw new Error("Date must be greater than today's date");
      }
      return value;
    }),
    location: Joi.string().required().max(30),
    availableTickets: Joi.number().positive().required(),
  });
  return schema.validate(data);
};

const bookEventValidation = (data: { eventId: string }) => {
  const schema = Joi.object({
    eventId: Joi.number().required(),
  });
  return schema.validate(data);
}

export {
  createEventValidation,
  bookEventValidation
};

