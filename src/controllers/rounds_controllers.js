import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRound = async (request, response) => {
  try {
    const { name, words } = request.body;
    const round = await prisma.round.create({
      data: {
        name,
      },
    });
    const roundId = round.id;
    const createdWords = await prisma.word.createMany({
      data: words.map((word) => ({
        word,
        roundId,
      })),
    });
    response.code(201).send({ state: "success" });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const getRound = async (request, response) => {
  try {
    const rounds = await prisma.round.findMany({
      include: { words: true },
    });
    response.code(201).send({ state: "success", rounds });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const getRoundone = async (request, response) => {
  try {
    const { roundId } = request.query;
    const words = await prisma.round.findUnique({
      include: { words: true },
      where: { id: parseInt(roundId) },
    });
    response.code(201).send({ state: "success", words });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const deleteRound = async (request, response) => {
  try {
    const { roundId } = request.query;
    await prisma.word.deleteMany({
      where: { roundId: parseInt(roundId) },
    });

    await prisma.round.delete({
      where: { id: parseInt(roundId) },
    });
    response.code(201).send({ state: "success" });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const updateRound = async (request, response) => {
  try {
    const { name, words } = request.body;
    const { roundId } = request.query;
    await prisma.word.deleteMany({
      where: { roundId: parseInt(roundId) },
    });
    const newWords = await prisma.word.createMany({
      data: words.map((word) => ({
        word,
        roundId: parseInt(roundId),
      })),
    });
    const round = await prisma.round.update({
      data: { name: name },
      where: { id: parseInt(roundId) },
    });
    response.code(201).send({ state: "success", round, newWords });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const getPlayerOfWeek = async (request, response) => {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - currentDay);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (6 - currentDay));

    const log = await prisma.log.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        userId: true,
        score: true,
      },
    });
    const userScores = {};
    logs.forEach((log) => {
      if (!userScores[log.userId]) {
        userScores[log.userId] = 0;
      }
      userScores[log.userId] += log.score;
    });
    let highestScore = 0;
    let playerIdWithHighestScore = null;

    for (const userId in userScores) {
      if (userScores[userId] > highestScore) {
        highestScore = userScores[userId];
        playerIdWithHighestScore = userId;
      }
    }
    response.code(201).send({ state: "success", userScores });
  } catch (error) {
    console.error("Registration error :", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};
