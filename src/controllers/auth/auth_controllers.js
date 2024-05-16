import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const signupController = async (request, response) => {
  try {
    const { user_name, pass } = request.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);
    await prisma.user.create({
      data: {
        name: user_name,
        password: passwordHash,
      },
    });
    response.code(201).send({ state: "success" });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const loginController = async (request, response) => {
  try {
    const { user_name, pass } = request.body;
    const user = await prisma.user.findUnique({
      where: {
        name: user_name,
      },

      include: {
        logs: true,
      },
    });

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch == true) {
        const token = jwt.sign({ id: user_name }, process.env.JWT_SECRET);
        response.send({ state: "success", token, user });
      } else {
        response.send({ state: "false", massge: "wrong password" });
      }
    } else {
      response.code(400).send({ state: "false", massge: "User not found" });
    }
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};
