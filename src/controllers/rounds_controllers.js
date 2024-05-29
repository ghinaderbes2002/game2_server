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
        roundId,
        word: word.split(":")[0],
        seconds: parseInt(word.split(":")[1]),
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
    const { name } = request.query;

    const round = await prisma.round.findUnique({
      where: { name: name },
    });
    if (!round) {
      return response
        .code(404)
        .send({ state: "false", error: "Round not found" });
    }
    const roundId = round.id;
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

    // First, find the round by name to get the roundId
    const round = await prisma.round.findUnique({
      where: { name: name },
    });

    if (!round) {
      return response
        .code(404)
        .send({ state: "false", error: "Round not found" });
    }

    const roundId = round.id;

    // Delete existing words for the round
    await prisma.word.deleteMany({
      where: { roundId: roundId },
    });

    // Insert new words for the round
    const newWords = await prisma.word.createMany({
      data: words.map((word) => ({
        roundId: roundId,
        word: word.split(":")[0],
        seconds: parseInt(word.split(":")[1]),
      })),
    });

    // Update the round with the new name
    const updatedRound = await prisma.round.update({
      data: { name: name },
      where: { id: roundId },
    });

    // Send the response
    response
      .code(201)
      .send({ state: "success", round: updatedRound, newWords });
  } catch (error) {
    console.error("Update error:", error);
    response.code(500).send({ state: "false", error: "Internal server error" });
  }
};

export const getPlayerOfWeek = async (req, res) => {
  try {
    // Calculate start and end dates of the current week (assuming week starts on Saturday and ends on Friday)
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    // Calculate start of the week (Saturday)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - ((currentDay + 1) % 7));
    startDate.setHours(0, 0, 0, 0);

    // Calculate end of the week (Friday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // Query logs for the current week
    const logs = await prisma.log.findMany({
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

    if (logs.length === 0) {
      return res.status(200).send({
        state: "success",
        highestScore: 0,
        playerWithHighestScore: null,
      });
    }

    // Group logs by userId and sum scores
    const userScores = {};
    logs.forEach((log) => {
      if (!userScores[log.userId]) {
        userScores[log.userId] = 0;
      }
      userScores[log.userId] += log.score;
    });

    // Find user with the highest score
    let highestScore = 0;
    let playerIdWithHighestScore = null;
    for (const userId in userScores) {
      if (userScores[userId] > highestScore) {
        highestScore = userScores[userId];
        playerIdWithHighestScore = userId;
      }
    }

    // Fetch user details for the player with the highest score
    const playerWithHighestScore = playerIdWithHighestScore
      ? await prisma.user.findUnique({
          where: {
            id: parseInt(playerIdWithHighestScore),
          },
        })
      : null;

    res
      .status(200)
      .send({ state: "success", highestScore, playerWithHighestScore });
  } catch (error) {
    console.error(
      "Error fetching player with highest score for current week:",
      error
    );
    res.status(500).send({ error: "Internal server error" });
  }
};

export const getOpenRounds = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.code(400).send({ error: "User ID is required" });
    }

    // Fetch distinct rounds based on logs related to the user
    const rounds = await prisma.round.findMany({
      where: {
        logs: {
          some: {
            userId: parseInt(parseInt(userId), 10),
          },
        },
      },
      distinct: ["id"],
    });

    res.code(200).send(rounds);
  } catch (error) {
    console.error(error);
    res
      .code(500)
      .send({ error: "An error occurred while fetching the rounds" });
  }
};
