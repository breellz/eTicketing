import bcrypt from "bcryptjs";
import datasource from "../../database/postgres";
import { User } from "../../entities/user.entity";


export const populateDB = async () => {

  try {
    const userOne = {
      username: "user1",
      password: await bcrypt.hash("password1", 8)
    }

    const userTwo = {
      username: "user2",
      password: await bcrypt.hash("password2", 8)
    }

    const userRepo = datasource.getRepository(User);
    const exisitngUserOne = await userRepo.findOne({ where: { username: userOne.username } });
    const exisitngUserTwo = await userRepo.findOne({ where: { username: userTwo.username } });

    if (!exisitngUserOne) {
      await userRepo.save(userOne);
    }

    if (!exisitngUserTwo) {
      await userRepo.save(userTwo);
    }

    console.log("Database populated successfully");

  } catch (error) {
    throw new Error("Unable to populate database");
  }
}