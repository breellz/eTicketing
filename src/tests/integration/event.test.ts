import supertest from "supertest";
import { main } from "../../app";
import datasource from "../../database/postgres";
import { Event } from "../../entities/event.entity";
import { clearDatabase, eventData, setUpDb, userData } from "../fixtures/setupDatabase";
jest.setTimeout(300000);

let app: any

beforeAll(async () => {
  app = await main();
  await clearDatabase();
  await setUpDb();
});

afterAll(async () => {
  await clearDatabase();
  await datasource.destroy();
});

describe("Event integration test", () => {
  it("Should create a new event", async () => {
    const response = await supertest(app).post("/initialize").send({
      title: "Test Event",
      description: "This is a test event",
      date: "2025-10-10",
      location: "Lagos",
      availableTickets: 100,
    });

    expect(response.body.status).toBe("success");
    expect(response.body.statusCode).toBe(201);
    expect(response.body.message).toBe("Event created successfully");
    expect(response.body).toHaveProperty("data");
  })

  it("Should return an error if the event data is invalid", async () => {
    const response = await supertest(app).post("/initialize").send({
      title: "Test Event",
      description: "This is a test event",
      date: "2025-10-10",
      location: "Lagos",
    });

    expect(response.body.status).toBe("error");
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe("\"availableTickets\" is required");
  })

  describe("Booking integration test", () => {
    it("Should book an event", async () => {

      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[2].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[2];
      const eventId = event?.id;
      const response = await supertest(app).post(`/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('success')
      expect(response.body.statusCode).toBe(200)
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Event booked successfully");
    })

    it("Should add to waitlist for an event with no available tickets", async () => {

      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[1].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[1];
      const eventId = event?.id;
      const response = await supertest(app).post(`/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('success')
      expect(response.body.statusCode).toBe(200)
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Added to waitlist");
    })

    it("should return error if eventId is invalid", async () => {
      const userOne = userData[0];
      const response = await supertest(app).post(`/book/1000`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('error')
      expect(response.body.statusCode).toBe(404)
      expect(response.body.message).toBe("Event not found")
    })

    it("should return error if event is already booked by user", async () => {
      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[0].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[0];
      const eventId = event?.id;
      const response = await supertest(app).post(`/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('error')
      expect(response.body.statusCode).toBe(400)
      expect(response.body.message).toBe("Event already booked by user")
    })

    it(" should add to waitlist if no available tickets", async () => {
      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[1].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[0];
      const eventId = event?.id;
      const response = await supertest(app).post(`/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('success')
      expect(response.body.statusCode).toBe(200)
      expect(response.body.message).toBe("Added to waitlist")
    })

  })

  describe("Cancelling booking integration test", () => {
    it("should cancel an event with no waitList", async () => {

      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[0].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[0];
      const eventId = event?.id;
      const response = await supertest(app).post(`/cancel/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('success')
      expect(response.body.statusCode).toBe(200)
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Event booking cancelled");
    })

    it("should return error if eventId is invalid", async () => {
      const userOne = userData[0];
      const response = await supertest(app).post(`/cancel/1000`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('error')
      expect(response.body.statusCode).toBe(404)
      expect(response.body.message).toBe("Event not found")
    })

    it("should return error if event is not booked by user", async () => {
      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[0].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userTwo = userData[2];
      const eventId = event?.id;
      const response = await supertest(app).post(`/cancel/${eventId}`)
        .auth(`${userTwo.username}`, `${userTwo.password}`)
        .send()

      expect(response.body.status).toBe('error')
      expect(response.body.statusCode).toBe(400)
      expect(response.body.message).toBe("Event not booked by user")
    })

  })

})
