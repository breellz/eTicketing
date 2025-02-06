import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../entities/user.entity";
import bcrypt from "bcryptjs";
import datasource from "../database/postgres";
import AppError from "../utils/helpers/errorHandler";

export interface CustomRequest extends Request {
  user?: IUser;
}

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {


    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      throw new Error("Header not found");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");

    if (!username || !password) {
      throw new Error("Invalid credentials");
    }

    const userRepository = datasource.getRepository(User)
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    req.user = user;
    return next();

  } catch (error) {
    next(new AppError(error.message, 401));
  }
};