
import { ObjectType } from 'typeorm';
import datasource from "../../database/postgres";
import { User } from "../../entities/user.entity";
import { Event } from "../../entities/event.entity";
import bcrypt from "bcryptjs";
import { Booking } from '../../entities/bookings.entity';

export const userData = [
  {
    username: 'John',
    password: '1234',
  },
  {
    username: 'Johndoe',
    password: '1234',
  }, {
    username: 'Johnray',
    password: '1234',
  },
]


export const eventData = [
  {
    title: 'Event 1',
    description: 'Event 1 description',
    date: new Date(),
    location: 'Lagos',
    availableTickets: 100,
  },
  {
    title: 'Event 2',
    description: 'Event 2 description',
    date: new Date(),
    location: 'Abuja',
    availableTickets: 0,
  },
  {
    title: 'Event 3',
    description: 'Event 3 description',
    date: new Date(),
    location: 'Ibadan',
    availableTickets: 100,
  },
]




export const setUpDb = async () => {

  const userDataWithBcrypt = await Promise.all(userData.map(async (user) => {
    return {
      ...user,
      password: await bcrypt.hash(user.password, 8)
    }
  }));
  const userRepository = datasource.getRepository(User);
  const users = userRepository.create(userDataWithBcrypt);
  await userRepository.save(users);

  const eventReposiotry = datasource.getRepository(Event);
  const events = eventReposiotry.create(eventData);
  await eventReposiotry.save(events);

  //create a booked event
  const userOne = await userRepository.findOne({ where: { username: userData[0].username } });
  const eventOne = await eventReposiotry.findOne({ where: { title: eventData[0].title } });
  await datasource.getRepository(Booking).save({ user: userOne!, event: eventOne! });

  console.log("DB populated successfully")
}



export const clearDatabase = async () => {
  const entityMetadatas = datasource.entityMetadatas;
  const orderOfDeletion = ['WaitList', 'Booking', 'Event', 'User'];
  for (const entityName of orderOfDeletion) {
    const metadata = entityMetadatas.find(metadata => metadata.name === entityName);
    if (metadata) {
      const repository = datasource.getRepository(metadata.target as ObjectType<any>);
      await repository.delete({});
    }
  }
};
